import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NFTGallery = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
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
        const res = await axios.get('/api/nft', config);
        setNfts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to fetch NFTs. Please try again later.');
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading) return <p>Loading NFTs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="nft-gallery-container">
      <h2>My NFTs</h2>
      {nfts.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft._id} className="nft-item">
              <img src={nft.imageUrl || `https://via.placeholder.com/150?text=NFT+${nft.tokenId}`} alt={nft.name} />
              <h3>{nft.name || `NFT #${nft.tokenId}`}</h3>
              <p>{nft.description}</p>
              <p>Contract: {nft.contractAddress}</p>
              <p>Token ID: {nft.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTGallery;