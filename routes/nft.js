const express = require('express');
const router = express.Router();
const NFT = require('../models/NFT');
const auth = require('../middleware/auth');

// @route   POST /api/nft
// @desc    Add a new NFT
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    contractAddress,
    tokenId,
    metadataUrl,
    imageUrl,
    name,
    description,
    attributes,
  } = req.body;

  try {
    const newNFT = new NFT({
      userId: req.user.id,
      contractAddress,
      tokenId,
      metadataUrl,
      imageUrl,
      name,
      description,
      attributes,
    });

    const nft = await newNFT.save();
    res.json(nft);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/nft
// @desc    Get all NFTs for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const nfts = await NFT.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(nfts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/nft/:id
// @desc    Delete an NFT
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let nft = await NFT.findById(req.params.id);

    if (!nft) return res.status(404).json({ msg: 'NFT not found' });

    // Make sure user owns NFT
    if (nft.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await NFT.findByIdAndDelete(req.params.id);

    res.json({ msg: 'NFT removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;