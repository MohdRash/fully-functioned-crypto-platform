import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { setAuthToken } from '../../utils/setAuthToken';

const WalletConnect = () => {
  const { state: { isAuthenticated, loading } } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  const [wallets, setWallets] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    currency: ''
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await axios.get('/api/wallet');
      setWallets(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await axios.post('/api/wallet', formData, config);
      alert('Wallet added successfully!');
      setFormData({ address: '', currency: '' });
      fetchWallets(); // Refresh the list of wallets
    } catch (err) {
      console.error(err.message);
      alert('Error adding wallet.');
    }
  };

  const onDelete = async id => {
    try {
      await axios.delete(`/api/wallet/${id}`);
      alert('Wallet removed successfully!');
      fetchWallets(); // Refresh the list of wallets
    } catch (err) {
      console.error(err.message);
      alert('Error removing wallet.');
    }
  };

  return (
    <div className="wallet-connect-container">
      <h1 className="large text-primary">Connect Your Wallets</h1>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Wallet Address"
            name="address"
            value={formData.address}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Currency (e.g., BTC, ETH)"
            name="currency"
            value={formData.currency}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Add Wallet" />
      </form>

      <h2 className="my-2">Your Connected Wallets</h2>
      {wallets.length > 0 ? (
        <div className="wallets-list">
          {wallets.map(wallet => (
            <div key={wallet._id} className="wallet-item">
              <p><strong>Address:</strong> {wallet.address}</p>
              <p><strong>Currency:</strong> {wallet.currency}</p>
              <p><strong>Balance:</strong> {wallet.balance}</p>
              <button onClick={() => onDelete(wallet._id)} className="btn btn-danger">Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No wallets connected yet.</p>
      )}
    </div>
  );
};

export default WalletConnect;