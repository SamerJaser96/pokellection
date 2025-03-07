// client/src/App.js
import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import CardForm from './components/CardForm';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);

  const handleCardAdded = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };

  // Fetch existing cards on load
  useEffect(() => {
    fetch('/api/cards')
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <HomeScreen />
      <h2>Add a Card to Your Collection</h2>
      <CardForm onCardAdded={handleCardAdded} />
      <h2>Your Collection</h2>
      <ul>
        {cards.map((card) => (
          <li key={card._id}>
            {card.name} - {card.set} - {card.condition} - ${card.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
