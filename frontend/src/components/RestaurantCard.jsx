import { Link } from 'react-router-dom';
import { Clock3, Heart, Star, Truck } from 'lucide-react';

const RestaurantCard = ({ restaurant, isFavorite, onToggleFavorite }) => (
  <article className="restaurant-card premium-card">
    <Link to={`/restaurants/${restaurant.id}`} className="card-cover">
      <img src={restaurant.cover_image || restaurant.image_url} alt={restaurant.name} />
      <span className="offer-badge">{restaurant.offers}</span>
    </Link>
    <button
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      onClick={() =>
        onToggleFavorite({
          type: 'restaurant',
          id: restaurant.id,
          name: restaurant.name,
          image: restaurant.cover_image || restaurant.image_url,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating,
        })
      }
    >
      <Heart size={16} fill={isFavorite ? 'currentColor' : 'transparent'} />
    </button>
    <div className="card-body">
      <div className="card-title-row">
        <h3>{restaurant.name}</h3>
        <span className="rating-pill">
          <Star size={14} fill="currentColor" /> {restaurant.rating}
        </span>
      </div>
      <p>{restaurant.description}</p>
      <div className="card-meta">
        <span><Clock3 size={14} /> {restaurant.delivery_time}</span>
        <span><Truck size={14} /> ${restaurant.delivery_fee}</span>
        <span>{restaurant.cuisine}</span>
      </div>
    </div>
  </article>
);

export default RestaurantCard;
