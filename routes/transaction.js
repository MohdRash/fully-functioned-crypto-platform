const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// For simplicity, assume a fixed BTC price for now
const BTC_PRICE_USD = 30000; 

// @route   POST api/transaction/buy
// @desc    Buy cryptocurrency
// @access  Private
router.post('/buy', auth, async (req, res) => {
  const { amountUSD } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.wallet.usd < amountUSD) {
      return res.status(400).json({ msg: 'Insufficient USD balance' });
    }

    const btcAmount = amountUSD / BTC_PRICE_USD;

    user.wallet.usd -= amountUSD;
    user.wallet.btc += btcAmount;

    await user.save();

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'buy',
      amount: btcAmount,
      currency: 'btc',
      price: BTC_PRICE_USD
    });

    await transaction.save();

    res.json({ msg: 'Buy successful', wallet: user.wallet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transaction/sell
// @desc    Sell cryptocurrency
// @access  Private
router.post('/sell', auth, async (req, res) => {
  const { amountBTC } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.wallet.btc < amountBTC) {
      return res.status(400).json({ msg: 'Insufficient BTC balance' });
    }

    const usdAmount = amountBTC * BTC_PRICE_USD;

    user.wallet.btc -= amountBTC;
    user.wallet.usd += usdAmount;

    await user.save();

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'sell',
      amount: amountBTC,
      currency: 'btc',
      price: BTC_PRICE_USD
    });

    await transaction.save();

    res.json({ msg: 'Sell successful', wallet: user.wallet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transaction/transfer
// @desc    Transfer cryptocurrency to another user
// @access  Private
router.post('/transfer', auth, async (req, res) => {
  const { recipientEmail, amountBTC } = req.body;

  try {
    const sender = await User.findById(req.user.id);
    const recipient = await User.findOne({ email: recipientEmail });

    if (!sender) {
      return res.status(404).json({ msg: 'Sender not found' });
    }

    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }

    if (sender.wallet.btc < amountBTC) {
      return res.status(400).json({ msg: 'Insufficient BTC balance' });
    }

    if (sender.id.toString() === recipient.id.toString()) {
      return res.status(400).json({ msg: 'Cannot transfer to yourself' });
    }

    sender.wallet.btc -= amountBTC;
    recipient.wallet.btc += amountBTC;

    await sender.save();
    await recipient.save();

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'transfer',
      amount: amountBTC,
      currency: 'btc',
      recipientId: recipient.id
    });

    await transaction.save();

    res.json({ msg: 'Transfer successful', senderWallet: sender.wallet, recipientWallet: recipient.wallet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /api/transaction/history
// @desc     Get user's transaction history
// @access   Private
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;