const express = require('express');
const { matchDonations } = require('../Controllers/MatchController.js');

const router = express.Router();

router.post('/match-donations', matchDonations);

module.exports = router;