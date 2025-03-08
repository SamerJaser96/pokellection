import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function PriceChangeChart() {
  const [priceData, setPriceData] = useState([]);
  const { cardId } = useParams(); // Get cardId from URL parameter

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`/api/cards/${cardId}/prices`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched price data:', data); // Log the response data
        // Format the data to ensure it works with the chart
        const formattedData = data.map(entry => ({
          date: new Date(entry.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
          price: entry.price / 100 // Convert price to dollars
        }));
        setPriceData(formattedData);
      } catch (err) {
        console.error('Error fetching price data:', err);
      }
    };

    fetchPriceData();
  }, [cardId]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>Price Change Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={priceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChangeChart;