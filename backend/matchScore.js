import dotenv from "dotenv";
dotenv.config();

/**
 * Preprocesses input text.
 */
const preprocessText = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
};


/**
 * Fetch text embeddings from OpenAI.
 */
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

/**
 * Calculate location score based on geodesic distance.
 */
const calculateLocationScore = (hospitalCoords, donorCoords) => {
    const distanceKm = getDistance(hospitalCoords, donorCoords) / 1000; // Convert meters to kilometers
    return 1 / (1 + distanceKm); // Inverse relation
};

/**
 * Calculate history score.
 */
const calculateHistoryScore = (hospitalHistory, donationCategory) => {
    const acceptedCategories = hospitalHistory.acceptedCategories || [];
    const oversuppliedCategories = hospitalHistory.oversuppliedCategories || [];

    if (acceptedCategories.includes(donationCategory)) {
        return 1.2; // Boost by 20%
    } else if (oversuppliedCategories.includes(donationCategory)) {
        return 0.8; // Penalize by 20%
    }
    return 1; // Neutral
};

/**
 * Main matching function.
 */
const calculateMatchScore = async (hospital, donor, weights) => {
    const { location: hospitalCoords, requests, history } = hospital;
    const { location: donorCoords, donations } = donor;
    const { w1, w2, w3 } = weights;

    const matches = [];

    for (const request of requests) {
        for (const donation of donations) {
            const locationScore = calculateLocationScore(hospitalCoords, donorCoords);
            const preferenceMatchScore = cosineSimilarity(
                await getEmbedding(preprocessText(request.item_name)),
                await getEmbedding(preprocessText(donation.item_name))
            );
            const historyScore = calculateHistoryScore(history, donation.category);

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

    // Sort by total score in descending order
    matches.sort((a, b) => b.totalScore - a.totalScore);
    return matches;
};

export { calculateMatchScore };