import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Chart from 'react-apexcharts';
import WalletList from './components/WalletList';
import NFTGallery from './components/NFTGallery';
import BlockchainData from './components/BlockchainData';
import Prices from './components/Prices';
import Exchanges from './components/Exchanges';
import Community from './components/Community';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import WalletConnect from './components/Wallet/WalletConnect';
import Testimonials from './components/Testimonials';

import React, { useContext, useEffect, useState } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { loadUser } from './context/auth/auth';

function App() {
  const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (dispatch) {
      loadUser(dispatch);
    }
  }, [dispatch]);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 350,
        zoom: {
          autoScaleYaxis: true
        }
      },
      annotations: {
        yaxis: [{
          y: 30,
          borderColor: '#999',
          label: {
            show: true,
            text: 'Support',
            style: {
              color: '#fff',
              background: '#00E396'
            }
          }
        }],

      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        style: 'hollow',
      },
      xaxis: {
        type: 'datetime',

        tickAmount: 6,
        labels: {
          formatter: function(val, timestamp) {
            return new Date(timestamp).toLocaleDateString();
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    },
    series: [{
      name: 'Price',
      data: []
    }],
  });
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredCryptoPrices = Object.entries(cryptoPrices).filter(([currency]) =>
    currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCryptoPrices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCryptoPrices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  useEffect(() => {
    console.log('Fetching crypto prices and transactions...');
    const fetchPrice = async () => {
      try {
        const response = await axios.get('/api/coingecko/prices');
        console.log('CoinGecko API raw response:', response);
        console.log('CoinGecko API response data type:', typeof response.data);
        console.log('CoinGecko API response data:', response.data);

        if (!Array.isArray(response.data)) {
          console.error('CoinGecko API did not return an array:', response.data);
          setCryptoPrices({}); // Set to empty object to prevent further errors
          return;
        }

        // Transform the array of objects into an object keyed by symbol for easier lookup
        const pricesMap = response.data.reduce((acc, coin) => {
          acc[coin.symbol.toLowerCase()] = coin;
          return acc;
        }, {});
        setCryptoPrices(pricesMap);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        if (error.response) {
          console.error('Crypto prices API error response status:', error.response.status);
          console.error('Crypto prices API error response data:', error.response.data);
        } else if (error.request) {
          console.error('Crypto prices API error request:', error.request);
        } else {
          console.error('Crypto prices API error message:', error.message);
        }
      }
    };

    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get('/api/market/trending');
        if (Array.isArray(response.data.coins)) {
          setTrendingCoins(response.data.coins);
        } else {
          console.warn('Trending coins data is not an array:', response.data.coins);
          setTrendingCoins([]); // Default to an empty array
        }
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        const response = await axios.get('/api/transaction/history', config);
        console.log('Transaction API raw response:', response);
        console.log('Transaction API response data type:', typeof response.data);
        console.log('Transaction API response data:', response.data);
        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          console.warn('Transactions data is not an array:', response.data);
          setTransactions([]); // Default to an empty array
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        if (error.response) {
          console.error('Transaction API error response status:', error.response.status);
          console.error('Transaction API error response data:', error.response.data);
        } else if (error.request) {
          console.error('Transaction API error request:', error.request);
        } else {
          console.error('Transaction API error message:', error.message);
        }
      }
    };

    fetchPrice();
    fetchTransactions();
    fetchTrendingCoins();

    const priceInterval = setInterval(fetchPrice, 300000); // Update price every 5 minutes
    const transactionInterval = setInterval(fetchTransactions, 300000); // Update transactions every 5 minutes

    return () => {
      clearInterval(priceInterval);
      clearInterval(transactionInterval);
    };
  }, []);

  useEffect(() => {
    console.log('Fetching historical data...');
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get('/api/market/history/bitcoin'); // Fetching data for Bitcoin
        const prices = Array.isArray(response.data.prices) ? response.data.prices.map(item => ({ x: new Date(item[0]), y: item[1] })) : [];
        setChartData(prevState => ({
          ...prevState,
          series: [{
            name: 'Price',
            data: prices
          }]
        }));
      } catch (error) {
        console.error('Error fetching historical data:', error);
        if (error.response) {
          console.error('Historical data API error response status:', error.response.status);
          console.error('Historical data API error response data:', error.response.data);
        } else if (error.request) {
          console.error('Historical data API error request:', error.request);
        } else {
          console.error('Historical data API error message:', error.message);
        }
      }
    };

    fetchHistoricalData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
        <header className="header">
          <div className="header-logo">Crypto Platform</div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/prices">Prices</Link>
            <Link to="/exchanges">Exchanges</Link>
            <Link to="/community">Community</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/wallet">Wallet</Link>
            <Link to="/testimonials">Testimonials</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/prices" element={<Prices />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/community" element={<Community />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<WalletConnect />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/" element={
              <div className="main-content">
                <WalletList />
                <Testimonials />
                <NFTGallery />
                <BlockchainData />
                <section className="trending-section">
                  <h2>🔥 Trending Searches</h2>
                  {trendingCoins.length > 0 ? (
                    <div className="trending-list">
                      {trendingCoins.map((coin) => (
                        <div key={coin.item.coin_id} className="trending-item">
                          <img src={coin.item.small} alt={coin.item.name} />
                          <span>{coin.item.name} ({coin.item.symbol.toUpperCase()})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Loading trending coins...</p>
                  )}
                </section>

                <section className="chart-section">
                  <h2>Bitcoin Price Chart (Last 30 Days)</h2>
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="area"
                    height={350}
                  />
                </section>

                <section className="price-table-section">
                  <h2>Live Cryptocurrency Prices</h2>
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {Object.keys(filteredCryptoPrices).length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Currency</th>
                          <th>Price (USD)</th>
                          <th>Market Cap (USD)</th>
                          <th>24h Volume (USD)</th>
                          <th>24h Change (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map(([currency, coinData]) => (
                          <tr key={coinData.id}>
                            <td>
                              <img src={coinData.image} alt={coinData.name} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                              {coinData.name} ({coinData.symbol.toUpperCase()})
                            </td>
                            <td>${coinData.current_price ? coinData.current_price.toFixed(2) : 'N/A'}</td>
                            <td>{coinData.market_cap ? coinData.market_cap.toLocaleString() : 'N/A'}</td>
                            <td>{coinData.total_volume ? coinData.total_volume.toLocaleString() : 'N/A'}</td>
                            <td style={{ color: coinData.price_change_percentage_24h !== undefined ? (coinData.price_change_percentage_24h >= 0 ? 'green' : 'red') : 'inherit' }}>
                              {coinData.price_change_percentage_24h !== undefined ? coinData.price_change_percentage_24h.toFixed(2) + '%' : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Loading cryptocurrency prices...</p>
                  )}

                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="transaction-history">
                  <h2>Transaction History</h2>
                  {transactions.length > 0 ? (
                    <ul>
                      {transactions.map((tx) => (
                        <li key={tx._id}>
                          <span>Date: {new Date(tx.timestamp).toLocaleString()}</span>
                          <span>Type: <strong>{tx.type.toUpperCase()}</strong></span>
                          <span>Amount: {tx.amount} {tx.currency.toUpperCase()}</span>
                          {tx.price && <span>Price: ${tx.price}</span>}
                          {tx.recipientId && <span>Recipient: {tx.recipientId}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No transactions yet.</p>
                  )}
                </section>
              </div>
            } />
          </Routes>
        </main>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;