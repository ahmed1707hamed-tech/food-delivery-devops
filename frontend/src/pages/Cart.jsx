import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Cart.css';
import { Minus, Plus, Trash2 } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState('');

  const discountRate = couponApplied === 'SAVE20' ? 0.2 : couponApplied === 'SAVE10' ? 0.1 : 0;
  const deliveryFee = cartTotal > 50 ? 0 : 3.99;
  const tax = cartTotal * 0.14;
  const discount = cartTotal * discountRate;
  const grandTotal = cartTotal + deliveryFee + tax - discount;

  const cartByRestaurant = useMemo(() => {
    const groups = {};
    cart.forEach((item) => {
      const key = item.restaurant_id || 'general';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.values(groups);
  }, [cart]);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        }))
      };
      
      await api.post('/orders', orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    const next = couponCode.trim().toUpperCase();
    if (next === 'SAVE10' || next === 'SAVE20') {
      setCouponApplied(next);
      setError('');
      return;
    }
    setCouponApplied('');
    setError('Invalid coupon. Try SAVE10 or SAVE20.');
  };

  if (cart.length === 0) {
    return (
      <div className="container empty-cart animate-fade-in">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any delicious food yet.</p>
        <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page animate-fade-in">
      <h1 className="page-title">Your Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartByRestaurant.map((group, groupIndex) => (
            <div key={groupIndex} className="cart-group premium-card">
              {group.map(item => (
                <div key={item.id} className="cart-item glass">
                  <div className="cart-item-img">
                    <img src={item.image_url || 'https://via.placeholder.com/80'} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="cart-summary premium-card">
          <h2>Order Summary</h2>
          <div className="coupon-row">
            <input
              className="input-field"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
            />
            <button className="btn btn-secondary mini-btn" onClick={applyCoupon}>Apply</button>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          {couponApplied && <p className="coupon-ok">Coupon {couponApplied} applied.</p>}
          
          {error && <div className="cart-error">{error}</div>}
          
          <button 
            className="btn btn-primary checkout-btn" 
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
