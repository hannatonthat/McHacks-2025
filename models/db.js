const { DBSQLClient } = require('@databricks/sql');
require('dotenv').config();

const host = DATABRICKS_HOST
const path = DATABRICKS_PATH;
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
      return result;
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
      return result;
    } catch (error) {
      console.error('Error getting hospital:', error);
    }
  }

// Donation Methods
async function createDonation(item_name, item_description, quantity, hospital_id, donor_id, received, expiry_date, pickup_or_delivery) {
    try {
      const session = await client.openSession();
      await execute(session, `INSERT INTO mchacks.donations.donationitems (item_name, item_description, quantity, hospital_id, donor_id, received, expiry_date, pickup_or_delivery) VALUES ('${item_name}', '${item_description}', ${quantity}, ${hospital_id}, ${donor_id}, ${received}, '${expiry_date}', '${pickup_or_delivery}')`);
      await session.close();
    } catch (error) {
      console.error('Error creating donation:', error);
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

//   Request Methods
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
    getRequestsByHospital
  };