import axios from "axios"


const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const model = "openai/gpt-oss-120b:free";

const generateResponse = async (message) => {

    try {
        if (!message || !Array.isArray(message) || message.length === 0) {
            throw new Error("message array is empty")
        }

        const response = await axios.post(
            openRouterUrl,
            {
                model: model,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        )

        const content = response?.data?.choices[0].message?.content;

        if (!content) {
            throw new Error("AI returned return empty string")
        }

        return content
    } catch (error) {
        console.error(error.message);
        throw new Error("Open router Error")

    }
}

export default generateResponse;