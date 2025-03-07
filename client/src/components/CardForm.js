// client/src/components/CardForm.js
import React, { useState } from 'react';

function CardForm({ onCardAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    set: '',
    condition: '',
    price: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add card');
      }
      const newCard = await response.json();
      onCardAdded(newCard);
      setFormData({ name: '', set: '', condition: '', price: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Card Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="set"
        placeholder="Set"
        value={formData.set}
        onChange={handleChange}
      />
      <input
        name="condition"
        placeholder="Condition"
        value={formData.condition}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />
      <button type="submit">Add Card</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </form>
  );
}

export default CardForm;
