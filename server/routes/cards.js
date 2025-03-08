const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { fetchCardProducts } = require('../utils/priceCharting');

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
  const { name, set, condition, price, loosePrice, psa9Price, psa10Price } = req.body;
  const card = new Card({ name, set, condition, price, loosePrice, psa9Price, psa10Price });
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

module.exports = router;