const { calculateMatchScore } = require('../utils/matchAlgorithm');
const { getDonationItems, getHospital, getDonor, getRequestInfo } = require('../models/db');

const matchDonations = async (req, res) => {
    const { hospitalId, donorId, weights } = req.body;

    try {
        const hospital = await getHospital(hospitalId);
        const donor = await getDonor(donorId);
        const donationItems = await getDonationItems();
        const requests = await getRequestInfo(hospitalId);

        hospital.requests = requests; // Ensure requests is an array
        donor.donations = donationItems.filter(item => item.donor_id === donorId);

        const matches = await calculateMatchScore(hospital, donor, weights, donationItems);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDonationItemsController = async (req, res) => {
    try {
        const donationItems = await getDonationItems();
        res.json(donationItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { matchDonations, getDonationItemsController };