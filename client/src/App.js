import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import CollectionScreen from './components/CollectionScreen';
import './App.css';
import PriceChangeChart from './components/PriceChangeChart';

function App() {
  const [cards, setCards] = useState([]);

  const handleCardAdded = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const handleCardDeleted = (cardId) => {
    setCards((prevCards) => prevCards.filter(card => card._id !== cardId));
  };

  // Fetch existing cards on load
  useEffect(() => {
    fetch('/api/cards')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched cards:', data);
        setCards(data);
      })
      .catch((err) => console.error('Error fetching cards:', err));
  }, []);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/collection">Collection</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomeScreen onCardAdded={handleCardAdded} />} />
          <Route path="/collection" element={<CollectionScreen cards={cards} onCardDeleted={handleCardDeleted} />} />
          <Route path="/price-chart/:cardId" element={<PriceChangeChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;