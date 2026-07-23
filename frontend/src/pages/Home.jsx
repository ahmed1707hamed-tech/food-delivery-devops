import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Star } from 'lucide-react';
import { FavoritesContext } from '../context/FavoritesContext';
import RestaurantCard from '../components/RestaurantCard';
import { getRestaurants } from '../services/dataService';
import './Home.css';

const CATEGORIES = [
  'Pizza',
  'Burger',
  'Chicken',
  'Seafood',
  'Desserts',
  'Drinks',
  'Coffee',
  'Pasta',
  'Healthy',
  'Asian',
  'Mexican',
  'Italian',
  'Japanese',
  'Arabic',
  'Indian',
];

const REVIEWS = [
  { name: 'Sarah M.', text: 'The fastest delivery in town! Food is always piping hot.', rating: 5 },
  { name: 'James T.', text: 'Love the huge variety of restaurants available. Highly recommend.', rating: 5 },
  { name: 'Emily R.', text: 'Customer service is excellent and the app is so easy to use.', rating: 4 }
];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const topRated = useMemo(() => [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4), [restaurants]);
  const featured = useMemo(() => restaurants.slice(0, 6), [restaurants]);
  const popularFoods = useMemo(
    () => restaurants.slice(0, 8).flatMap((restaurant) => restaurant.popular_meals || []).slice(0, 8),
    [restaurants],
  );

  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Delicious Food" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content animate-fade-in-up">
          <h1>Discover premium meals delivered fast.</h1>
          <p>From gourmet burgers to artisan coffee, find exactly what you crave from 50+ curated restaurants.</p>
          
          <form className="hero-search-bar" onSubmit={handleSearch}>
            <Search className="search-icon-left" size={24} />
            <input 
              type="text" 
              placeholder="Search for restaurants, cuisines, or dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn">
              Explore
            </button>
          </form>
        </div>
      </section>

      <section className="categories-section container animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="section-header">
          <h2>What are you craving?</h2>
        </div>
        <div className="categories-slider no-scrollbar">
          {CATEGORIES.map((category) => (
            <Link to={`/restaurants?category=${category}`} key={category} className="category-item glass-card">
              <span className="category-name">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section container animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="section-header">
          <h2>Featured Restaurants</h2>
          <Link to="/restaurants" className="view-all">View all <ChevronRight size={18} /></Link>
        </div>
        
        {loading ? (
          <div className="restaurant-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="restaurant-card-skeleton glass-card">
                <div className="skeleton skeleton-img"></div>
                <div className="p-4">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="restaurant-grid">
            {featured.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorite={isFavorite(restaurant.id, 'restaurant')}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      <section className="offers-section container">
        <div className="offers-grid">
          <div className="offer-card glass-card" style={{ background: 'linear-gradient(135deg, #FF5A5F, #E0484D)' }}>
            <div className="offer-content">
              <h3>50% OFF</h3>
              <p>On your first 3 orders</p>
              <button className="btn btn-secondary">Claim Now</button>
            </div>
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Burger" className="offer-img" />
          </div>
          <div className="offer-card glass-card" style={{ background: 'linear-gradient(135deg, #00A699, #008489)' }}>
            <div className="offer-content">
              <h3>Free Delivery</h3>
              <p>From top rated restaurants</p>
              <button className="btn btn-secondary">Explore</button>
            </div>
            <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Pizza" className="offer-img" />
          </div>
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-header">
          <h2>Top Rated Near You</h2>
          <Link to="/restaurants?sort=rating" className="view-all">View all <ChevronRight size={18} /></Link>
        </div>
        <div className="restaurant-grid">
          {!loading && topRated.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isFavorite={isFavorite(restaurant.id, 'restaurant')}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      <section className="container popular-foods-section">
        <div className="section-header">
          <h2>Popular Foods</h2>
        </div>
        <div className="popular-food-grid">
          {popularFoods.map((food, index) => (
            <div className="popular-food-item premium-card" key={`${food}-${index}`}>
              <span>{food}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews-section container">
        <div className="section-header">
          <h2>What our customers say</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((review, idx) => (
            <div key={idx} className="review-card glass-card">
              <div className="review-stars">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="#FFB400" color="#FFB400" />)}
              </div>
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">- {review.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
