const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config(); // Load .env variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handle dream submission and store it
app.post('/submit-dream', (req, res) => {
  const { dream } = req.body;
  const file = 'dreams.json';

  // Read existing dreams or start new array
  const data = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : [];

  data.push({ dream, timestamp: new Date() });

  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  res.json({ message: 'Dream received!' });
});

// Get all submitted dreams
app.get('/dreams', (req, res) => {
  const file = 'dreams.json';
  const data = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : [];

  res.json(data);
});

// Generate a story from dream using OpenRouter
app.post('/generate-story', async (req, res) => {
  const { dream } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [
          {
            role: 'system',
            content:
              "You are a children’s story writer. Only write magical, short stories in paragraph form. Do NOT write poems. The tone should be fun and imaginative, like a bedtime tale."
          },
          {
            role: 'user',
            content: `Turn this dream into a short magical story: ${dream}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // or your deployed frontend domain
          'Content-Type': 'application/json'
        }
      }
    );

    const story = response.data.choices[0].message.content;
    res.json({ story });

  } catch (error) {
    // Improved error logging and feedback
    console.error("OpenRouter Error:", error.response?.data || error.message);

    res.status(500).json({
      story: null,
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Start the backend server
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
