import React, { useState, useEffect } from 'react';
import './HomeScreen.css';

function HomeScreen({ onCardAdded }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setSelectedProduct(null);
    try {
      const response = await fetch(`/api/cards/search?name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      console.log("Fetched products:", data); // Log the fetched products
      if (data.products && data.products.length > 0) {
        setResults(data.products);
      } else if (data.products && data.products.products && data.products.products.length > 0) {
        setResults(data.products.products);
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

  const handleAddToCollection = async () => {
    if (!selectedProduct) return;
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedProduct["product-name"],
          set: selectedProduct["console-name"],
          condition: 'N/A', // You can modify this to include actual condition if available
          price: selectedProduct["loose-price"] || 0,
          loosePrice: selectedProduct["loose-price"] || 0,
          psa9Price: selectedProduct["graded-price"] || 0,
          psa10Price: selectedProduct["manual-only-price"] || 0,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onCardAdded(data);
        setMessage('Card added to collection');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error adding card to collection');
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="home-container">
      <header className="home-header">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png"
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
              <p>
                <strong>CIB Price:</strong>{" "}
                ${(selectedProduct["cib-price"] / 100).toFixed(2)}
              </p>
            )}
            {selectedProduct["loose-price"] && (
              <p>
                <strong>Loose Price:</strong>{" "}
                ${(selectedProduct["loose-price"] / 100).toFixed(2)}
              </p>
            )}
            {selectedProduct["ungraded-price"] && (
              <p>
                <strong>Ungraded Price:</strong>{" "}
                ${(selectedProduct["ungraded-price"] / 100).toFixed(2)}
              </p>
            )}
            {selectedProduct["graded-price"] && (
              <p>
                <strong>PSA 9 Price:</strong>{" "}
                ${(selectedProduct["graded-price"] / 100).toFixed(2)}
              </p>
            )}
            {selectedProduct["manual-only-price"] && (
              <p>
                <strong>PSA 10 Price:</strong>{" "}
                ${(selectedProduct["manual-only-price"] / 100).toFixed(2)}
              </p>
            )}
            <button onClick={handleAddToCollection} className="add-button">Add to Collection</button>
            {message && <p className="message">{message}</p>}
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