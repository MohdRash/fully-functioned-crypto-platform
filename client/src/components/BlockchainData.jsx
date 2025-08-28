import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlockchainData = () => {
  const [latestBlock, setLatestBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        // In a real application, this would fetch data from your backend API
        // which in turn would interact with a blockchain node.
        // For now, we'll simulate a call to a conceptual endpoint.
        const res = await axios.get('/api/blockchain/latestBlock'); // Assuming this endpoint exists
        setLatestBlock(res.data.blockNumber);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blockchain data:', err);
        setError('Failed to fetch blockchain data. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlockchainData();
    // Refresh data every 10 seconds (example)
    const interval = setInterval(fetchBlockchainData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading blockchain data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="blockchain-data-container">
      <h2>Real-time Blockchain Data</h2>
      {latestBlock ? (
        <p>Latest Block Number: <strong>{latestBlock}</strong></p>
      ) : (
        <p>No blockchain data available.</p>
      )}
    </div>
  );
};

export default BlockchainData;