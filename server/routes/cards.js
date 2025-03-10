const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Correctly import node-fetch
const Card = require('../models/Card');
const { fetchCardProducts } = require('../utils/priceCharting');
const PRICECHARTING_API_KEY = process.env.PRICECHARTING_API_KEY; // Ensure this is set in your environment variables

// GET route to search for products
router.get('/search', async (req, res) => {
  const { name } = req.query;
  console.log(`Search request received for card name: ${name}`); // Log the search request
  if (!name) {
    return res.status(400).json({ message: 'Card name is required for search.' });
  }
  try {
    const products = await fetchCardProducts(name);
    console.log("Products fetched:", products); // Log the products
    res.json({ products });
  } catch (err) {
    console.error("Error in /search endpoint:", err);
    res.status(500).json({ message: 'Error fetching card products.' });
  }
});

// POST route to add a new card
router.post('/', async (req, res) => {
  const { name, set, condition, price, loosePrice, psa9Price, psa10Price, cardId } = req.body;
  const card = new Card({ name, set, condition, price, loosePrice, psa9Price, psa10Price, cardId });
  try {
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET route to fetch all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE route to delete a card
router.delete('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    await Card.deleteOne({ _id: req.params.id });
    res.json({ message: 'Card deleted' });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ message: err.message });
  }
});

// Function to generate a list of dates between a start date and an end date
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
  }
  return dates;
};

// GET route to fetch historical prices for a card
router.get('/:cardId/prices', async (req, res) => {
  const { cardId } = req.params;
  try {
    const startDate = '2024-01-01'; // Define the start date
    const endDate = '2025-03-01'; // Define the end date
    const dateRange = generateDateRange(startDate, endDate);

    const prices = await Promise.all(dateRange.map(async (date) => {
      const response = await fetch(`https://www.pricecharting.com/api/product?t=${PRICECHARTING_API_KEY}&id=${cardId}`, { timeout: 20000 }); // 20 seconds timeout
      const data = await response.json();
      return { date, price: data['loose-price'] };
    }));

    const filteredPrices = prices.filter(price => price.price !== undefined);

    if (filteredPrices.length > 0) {
      res.json(filteredPrices);
    } else {
      res.status(404).json({ error: 'No price data found for this card' });
    }
  } catch (err) {
    console.error('Error fetching price data:', err);
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

module.exports = router;