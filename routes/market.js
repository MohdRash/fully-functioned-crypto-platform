const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET api/market/prices
// @desc    Get real-time cryptocurrency prices
// @access  Public
router.get('/prices', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,ripple,litecoin,cardano',
        vs_currencies: 'usd',
        include_market_cap: 'true',
        include_24hr_vol: 'true',
        include_24hr_change: 'true',
      },
    });
    res.json(response.data);
  } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error');
   }
 });

 // @route   GET api/market/trending
 // @desc    Get trending cryptocurrencies
 // @access  Public
 let cachedTrending = null;
 let lastTrendingFetchTime = 0;
 const CACHE_TRENDING_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
 
 router.get('/trending', async (req, res) => {
   const currentTime = Date.now();
 
   if (cachedTrending && (currentTime - lastTrendingFetchTime < CACHE_TRENDING_DURATION)) {
     console.log('Serving trending from cache');
     return res.json(cachedTrending);
   }
   try {
     const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
     cachedTrending = response.data;
     lastTrendingFetchTime = currentTime;
     res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/market/history/:id
// @desc    Get historical cryptocurrency prices for a given ID
// @access  Public
let cachedHistory = {}; // Store history data per coin ID
let lastHistoryFetchTime = {}; // Store last fetch time per coin ID
const CACHE_HISTORY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

router.get('/history/:id', async (req, res) => {
  const { id } = req.params;
  const currentTime = Date.now();

  if (cachedHistory[id] && (currentTime - lastHistoryFetchTime[id] < CACHE_HISTORY_DURATION)) {
    console.log(`Serving history for ${id} from cache`);
    return res.json(cachedHistory[id]);
  }
  try {

    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: '30', // Fetch data for the last 30 days
        interval: 'daily' // Daily interval
      },
    });
    cachedHistory[id] = response.data;
    lastHistoryFetchTime[id] = currentTime;
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;