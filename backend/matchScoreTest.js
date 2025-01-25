import { calculateMatchScore } from "./matchScore";


const hospital = {
    location: { latitude: 40.7128, longitude: -74.0060 }, // New York City
    requests: [
        {
            request_id: "req001",
            item_name: "Board Games",
        },
        {
            request_id: "req002",
            item_name: "Art Supplies",
        },
    ],
    history: {
        acceptedCategories: ["Toys", "Games"],
        oversuppliedCategories: ["Books"],
    },
};

const donor = {
    location: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    donations: [
        {
            donation_id: "don001",
            item_name: "Board Games",
            category: "Games",
        },
        {
            donation_id: "don002",
            item_name: "Puzzles",
            category: "Toys",
        },
    ],
};

const weights = {
    w1: 0.4, // Location score weight
    w2: 0.4, // Preference match score weight
    w3: 0.2, // History score weight
};



async function testCalculateMatchScore() {
    try {
        const matches = await calculateMatchScore(hospital, DOMPointReadOnly, weights);

        console.log("Match results");
        matches.forEach((match, index) => {
            console.log(`Match #${index + 1}`);
            console.log(`Request ID: ${match.request_id}`);
            console.log(`Donation ID: ${match.donation_id}`);
            console.log(`Total Score: ${match.totalScore.toFixed(2)}`);
            console.log("Details:", match.details);
            console.log("\n");
        })
    } catch (error) {
        console.log("Error testing calculateMatchScore: ", error);
    }
}

testCalculateMatchScore();