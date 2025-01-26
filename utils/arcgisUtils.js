const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const getCoordinatesFromAddress = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const apiKey = process.env.GOOGLE_API_KEY; // Ensure your API key is stored in an environment variable
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };
    } else {
        throw new Error('Unable to geocode address: ' + data.status);
    }
};

module.exports = { getCoordinatesFromAddress };