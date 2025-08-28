const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  metadataUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  attributes: [
    {
      trait_type: { type: String },
      value: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('NFT', NFTSchema);