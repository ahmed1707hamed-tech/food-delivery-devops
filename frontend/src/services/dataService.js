import api from './api';
import { generatedMenusByRestaurant, generatedOrders, generatedRestaurants } from '../data/mockData';

const normalizeRestaurant = (restaurant, index = 0) => ({
  ...restaurant,
  cuisine: restaurant.cuisine || restaurant.category || 'International',
  category: restaurant.category || restaurant.cuisine || 'International',
  cover_image: restaurant.cover_image || restaurant.image_url,
  logo:
    restaurant.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'Food')}&background=FF5A5F&color=fff`,
  delivery_time: restaurant.delivery_time || `${20 + (index % 15)}-${30 + (index % 15)} min`,
  delivery_fee: restaurant.delivery_fee ?? Number((1.5 + (index % 5) * 0.7).toFixed(2)),
  price_level: restaurant.price_level || 1 + (index % 3),
  offers: restaurant.offers || (index % 2 === 0 ? 'Free Delivery' : '20% OFF'),
  popular_meals: restaurant.popular_meals || [],
});

export const getRestaurants = async () => {
  try {
    const res = await api.get('/restaurants');
    const fromApi = Array.isArray(res.data) ? res.data.map(normalizeRestaurant) : [];
    if (fromApi.length >= 50) {
      return fromApi;
    }
    const needed = 50 - fromApi.length;
    const extra = generatedRestaurants.slice(0, needed);
    return [...fromApi, ...extra];
  } catch {
    return generatedRestaurants;
  }
};

export const getRestaurantDetails = async (id) => {
  try {
    const res = await api.get(`/restaurants/${id}`);
    return normalizeRestaurant(res.data);
  } catch {
    return generatedRestaurants.find((restaurant) => String(restaurant.id) === String(id)) || null;
  }
};

export const getRestaurantMenu = async (id, fallbackCuisine) => {
  try {
    const res = await api.get(`/menu/${id}`);
    const apiMenu = Array.isArray(res.data) ? res.data : [];
    if (apiMenu.length >= 15) {
      return apiMenu;
    }

    const generated = generatedMenusByRestaurant[id] || [];
    const merged = [...apiMenu, ...generated];
    return merged.slice(0, Math.max(15, merged.length));
  } catch {
    const generated = generatedMenusByRestaurant[id];
    if (generated) {
      return generated;
    }
    const fallbackRestaurant = generatedRestaurants.find((restaurant) => String(restaurant.id) === String(id));
    const cuisine = fallbackCuisine || fallbackRestaurant?.cuisine || 'Pizza';
    return generatedMenusByRestaurant[fallbackRestaurant?.id] || [];
  }
};

export const getOrders = async () => {
  try {
    const res = await api.get('/orders');
    const apiOrders = Array.isArray(res.data) ? res.data : [];
    if (apiOrders.length >= 20) {
      return apiOrders;
    }
    return [...apiOrders, ...generatedOrders.slice(0, 20 - apiOrders.length)];
  } catch {
    return generatedOrders;
  }
};
