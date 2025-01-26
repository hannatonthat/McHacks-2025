const express = require('express');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const session = require('express-session');
const axios = require('axios');
const fs = require('fs');
const https = require('https');

// ENV
dotenv.config();

// Express App
const app = express();

// Middleware
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  secret: process.env.SESSION_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  routes: {
    login: false,
    callback: process.env.AUTH0_CALLBACK_URL,
  },
};

app.use(auth(config));

// Routes Import
const MainRoutes = require('./routes/MainRoutes');
const PatientRoutes = require('./routes/PatientRoutes');
const MatchRoutes = require('./routes/MatchRoutes')

// Routes
app.use('/api/main/', MainRoutes);
app.use('/api/patient/', PatientRoutes);
app.use('/api/match/', MatchRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Login Route
app.get("/login", (req, res) => {
  res.oidc.login({
    authorizationParams: {
      scope: "openid profile email", // Request basic user information
    },
  });
  console.log("Login route");
});

// Registration endpoint
app.get("/register", async (req, res) => {
  const role = req.query.role;
  console.log(`role: ${role}`);

  if (!role || (role !== "donator" && role !== "hospital")) {
    return res.status(400).send("Invalid role selected.");
  }

  res.oidc.login({
    authorizationParams: {
      screen_hint: "signup",
      state: JSON.stringify({ role }),
    },
  });
});

// Callback endpoint to handle Auth0 response
app.get("/callback", (req, res) => {
  // Parse state parameter from the callback
  const state = req.query.state ? JSON.parse(decodeURIComponent(req.query.state)) : {};
  console.log("State parameter:", state);

  // Get user info from Auth0
  const user = req.oidc.user;
  console.log("User information on /callback:", user);

  // Redirect to the home page after successful login
  res.redirect('/');
});

// Profile Route
app.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.redirect('/login');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL, // Redirect to the home page after logout
  });
});

// Read SSL certificate and key
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Start the HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Backend running on https://localhost:${PORT}`);
});