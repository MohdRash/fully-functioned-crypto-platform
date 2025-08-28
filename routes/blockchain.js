const express = require('express');
const router = express.Router();

// @route   GET /api/blockchain/latestBlock
// @desc    Get latest blockchain data (simulated)
// @access  Public
router.get('/latestBlock', (req, res) => {
  try {
    // Simulate fetching the latest block number
    // In a real application, this would interact with a blockchain node
    const latestBlockNumber = Math.floor(Math.random() * 100000000);
    res.json({ blockNumber: latestBlockNumber });
  } catch (error) {
    console.error('Error simulating blockchain data:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;