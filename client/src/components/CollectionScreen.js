import React from 'react';
import './CollectionScreen.css';

function CollectionScreen({ cards, onCardDeleted }) {
  const handleDelete = async (cardId) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onCardDeleted(cardId);
      } else {
        console.error('Failed to delete card');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  return (
    <div className="collection-container">
      <h1>Your Collection</h1>
      {cards.length > 0 ? (
        <ul className="collection-list">
          {cards.map((card) => (
            <li key={card._id} className="collection-item">
              <strong>{card.name}</strong> – {card.set} – {card.condition} – ${(card.price / 100).toFixed(2)}
              <button onClick={() => handleDelete(card._id)} className="delete-button">Delete</button>
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