// client/src/components/CardSearch.js
import React, { useState } from 'react';

function CardSearch() {
  const [cardName, setCardName] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPrice(null);
    setError(null);
  
    try {
      const response = await fetch(`/api/cards/search?name=${encodeURIComponent(searchQuery)}`);
      // Log the raw response text to see what we're getting back
      const text = await response.text();
      console.log("Raw response text:", text);
  
      if (!text) {
        throw new Error("Empty response from server");
      }
      const data = JSON.parse(text);
      setPrice(data.price);
    } catch (err) {
      console.error("Error fetching price:", err);
      setError(err.message);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter card name..."
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      
      {price !== null && (
        <p>Price for {cardName}: ${price}</p>
      )}
      
      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}
    </div>
  );
}

export default CardSearch;
