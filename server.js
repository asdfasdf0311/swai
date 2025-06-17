// server.js
// Simple Express server to proxy chat requests to OpenAI API

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini', // or your preferred model
      messages: [
        { role: 'system', content: 'You are a friendly study assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Chat completion failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chat proxy running on port ${PORT}`);
});
