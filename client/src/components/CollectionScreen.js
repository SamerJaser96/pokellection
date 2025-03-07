import React from 'react';
import './CollectionScreen.css';

function CollectionScreen({ cards }) {
  return (
    <div className="collection-container">
      <h1>Your Collection</h1>
      {cards.length > 0 ? (
        <ul className="collection-list">
          {cards.map((card) => (
            <li key={card._id} className="collection-item">
              <strong>{card.name}</strong> – {card.set} – {card.condition} – ${(card.price / 100).toFixed(2)}
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