const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

// Home Route
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

// Profile Route
router.get('/profile', requiresAuth(), (req, res) => {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;