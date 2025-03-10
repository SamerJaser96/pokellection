import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollectionsScreen.css';

function CollectionsScreen() {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/cards/collections')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched collections:', data); // Log the fetched collections
        setCollections(data);
      })
      .catch((err) => console.error('Error fetching collections:', err));
  }, []);

  const handleAddCollection = async () => {
    try {
      const response = await fetch('/api/cards/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName }),
      });
      const newCollection = await response.json();
      setCollections((prevCollections) => [...prevCollections, newCollection]);
      setNewCollectionName('');
    } catch (err) {
      console.error('Error adding collection:', err);
    }
  };

  const handleDeleteCollection = async (collectionId, event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent element
    try {
      const response = await fetch(`/api/cards/collections/${collectionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCollections((prevCollections) => prevCollections.filter(collection => collection._id !== collectionId));
      } else {
        console.error('Failed to delete collection');
      }
    } catch (err) {
      console.error('Error deleting collection:', err);
    }
  };

  return (
    <div className="collections-container">
      <h1 className="collections-title">Your Collections</h1>
      <div className="add-collection">
        <input
          type="text"
          placeholder="New Collection Name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <button onClick={handleAddCollection}>Add Collection</button>
      </div>
      <ul className="collections-list">
        {Array.isArray(collections) && collections.map((collection) => (
          <li key={collection._id} onClick={() => navigate(`/collection/${collection._id}`)}>
            <div className="collection-name">
              {collection.name}
            </div>
            <button onClick={(event) => handleDeleteCollection(collection._id, event)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollectionsScreen;