const express = require('express');
const router = express.Router();
const {
    createTable,
    insertData,
    queryData,
    createDonor,
    getDonor,
    createHospital,
    getHospital,
    createDonation,
    getDonationsByDonor,
    getDonationsByHospital,
    createRequest,
    getRequestsByHospital
  } = require('../models/db');;

  

// DB Routes
router.get('/create-table', async (req, res) => {
    try {
        await createTable();
        res.status(200).json({ message: 'Table created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/insert-data', async (req, res) => {
    const { id, text } = req.body;
    try {
        await insertData(id, text);
        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/query-data', async (req, res) => {
    try {
        const result = await queryData();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Donor Routes
router.post('/post-donor', async (req, res) => {
    const { org_name, org_description, email, phone, location } = req.body;
    try {
      await createDonor(org_name, org_description, email, phone, location);
      res.status(200).json({ message: 'Donor created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/get-donor/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getDonor(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Hospital Routes
router.post('/post-hospital', async (req, res) => {
    const { name, location, contacts } = req.body;
    try {
      await createHospital(name, location, contacts);
      res.status(200).json({ message: 'Hospital created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/get-hospital/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getHospital(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Donations Routes
router.post('/post-donation', async (req, res) => {
    const { item_name, item_description, quantity, donor_id, received, expiry_date, pickup_or_delivery } = req.body;
    try {
      await createDonation(item_name, item_description, quantity, donor_id, received, expiry_date, pickup_or_delivery);
      res.status(200).json({ message: 'Donation created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/get-donations-by-donor/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getDonationsByDonor(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/get-donations-by-hospital/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getDonationsByHospital(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//   Request Routes
router.post('/post-request', async (req, res) => {
    const { description, quantity, pickup_or_delivery, hospital_id } = req.body;
    try {
      await createRequest(description, quantity, pickup_or_delivery, hospital_id);
      res.status(200).json({ message: 'Request created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/get-requests-by-hospital/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getRequestsByHospital(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;