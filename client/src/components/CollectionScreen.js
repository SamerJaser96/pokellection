import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollectionScreen.css';

function CollectionScreen({ cards, onCardDeleted }) {
  const [selectedGrades, setSelectedGrades] = useState({});
  const [sortCriteria, setSortCriteria] = useState('loose');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (cardId) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onCardDeleted(cardId);
        setMessage('Card deleted from collection');
      } else {
        console.error('Failed to delete card');
      }
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  const handleGradeChange = (cardId, grade) => {
    setSelectedGrades((prevGrades) => ({
      ...prevGrades,
      [cardId]: grade,
    }));
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const totalLoosePrice = cards.reduce((total, card) => total + (card.loosePrice || 0), 0);
  const totalPSA9Price = cards.reduce((total, card) => total + (card.psa9Price || 0), 0);
  const totalPSA10Price = cards.reduce((total, card) => total + (card.psa10Price || 0), 0);

  // Calculate custom total based on selected grades
  const customTotal = cards.reduce((total, card) => {
    const grade = selectedGrades[card._id] || 'loose';
    if (grade === 'psa9') {
      return total + (card.psa9Price || 0);
    } else if (grade === 'psa10') {
      return total + (card.psa10Price || 0);
    } else {
      return total + (card.loosePrice || 0);
    }
  }, 0);

  // Sort cards based on selected criteria
  const sortedCards = [...cards].sort((a, b) => {
    if (sortCriteria === 'psa9') {
      return (b.psa9Price || 0) - (a.psa9Price || 0);
    } else if (sortCriteria === 'psa10') {
      return (b.psa10Price || 0) - (a.psa10Price || 0);
    } else {
      return (b.loosePrice || 0) - (a.loosePrice || 0);
    }
  });

  return (
    <div className="collection-container">
      <h1 className="collection-title">Your Collection</h1>
      <p className="collection-count">Total Cards: {cards.length}</p>
      <div className="sort-container">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="loose">Loose Value</option>
          <option value="psa9">PSA 9 Value</option>
          <option value="psa10">PSA 10 Value</option>
        </select>
      </div>
      {message && <p className="message">{message}</p>}
      {sortedCards.length > 0 ? (
        <>
          <ul className="collection-list">
            {sortedCards.map((card) => (
              <li key={card._id} className="collection-item">
                <strong>{card.name}</strong> – {card.set} – {card.condition} – 
                <div className="card-prices">
                  <p><strong>Loose:</strong> ${(card.loosePrice / 100).toFixed(2)}</p>
                  <p><strong>PSA 9:</strong> ${(card.psa9Price / 100).toFixed(2)}</p>
                  <p><strong>PSA 10:</strong> ${(card.psa10Price / 100).toFixed(2)}</p>
                </div>
                <div className="grade-select">
                  <label>
                    <input
                      type="radio"
                      name={`grade-${card._id}`}
                      value="loose"
                      checked={selectedGrades[card._id] === 'loose'}
                      onChange={() => handleGradeChange(card._id, 'loose')}
                    />
                    Loose
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`grade-${card._id}`}
                      value="psa9"
                      checked={selectedGrades[card._id] === 'psa9'}
                      onChange={() => handleGradeChange(card._id, 'psa9')}
                    />
                    PSA 9
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`grade-${card._id}`}
                      value="psa10"
                      checked={selectedGrades[card._id] === 'psa10'}
                      onChange={() => handleGradeChange(card._id, 'psa10')}
                    />
                    PSA 10
                  </label>
                </div>
                <button onClick={() => handleDelete(card._id)} className="delete-button">Delete</button>
                <button onClick={() => {
                  console.log('Selected card ID:', card.cardId); // Debugging log
                  navigate(`/price-chart/${card.cardId}`);
                }} className="view-chart-button">View Price Changes</button>
              </li>
            ))}
          </ul>
          <div className="total-worth">
            <p><strong>Total Loose Price:</strong> ${(totalLoosePrice / 100).toFixed(2)}</p>
            <p><strong>Total PSA 9 Price:</strong> ${(totalPSA9Price / 100).toFixed(2)}</p>
            <p><strong>Total PSA 10 Price:</strong> ${(totalPSA10Price / 100).toFixed(2)}</p>
            <p><strong>Custom Total:</strong> ${(customTotal / 100).toFixed(2)}</p>
          </div>
        </>
      ) : (
        <p className="no-cards-message">No cards in your collection yet.</p>
      )}
    </div>
  );
}

export default CollectionScreen;