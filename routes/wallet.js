const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const auth = require('../middleware/auth');

// @route   POST /api/wallet
// @desc    Add a new wallet
// @access  Private
router.post('/', auth, async (req, res) => {
  const { address, currency } = req.body;

  try {
    const newWallet = new Wallet({
      userId: req.user.id,
      address,
      currency,
    });

    const wallet = await newWallet.save();
    res.json(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/wallet
// @desc    Get all wallets for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(wallets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/wallet/:id
// @desc    Delete a wallet
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findById(req.params.id);

    if (!wallet) return res.status(404).json({ msg: 'Wallet not found' });

    // Make sure user owns wallet
    if (wallet.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Wallet.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Wallet removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;