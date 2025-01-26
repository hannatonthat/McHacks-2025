const express = require('express');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const session = require('express-session');
const axios = require('axios');

// ENV
dotenv.config();

// Express App
const app = express();

// Middleware
app.use(express.json());

// Session Configuration
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

// Routes
app.use('/api/main/', MainRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Login Route
app.post("/login", (req, res) => {
  res.oidc.login({
    authorizationParams: {
      scope: "openid profile email", // Request basic user information
    },
  });
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
  // Redirect to the home page after successful login
  console.log('callback');
  res.send('Logged in');
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on ${process.env.BASE_URL}`);
});