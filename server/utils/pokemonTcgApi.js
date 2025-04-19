const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.POKEMON_TCG_API_KEY;
const API_URL = "https://api.pokemontcg.io/v2/cards";
async function fetchCardProducts(cardName) {
  const endpoint = 'https://api.pokemontcg.io/v2/cards';
  const url = `${endpoint}?q=name:${encodeURIComponent(cardName)}`;
  
  try {
    console.log(`Fetching products for card name: ${cardName}`); // Log the card name
    const response = await axios.get(url, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });
    console.log("Pokémon TCG API response status:", response.status); // Log the response status
    console.log("Pokémon TCG API response data:", JSON.stringify(response.data, null, 2)); // Log the response data in a readable format
    return response.data;
  } catch (error) {
    console.error("Error fetching card products from Pokémon TCG API:", error);
    throw error;
  }
}
async function fetchPokemonTcgProducts(query) {
  // Construct the full URL with query string using the "q" parameter as per the docs.
  const url = `${API_URL}?q=${encodeURIComponent(query)}`;
  console.log(`Fetching from Pokémon TCG API with URL: ${url}`);
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
module.exports = { fetchCardProducts: fetchPokemonTcgProducts };