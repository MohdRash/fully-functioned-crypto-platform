import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { updateUser } from '../../context/auth/auth';

const Profile = () => {
  const { state: { isAuthenticated, loading, user } } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const [profileData, setProfileData] = useState({
    username: user ? user.username : '',
    email: user ? user.email : ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const onChange = e =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // Implement update user action from AuthContext
    // For now, just log the data
    updateUser(dispatch, profileData);
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return isAuthenticated && user ? (
    <div className="profile-container">
      <h1 className="large text-primary">User Profile</h1>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={profileData.username}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={profileData.email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="profile-details">
          <p><strong>Registration Date:</strong> {new Date(user.date).toLocaleDateString()}</p>
          <p><strong>USD Balance:</strong> ${user.wallet.usd.toFixed(2)}</p>
          <p><strong>BTC Balance:</strong> {user.wallet.btc.toFixed(8)}</p>
        </div>
        <input type="submit" className="btn btn-primary" value="Update Profile" />
      </form>
    </div>
  ) : null;
};

export default Profile;