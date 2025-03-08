const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.PRICECHARTING_API_KEY;

async function fetchCardProducts(cardName) {
  const endpoint = 'https://www.pricecharting.com/api/products';
  const url = `${endpoint}?t=${API_KEY}&q=${encodeURIComponent(cardName)}`;
  
  try {
    console.log(`Fetching products for card name: ${cardName}`); // Log the card name
    const response = await axios.get(url);
    console.log("PriceCharting API response status:", response.status); // Log the response status
    console.log("PriceCharting API response data:", JSON.stringify(response.data, null, 2)); // Log the response data in a readable format
    return response.data;
  } catch (error) {
    console.error("Error fetching card products from PriceCharting API:", error);
    throw error;
  }
}

module.exports = { fetchCardProducts };