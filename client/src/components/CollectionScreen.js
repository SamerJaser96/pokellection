// client/src/components/CollectionScreen.js
import React, { useEffect, useState } from 'react';
import './CollectionScreen.css';

function CollectionScreen() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the collection from your backend
    fetch('/api/cards')
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => {
        console.error(err);
        setError("Error fetching collection");
      });
  }, []);

  return (
    <div className="collection-container">
      <h1>Your Collection</h1>
      {error && <p className="error-text">{error}</p>}
      {cards.length > 0 ? (
        <ul className="collection-list">
          {cards.map((card) => (
            <li key={card._id} className="collection-item">
              <strong>{card.name}</strong> – {card.set} – {card.condition} – ${card.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cards in your collection yet.</p>
      )}
    </div>
  );
}

export default CollectionScreen;
