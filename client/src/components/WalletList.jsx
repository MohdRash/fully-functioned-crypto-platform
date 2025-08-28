import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WalletList = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('/api/wallet', config);
        setWallets(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wallets:', err);
        setError('Failed to fetch wallets. Please try again later.');
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  if (loading) return <p>Loading wallets...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="wallet-list-container">
      <h2>My Wallets</h2>
      {wallets.length === 0 ? (
        <p>No wallets found. Add a new wallet to get started!</p>
      ) : (
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet._id} className="wallet-item">
              <p><strong>Address:</strong> {wallet.address}</p>
              <p><strong>Currency:</strong> {wallet.currency}</p>
              <p><strong>Balance:</strong> {wallet.balance}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WalletList;