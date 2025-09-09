import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://yourdomain.com', // replace with your actual domain or 'http://localhost' for development
        'X-Title': 'Eco Systems',
    },
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "'messages' field is required and must be an array" });
        }

        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages,
            max_tokens: 3900, // limit tokens to your current plan's allowance
        });

        res.json(completion.choices[0].message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get response from OpenRouter API' });
    }
});

app.post('/app', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
