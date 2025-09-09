import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';

dotenv.config();

console.log('Using OpenRouter API key:', Boolean(process.env.OPENROUTER_API_KEY));
console.log('OpenRouter base URL:', 'https://openrouter.ai/api/v1');
console.log('API key is loaded:', process.env.OPENROUTER_API_KEY ? 'YES' : 'NO');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://yourdomain.com', // replace with your domain or localhost for development
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
      max_tokens: 3700,
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenRouter API' });
  }
});

app.post('/app', (req, res) => {
  res.send('Hello World');
});

app.get('/health', (req, res) => {
  res.send('Server is healthy');
});

async function checkHealth() {
  const url = 'https://chatbot-api-mlda.onrender.com/health';

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      console.log('Health check successful:', response.data);
      return true;
    } else {
      console.log('Health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Health check error:', error.message);
    return false;
  }
}

checkHealth();

setInterval(() => {
  checkHealth();
}, 8000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
