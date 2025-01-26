const { DBSQLClient } = require('@databricks/sql');
const { calculateMatchScore } = require('../utils/matchAlgorithm');
require('dotenv').config();

const host = process.env.DATABRICKS_HOST;
const path = process.env.DATABRICKS_PATH;
const token = process.env.DATABRICKS_TOKEN;

async function execute(session, statement) {
  const operation = await session.executeStatement(statement, { runAsync: true });
  const result = await operation.fetchAll();
  await operation.close();
  return result;
}

const client = new DBSQLClient();

async function createTable() {
  try {
    const session = await client.openSession();
    await execute(session, 'CREATE TABLE IF NOT EXISTS example (id INT, text VARCHAR(20))');
    await session.close();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

async function insertData(id, text) {
  try {
    const session = await client.openSession();
    await execute(session, `INSERT INTO example VALUES (${id}, '${text}')`);
    await session.close();
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

async function queryData() {
  try {
    const session = await client.openSession();
    const result = await execute(session, 'SELECT * FROM mchacks.donors.donorinfo');
    await session.close();
    return result;
  } catch (error) {
    console.error('Error querying data:', error);
  }
}

// Donor Methods
async function createDonor(org_name, org_description, email, phone, location) {
  try {
    const session = await client.openSession();
    await execute(session, `INSERT INTO mchacks.donors.donorinfo (org_name, org_description, email, phone, location) VALUES ('${org_name}', '${org_description}', '${email}', '${phone}', '${location}')`);
    await session.close();
  } catch (error) {
    console.error('Error creating donor:', error);
  }
}

async function getDonor(donor_id) {
  try {
    const session = await client.openSession();
    const result = await execute(session, `SELECT * FROM mchacks.donors.donorinfo WHERE donor_id = ${donor_id}`);
    await session.close();
    return result[0];
  } catch (error) {
    console.error('Error getting donor:', error);
  }
}

// Hospital Methods
async function createHospital(name, location, contacts) {
  try {
    const session = await client.openSession();
    await execute(session, `INSERT INTO mchacks.hospitals.hospitalinfo (name, location, contacts) VALUES ('${name}', '${location}', '${contacts}')`);
    await session.close();
  } catch (error) {
    console.error('Error creating hospital:', error);
  }
}

async function getHospital(hospital_id) {
  try {
    const session = await client.openSession();
    const result = await execute(session, `SELECT * FROM mchacks.hospitals.hospitalinfo WHERE hospital_id = ${hospital_id}`);
    await session.close();
    return result[0];
  } catch (error) {
    console.error('Error getting hospital:', error);
  }
}

// Donation Methods
async function createDonation(item_name, item_description, quantity, donor_id, received, expiry_date, pickup_or_delivery) {
  try {
    const session = await client.openSession();

    // Fetch all hospitals
    const hospitalsResult = await execute(session, 'SELECT * FROM mchacks.hospitals.hospitalinfo');
    const hospitals = hospitalsResult.map(row => ({
      hospital_id: row.hospital_id,
      location: row.location,
      requests: [] // Placeholder, will be filled later
    }));

    // Fetch all donation items
    const donationItemsResult = await execute(session, 'SELECT * FROM mchacks.donations.donationitems');
    const donationItems = donationItemsResult.map(row => ({
      donation_id: row.donation_id,
      item_name: row.item_name,
      donor_id: row.donor_id,
      hospital_id: row.hospital_id
    }));

    // Fetch donor info
    const donorResult = await execute(session, `SELECT * FROM mchacks.donors.donorinfo WHERE donor_id = ${donor_id}`);
    const donor = donorResult[0];
    donor.donations = donationItems.filter(item => item.donor_id === donor_id);

    // Define weights for matching algorithm
    const weights = { w1: 0.5, w2: 0.3, w3: 0.2 };

    // Run the matching algorithm for each hospital
    let bestMatch = null;
    let bestScore = -Infinity;

    for (const hospital of hospitals) {
      // Fetch requests for the hospital
      const requestsResult = await execute(session, `SELECT * FROM mchacks.requests.requestinfo WHERE hospital_id = ${hospital.hospital_id}`);
      hospital.requests = requestsResult.map(row => ({
        request_id: row.request_id,
        description: row.description
      }));

      const matches = await calculateMatchScore(hospital, donor, weights, donationItems);

      if (matches.length > 0 && matches[0].totalScore > bestScore) {
        bestScore = matches[0].totalScore;
        bestMatch = hospital.hospital_id;
      }
    }

    if (!bestMatch) {
      throw new Error('No suitable hospital found for the donation');
    }

    // Insert the new donation item into the database with the chosen hospital ID
    await execute(session, `INSERT INTO mchacks.donations.donationitems (item_name, item_description, quantity, hospital_id, donor_id, received, expiry_date, pickup_or_delivery) VALUES ('${item_name}', '${item_description}', ${quantity}, ${bestMatch}, ${donor_id}, ${received}, '${expiry_date}', '${pickup_or_delivery}')`);
    await session.close();

    return bestMatch;
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
}

async function getDonationsByDonor(donor_id) {
  try {
    const session = await client.openSession();
    const result = await execute(session, `SELECT * FROM mchacks.donations.donationitems WHERE donor_id = ${donor_id}`);
    await session.close();
    return result;
  } catch (error) {
    console.error('Error getting donations by donor:', error);
  }
}

async function getDonationsByHospital(hospital_id) {
  try {
    const session = await client.openSession();
    const result = await execute(session, `SELECT * FROM mchacks.donations.donationitems WHERE hospital_id = ${hospital_id}`);
    await session.close();
    return result;
  } catch (error) {
    console.error('Error getting donations by hospital:', error);
  }
}

// Request Methods
async function createRequest(description, quantity, pickup_or_delivery, hospital_id) {
  try {
    const session = await client.openSession();
    await execute(session, `INSERT INTO mchacks.requests.requestinfo (description, quantity, pickup_or_delivery, hospital_id) VALUES ('${description}', ${quantity}, '${pickup_or_delivery}', ${hospital_id})`);
    await session.close();
  } catch (error) {
    console.error('Error creating request:', error);
  }
}

async function getRequestsByHospital(hospital_id) {
  try {
    const session = await client.openSession();
    const result = await execute(session, `SELECT * FROM mchacks.requests.requestinfo WHERE hospital_id = ${hospital_id}`);
    await session.close();
    return result;
  } catch (error) {
    console.error('Error getting requests by hospital:', error);
  }
}

// New Method: Get Request Info
async function getRequestInfo(hospital_id) {
  try {
    const session = await client.openSession();
    const result = await execute(session, `SELECT * FROM mchacks.requests.requestinfo WHERE hospital_id = ${hospital_id}`);
    await session.close();
    return result;
  } catch (error) {
    console.error('Error getting request info:', error);
  }
}

// New Method: Get Donation Items
async function getDonationItems() {
  try {
    const session = await client.openSession();
    const result = await execute(session, 'SELECT * FROM mchacks.donations.donationitems');
    await session.close();
    return result;
  } catch (error) {
    console.error('Error getting donation items:', error);
  }
}

client.connect({ host, path, token }).catch(error => {
  console.log(error);
});

module.exports = {
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
  getRequestsByHospital,
  getDonationItems,
  getRequestInfo
};