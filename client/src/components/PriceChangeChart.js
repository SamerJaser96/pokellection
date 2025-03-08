import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PriceChangeChart() {
  const [priceData, setPriceData] = useState([]);
  const [error, setError] = useState(null);
  const { cardId } = useParams(); // Get cardId from URL parameter

  useEffect(() => {
    console.log('useEffect triggered with card ID:', cardId); // Debugging log
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`/api/cards/${cardId}/prices`);
        console.log('Response status:', response.status); // Debugging log
        if (!response.ok) {
          if (response.status === 404) {
            setError('Price data not found for this card.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          console.log('Fetched price data:', data); // Debugging log
          if (Array.isArray(data)) {
            setPriceData(data);
            console.log('Price data set:', data); // Debugging log
          } else {
            console.error('Unexpected data format:', data);
            setError('Unexpected data format.');
          }
        }
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError('Error fetching price data.');
      }
    };

    fetchPriceData();
  }, [cardId]);

  console.log('Price data:', priceData); // Debugging log

  return (
    <div>
      <h3>Price Change Over Time</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <pre>{JSON.stringify(priceData, null, 2)}</pre>
      )}
    </div>
  );
}

export default PriceChangeChart;