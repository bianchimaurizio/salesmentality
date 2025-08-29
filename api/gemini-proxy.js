const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (request, response) => {
    try {
        const body = request.body;
        const userPrompt = body.contents[0].parts[0].text;
        
        const apiKey = process.env.GOOGLE_API_KEY; 
        
        if (!apiKey) {
            return response.status(500).json({ error: "API key not configured." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

        const prompt = userPrompt;
        const result = await model.generateContent(prompt);
        const geminiResponse = await result.response;
        const text = geminiResponse.text();

        response.status(200).json({
            candidates: [{
                content: {
                    parts: [{
                        text: text
                    }]
                }
            }]
        });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        response.status(500).json({ error: "Failed to generate content." });
    }
};
