const express = require('express');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  secret: process.env.SESSION_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  routes: {
    login: false,
    callback: "/callback",
  },
};

app.use(auth(config));

// Login endpoint
app.get("/login", (req, res) => {
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

// Callback endpoint to handle Auth0 response and assign roles
app.get("/callback", async (req, res) => {
  // Parse state parameter from the callback
  const state = req.query.state ? JSON.parse(decodeURIComponent(req.query.state)) : {};
  const role = state.role || null;

  console.log("State parameter:", state);

  // Get user info from Auth0
  const user = req.oidc.user;

  console.log("User information on /callback:", user);

  if (!role || !user) {
    return res.redirect("http://localhost:3000/unauthorized");
  }

  try {
    // Get management API token
    const tokenResponse = await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        grant_type: "client_credentials",
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch the user profile to check existing roles
    const userProfileResponse = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const existingRoles = userProfileResponse.data.app_metadata?.roles || [];

    // Only add the role if it doesn't already exist
    if (!existingRoles.includes(role)) {
      await axios.patch(
        `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}`,
        {
          app_metadata: { roles: [...existingRoles, role] },
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    // Redirect based on role
    const redirectUrl =
      role === "donator"
        ? "http://localhost:3000/donator"
        : role === "hospital"
          ? "http://localhost:3000/hospital"
          : "http://localhost:3000/unauthorized";

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error updating user role:", error.response?.data || error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});

module.exports = app;