const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getGiftRecommendation = async (inventory, wait_time, triage_category) => {
    const prompt = `
    Inventory: ${inventory}
    Patient wait time: ${wait_time} minutes
    Triage category: ${triage_category}

    Triage Categories:
    RESUSCITATION (Blue) - Severely ill
    EMERGENT (Red) - Requires rapid intervention
    URGENT (Yellow) - Requires urgent care
    LESS_URGENT (Green) - Requires less-urgent care
    NON_URGENT (White) - Requires non-urgent care

    Based on the above information, recommend an appropriate gift from the inventory.
    Consider longer wait times and higher triage categories (more severe) should receive
    more engaging or comforting gifts. Provide your recommendation in the format:
    Recommended Gift: [Gift Name]
    Reason: [Brief explanation]
    Explanation for Child: [How the child can use the toy]
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a gift recommendation assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const llm_response = response.choices[0].message.content.trim();
        return llm_response;
    } catch (error) {
        console.error("Error generating gift recommendation:", error);
        throw new Error(`Failed to generate gift recommendation: ${error.message}`);
    }
};

module.exports = { getGiftRecommendation };