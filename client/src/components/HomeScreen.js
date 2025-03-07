// client/src/components/HomeScreen.js
import React, { useState } from 'react';
import './HomeScreen.css';

function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setSelectedProduct(null);
    try {
      const response = await fetch(`/api/cards/search?name=${encodeURIComponent(searchQuery)}`);

      const data = await response.json();
      if (data.products && data.products.length > 0) {
        setResults(data.products);
      } else {
        setError("No products found.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setResults([]);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="Pikachu"
          className="pokeball-img"
        />
        <h1 className="home-title">PokéPrice Checker</h1>
        <p className="home-subtitle">Discover the value of your Pokémon cards!</p>
      </header>
      <main className="home-main">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter Pokémon card name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {error && (
          <div className="error">
            <p className="error-text">Error: {error}</p>
          </div>
        )}
        {results.length > 0 && (
          <ul className="results-list">
            {results.map((product) => (
              <li
                key={product.id}
                className="result-item"
                onClick={() => handleSelectProduct(product)}
              >
                {product["product-name"]} - {product["console-name"]}
              </li>
            ))}
          </ul>
        )}
        {selectedProduct && (
          <div className="product-details">
            <h2>{selectedProduct["product-name"]}</h2>
            <p><strong>Console:</strong> {selectedProduct["console-name"]}</p>
            {selectedProduct["cib-price"] && (
              <p><strong>CIB Price:</strong> ${(selectedProduct["cib-price"] / 100).toFixed(2)}</p>
            )}
            {selectedProduct["loose-price"] && (
              <p><strong>Loose Price:</strong> ${(selectedProduct["loose-price"] / 100).toFixed(2)}</p>
            )}
          </div>
        )}
      </main>
      <footer className="home-footer">
        <p>Made with ♥ by Pokémon collectors</p>
      </footer>
    </div>
  );
}

export default HomeScreen;
