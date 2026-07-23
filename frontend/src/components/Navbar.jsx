import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { ShoppingCart, LogOut, UtensilsCrossed, Search, Heart, Menu, X, ClipboardList, Store } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { favoriteCount } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const closeMobile = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/login');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchTerm = query.trim();
    closeMobile();
    navigate(searchTerm ? `/restaurants?search=${encodeURIComponent(searchTerm)}` : '/restaurants');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <div className="logo-icon-wrapper">
            <UtensilsCrossed size={20} className="logo-icon" />
          </div>
          <span className="logo-text">NovaBite</span>
        </Link>
        
        <form className="navbar-search hidden-mobile" onSubmit={handleSearchSubmit}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search restaurants, foods, categories..."
          />
        </form>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen((value) => !value)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <form className="navbar-search hidden-desktop mobile-search-container" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
            />
          </form>
          
          <Link to="/restaurants" className={`nav-link ${isActive('/restaurants') ? 'active' : ''}`} onClick={closeMobile}>
            <Store size={16} />
            Restaurants
          </Link>
          
          {user ? (
            <>
              <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={closeMobile}>
                <ClipboardList size={16} />
                Orders
              </Link>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`} onClick={closeMobile}>
                <Heart size={20} />
                <span>Favorites</span>
                {favoriteCount > 0 && <span className="mini-badge">{favoriteCount}</span>}
              </Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMobile}>
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-btn hidden-desktop-flex">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link font-medium" onClick={closeMobile}>Log in</Link>
              <Link to="/register" className="btn btn-primary nav-btn-primary" onClick={closeMobile}>Sign up</Link>
            </>
          )}
          
          <Link to="/cart" className="nav-cart" onClick={closeMobile}>
            <div className="cart-icon-wrapper">
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
