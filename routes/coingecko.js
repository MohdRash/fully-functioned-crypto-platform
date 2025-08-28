const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/coingecko/prices
// @desc    Get latest cryptocurrency prices and data from CoinGecko
// @access  Public
let cachedPrices = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

router.get('/prices', async (req, res) => {
  const currentTime = Date.now();

  if (cachedPrices && (currentTime - lastFetchTime < CACHE_DURATION)) {
    console.log('Serving prices from cache');
    return res.json(cachedPrices);
  }
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });
    console.log('Response from CoinGecko API:', response.data);
    cachedPrices = response.data;
    lastFetchTime = currentTime;
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from CoinGecko API:', error.message);
    if (error.response) {
      console.error('CoinGecko API response status:', error.response.status);
      console.error('CoinGecko API response data:', error.response.data);
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/coingecko/coins/:id
// @desc    Get detailed information for a specific coin, including logo
// @access  Public
router.get('/coins/:id', async (req, res) => {
  try {
    const coinId = req.params.id;
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: false,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching data for coin ${req.params.id} from CoinGecko API:`, error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;