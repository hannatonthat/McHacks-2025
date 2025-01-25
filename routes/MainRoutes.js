const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

// Donor Routes
router.post('/post donor', (req, res) => {});
router.post('/donate item', (req, res) => {});


// Hospital Routes
router.post('/post hospital', (req, res) => {});
router.post('/post request', (req, res) => {});

// Donations Routes
router.post('/post donation', (req, res) => {});

module.exports = router;