// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the card routes (make sure this file exists in your routes folder)
const cardRoutes = require('./routes/cards');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/pokemonCards', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Optional: Increase server selection timeout for debugging
  // serverSelectionTimeoutMS: 30000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
app.get('/', (req, res) => {
  res.send('Welcome to the Pokémon Card API!');
});
// Use the card routes for any request starting with /api/cards
app.use('/api/cards', cardRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
