import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <UtensilsCrossed size={24} className="logo-icon" />
              <span>NovaBite</span>
            </Link>
            <p className="footer-desc">
              Premium food delivery inspired by the world's top platforms, with curated restaurants and fast reliable service.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF size={18} /></a>
              <a href="#" className="social-icon" aria-label="X"><FaXTwitter size={18} /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram size={18} /></a>
              <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn size={18} /></a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h3>About</h3>
            <ul>
              <li><Link to="/">Our Story</Link></li>
              <li><Link to="/">Partner Program</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Press</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h3>Contact</h3>
            <ul>
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">Support</Link></li>
              <li><Link to="/">Feedback</Link></li>
              <li><Link to="/">Live Chat</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/">Privacy</Link></li>
              <li><Link to="/">Terms</Link></li>
              <li><Link to="/">Cookie Policy</Link></li>
              <li><Link to="/">Data Requests</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CraveDelivery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
