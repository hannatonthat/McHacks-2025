const express = require('express');
const { generateMockPatient } = require('../Controllers/PatientController.js');
const { getGiftRecommendation } = require('../Controllers/GiftAssignController.js');

const router = express.Router();

router.get('/mock-patient', (req, res) => {
    const mockPatient = generateMockPatient();
    res.json(mockPatient);
});

router.post('/recommend-gift', async (req, res) => {
    const { inventory, wait_time, triage_category } = req.body;

    try {
        const recommendation = await getGiftRecommendation(inventory, wait_time, triage_category);
        res.json({ recommendation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;