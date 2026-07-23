import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import MenuItemCard from '../components/MenuItemCard';
import { getRestaurantDetails, getRestaurantMenu } from '../services/dataService';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const restaurantData = await getRestaurantDetails(id);
        setRestaurant(restaurantData);
        const menuData = await getRestaurantMenu(id, restaurantData?.cuisine);
        setMenu(menuData);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!restaurant) {
    return <div className="container">Restaurant not found</div>;
  }

  const categories = useMemo(() => ['All', ...new Set(menu.map((item) => item.category || 'Main'))], [menu]);
  const visibleMenu = selectedCategory === 'All' ? menu : menu.filter((item) => item.category === selectedCategory);

  return (
    <div className="restaurant-details animate-fade-in">
      <div className="restaurant-header">
        <div className="restaurant-header-bg" style={{ backgroundImage: `url(${restaurant.cover_image || restaurant.image_url})` }}>
          <div className="restaurant-header-overlay">
            <div className="container">
              <h1>{restaurant.name}</h1>
              <p>{restaurant.cuisine} • ★ {restaurant.rating} • {restaurant.delivery_time}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container menu-section">
        <div className="section-header">
          <h2>Menu</h2>
          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category}
                className={`pill-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="menu-grid">
          {visibleMenu.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(item.id, 'food')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
