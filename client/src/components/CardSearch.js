// client/src/components/CardSearch.js
import React, { useState } from 'react';

function CardSearch() {
  const [cardName, setCardName] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setSelectedProduct(null);
    try {
      const response = await fetch(`/api/cards/search?name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      console.log("Fetched combined data:", data); // Log the entire response
  
      // Handle potential issues with the structure of the response
      const combinedResults = Array.isArray(data.products) ? data.products : [];
      setResults(combinedResults);
    } catch (err) {
      console.error("Error fetching products:", err);
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
