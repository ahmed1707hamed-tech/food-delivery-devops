import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.address, formData.phone);
      navigate('/restaurants');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card premium-card">
        <h2>Create Account</h2>
        <p>Sign up to unlock premium delivery and personalized recommendations.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
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
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              value={formData.password}
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
          <button type="submit" className="btn btn-primary auth-submit">
            Sign Up
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
