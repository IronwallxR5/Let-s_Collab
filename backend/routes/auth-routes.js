const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout, googleAuthCallback } = require('../controllers/auth');

// all routes for auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  googleAuthCallback
);

module.exports = router;