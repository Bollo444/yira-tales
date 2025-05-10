const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Yira Tales Backend is running!');
});

// Import story routes
const storyRoutes = require('./routes/storyRoutes');

// Use story routes
app.use('/api/story', storyRoutes);

// TODO: Add other routes as needed

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;