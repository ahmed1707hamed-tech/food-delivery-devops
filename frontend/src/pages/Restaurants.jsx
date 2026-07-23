import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import RestaurantCard from '../components/RestaurantCard';
import { generatedMenusByRestaurant } from '../data/mockData';
import { getRestaurants } from '../services/dataService';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    rating: '',
    deliveryTime: '',
    cuisine: '',
    price: '',
    offers: '',
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const nextParams = {};
    if (filters.search) nextParams.search = filters.search;
    if (filters.category) nextParams.category = filters.category;
    setSearchParams(nextParams, { replace: true });
  }, [filters.search, filters.category, setSearchParams]);

  const cuisines = useMemo(
    () => [...new Set(restaurants.map((restaurant) => restaurant.cuisine || restaurant.category))],
    [restaurants],
  );

  const filteredRestaurants = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const menuItems = generatedMenusByRestaurant[restaurant.id] || [];
      const matchesSearch =
        !term ||
        restaurant.name.toLowerCase().includes(term) ||
        (restaurant.cuisine || '').toLowerCase().includes(term) ||
        menuItems.some((item) => item.name.toLowerCase().includes(term) || item.category.toLowerCase().includes(term));
      const matchesCategory = !filters.category || (restaurant.cuisine || '').toLowerCase() === filters.category.toLowerCase();
      const matchesRating = !filters.rating || restaurant.rating >= Number(filters.rating);
      const matchesDeliveryTime =
        !filters.deliveryTime || Number(restaurant.delivery_time.split('-')[1]?.replace(' min', '') || 100) <= Number(filters.deliveryTime);
      const matchesCuisine = !filters.cuisine || (restaurant.cuisine || '').toLowerCase() === filters.cuisine.toLowerCase();
      const matchesPrice = !filters.price || restaurant.price_level <= Number(filters.price);
      const matchesOffers = !filters.offers || (restaurant.offers || '').toLowerCase().includes(filters.offers.toLowerCase());

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRating &&
        matchesDeliveryTime &&
        matchesCuisine &&
        matchesPrice &&
        matchesOffers
      );
    });
  }, [restaurants, filters]);

  if (loading) {
    return <div className="container loading-page">Loading restaurants...</div>;
  }

  return (
    <div className="container restaurants-page animate-fade-in">
      <div className="page-top">
        <h1 className="page-title">Explore Restaurants</h1>
        <p>{filteredRestaurants.length} restaurants available</p>
      </div>

      <section className="filters-grid premium-card">
        <input
          className="input-field"
          placeholder="Search restaurant, food, category"
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
        />
        <select className="input-field" value={filters.rating} onChange={(event) => updateFilter('rating', event.target.value)}>
          <option value="">Rating</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
        <select className="input-field" value={filters.deliveryTime} onChange={(event) => updateFilter('deliveryTime', event.target.value)}>
          <option value="">Delivery Time</option>
          <option value="30">Under 30 min</option>
          <option value="40">Under 40 min</option>
        </select>
        <select className="input-field" value={filters.cuisine} onChange={(event) => updateFilter('cuisine', event.target.value)}>
          <option value="">Cuisine</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select className="input-field" value={filters.price} onChange={(event) => updateFilter('price', event.target.value)}>
          <option value="">Price</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
        </select>
        <select className="input-field" value={filters.offers} onChange={(event) => updateFilter('offers', event.target.value)}>
          <option value="">Offers</option>
          <option value="free">Free Delivery</option>
          <option value="20%">20% OFF</option>
          <option value="buy 1">Buy 1 Get 1</option>
        </select>
      </section>
      
      <div className="restaurants-grid">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isFavorite={isFavorite(restaurant.id, 'restaurant')}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
