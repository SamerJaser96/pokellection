import React, { useState, useEffect } from 'react';
import './HomeScreen.css';

function HomeScreen({ onCardAdded }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [apiSource, setApiSource] = useState('pricecharting'); // New state for API source
  const [showReverseHolo, setShowReverseHolo] = useState(false); // New state for toggle

  useEffect(() => {
    fetch('/api/cards/collections')
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        if (data.length > 0) {
          setSelectedCollection(data[0]._id); // Set default selected collection
        }
      })
      .catch((err) => console.error('Error fetching collections:', err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setSelectedProduct(null);
    try {
      const apiUrl = apiSource === 'pricecharting' ? '/api/cards/search' : '/api/cards/pokemontcg/search';
      const response = await fetch(`${apiUrl}?name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      console.log("Fetched products:", data); // Log the fetched products
      if (data.data && data.data.length > 0) {
        setResults(data.data);
      } else if (data.products && data.products.length > 0) {
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
    if (!selectedProduct || !selectedCollection) return;
    try {
      console.log("Selected Product:", selectedProduct); // Log the selected product
      console.log("TCGPlayer Data:", selectedProduct.tcgplayer); // Log the TCGPlayer data
      const tcgplayerPrices = selectedProduct.tcgplayer?.prices?.holofoil || {};
      console.log("TCGPlayer Prices:", tcgplayerPrices); // Log TCGPlayer prices
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedProduct.name || selectedProduct["product-name"],
          set: selectedProduct.set?.name || selectedProduct["console-name"],
          condition: 'N/A', // You can modify this to include actual condition if available
          loosePrice: selectedProduct["loose-price"] || 0,
          psa9Price: selectedProduct["graded-price"] || 0,
          psa10Price: selectedProduct["manual-only-price"] || 0,
          tcgplayerPrices: {
            low: tcgplayerPrices.low || 0,
            mid: tcgplayerPrices.mid || 0,
            high: tcgplayerPrices.high || 0,
            market: tcgplayerPrices.market || 0,
            directLow: tcgplayerPrices.directLow || 0,
          },
          cardId: selectedProduct.id || selectedProduct["id"], // Include cardId
          collectionId: selectedCollection, // Include collectionId
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

  const hasReverseHoloPrices = selectedProduct?.cardmarket?.prices?.reverseHoloTrend !== 0 || selectedProduct?.cardmarket?.prices?.reverseHoloAvg30 !== 0;

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
        <div className="api-source-select">
          <label>
            <input
              type="radio"
              name="apiSource"
              value="pricecharting"
              checked={apiSource === 'pricecharting'}
              onChange={() => setApiSource('pricecharting')}
            />
            PriceCharting
          </label>
          <label>
            <input
              type="radio"
              name="apiSource"
              value="pokemontcg"
              checked={apiSource === 'pokemontcg'}
              onChange={() => setApiSource('pokemontcg')}
            />
            Pokémon TCG
          </label>
        </div>
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
                <img src={product.images?.small || product.imageUrl} alt={product.name || product["product-name"]} className="card-image" />
                {product.name || product["product-name"]} - {product.set?.name || product["console-name"]}
              </li>
            ))}
          </ul>
        )}
        {selectedProduct && (
          <div className="product-details">
            <h2>{selectedProduct.name || selectedProduct["product-name"]}</h2>
            <img src={selectedProduct.images?.large || selectedProduct.imageUrl} alt={selectedProduct.name || selectedProduct["product-name"]} className="card-image" />
            <p><strong>Set:</strong> {selectedProduct.set?.name || selectedProduct["console-name"]}</p>
            {hasReverseHoloPrices && (
              <div className="price-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={showReverseHolo}
                    onChange={() => setShowReverseHolo(!showReverseHolo)}
                  />
                  Show Reverse Holo Prices
                </label>
              </div>
            )}
            {showReverseHolo && hasReverseHoloPrices ? (
              <>
                {selectedProduct.cardmarket?.prices?.reverseHoloTrend && selectedProduct.cardmarket.prices.reverseHoloTrend !== 0 && (
                  <p>
                    <strong>Reverse Holo Trend Price:</strong>{" "}
                    ${(selectedProduct.cardmarket.prices.reverseHoloTrend).toFixed(2)}
                  </p>
                )}
                {selectedProduct.cardmarket?.prices?.reverseHoloAvg30 && selectedProduct.cardmarket.prices.reverseHoloAvg30 !== 0 && (
                  <p>
                    <strong>Reverse Holo Average Price:</strong>{" "}
                    ${(selectedProduct.cardmarket.prices.reverseHoloAvg30).toFixed(2)}
                  </p>
                )}
              </>
            ) : (
              <>
                {selectedProduct.cardmarket?.prices?.averageSellPrice && (
                  <p>
                    <strong>Average Sell Price:</strong>{" "}
                    ${(selectedProduct.cardmarket.prices.averageSellPrice).toFixed(2)}
                  </p>
                )}
                {selectedProduct["loose-price"] && (
                  <p>
                    <strong>Loose Price:</strong>{" "}
                    ${(selectedProduct["loose-price"] / 100).toFixed(2)}
                  </p>
                )}
                {selectedProduct.cardmarket?.prices?.trendPrice && (
                  <p>
                    <strong>Trend Price:</strong>{" "}
                    ${(selectedProduct.cardmarket.prices.trendPrice).toFixed(2)}
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
              </>
            )}
            <div className="collection-select">
              <label htmlFor="collection">Select Collection:</label>
              <select
                id="collection"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                {collections.map((collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
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