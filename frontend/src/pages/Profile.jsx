import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { defaultUserProfile } from '../data/mockData';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const profile = useMemo(() => ({ ...defaultUserProfile, ...user }), [user]);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    address: profile.address || '',
    phone: profile.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.put('/profile', formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page animate-fade-in">
      <div className="profile-card premium-card">
        <div className="profile-header">
          <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
          <div>
            <h1 className="page-title">{profile.name}</h1>
            <p>{profile.email}</p>
          </div>
        </div>
        
        {message && (
          <div className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              className="input-field" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address"
              className="input-field" 
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="text" 
              name="phone"
              className="input-field" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="profile-grid">
          <section className="premium-card">
            <h3>Saved Addresses</h3>
            {profile.savedAddresses?.map((entry) => (
              <p key={entry.id}><strong>{entry.label}:</strong> {entry.address}</p>
            ))}
          </section>
          <section className="premium-card">
            <h3>Payment Methods</h3>
            {profile.paymentMethods?.map((method) => (
              <p key={method.id}>{method.type} {method.masked} - {method.expiry}</p>
            ))}
          </section>
        </div>

        <button type="button" className="btn btn-secondary" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
