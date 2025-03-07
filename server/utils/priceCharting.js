const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.PRICECHARTING_API_KEY;

async function fetchCardProducts(cardName) {
  const endpoint = 'https://www.pricecharting.com/api/products';
  const url = `${endpoint}?t=${API_KEY}&q=${encodeURIComponent(cardName)}`;
  
  try {
    const response = await axios.get(url);
    console.log("PriceCharting API response status:", response.status); // Log the response status
    console.log("PriceCharting API response headers:", response.headers); // Log the response headers
    console.log("PriceCharting API response data:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error fetching card products from PriceCharting API:", error);
    throw error;
  }
}

module.exports = { fetchCardProducts };