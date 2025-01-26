const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { getDistance } = require('geolib');
const { getCoordinatesFromAddress } = require('./arcgisUtils'); // Import the new function
dotenv.config();

const preprocessText = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
};

const getEmbedding = async (text) => {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            input: text,
            model: "text-embedding-ada-002",
        }),
    });

    const data = await response.json();
    return data.data[0].embedding;
};

const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

const calculateLocationScore = (hospitalCoords, donorCoords) => {
    const distanceKm = getDistance(hospitalCoords, donorCoords) / 1000; // Convert meters to kilometers
    return 1 / (1 + distanceKm); // Inverse relation
};

const calculateHistoryScore = (donationItems, donationCategory, donorId, hospitalId) => {
    const donorHistory = donationItems.filter(item => item.donor_id === donorId && item.hospital_id === hospitalId);
    const categoryCount = donorHistory.filter(item => item.item_name.toLowerCase().includes(donationCategory.toLowerCase())).length;

    let score = 1; // Neutral score

    if (categoryCount > 0) {
        score *= 1 + (categoryCount / 100); // Increase score based on donation count
    }

    return score;
};

const calculateMatchScore = async (hospital, donor, weights, donationItems) => {
    const hospitalCoords = await getCoordinatesFromAddress(hospital.location);
    const donorCoords = await getCoordinatesFromAddress(donor.location);
    const { requests } = hospital;
    const { donations, donorId } = donor; // Assume donorId is part of donor object
    const { w1, w2, w3 } = weights;

    const matches = [];

    for (const request of requests) {
        for (const donation of donations) {
            const locationScore = calculateLocationScore(hospitalCoords, donorCoords);
            const preferenceMatchScore = cosineSimilarity(
                await getEmbedding(preprocessText(request.description)),
                await getEmbedding(preprocessText(donation.item_name))
            );
            const historyScore = calculateHistoryScore(donationItems, donation.item_name, donorId, hospital.hospital_id);

            const totalScore =
                w1 * locationScore + w2 * preferenceMatchScore + w3 * historyScore;

            matches.push({
                request_id: request.request_id,
                donation_id: donation.donation_id,
                totalScore,
                details: {
                    locationScore,
                    preferenceMatchScore,
                    historyScore,
                },
            });
        }
    }

    matches.sort((a, b) => b.totalScore - a.totalScore);
    return matches;
};

module.exports = { calculateMatchScore };