import { Heart, Plus, Star } from 'lucide-react';

const MenuItemCard = ({ item, onAddToCart, onToggleFavorite, isFavorite }) => (
  <article className="menu-item-card premium-card">
    <div className="menu-item-media">
      <img src={item.image_url} alt={item.name} />
      <button
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={() =>
          onToggleFavorite({
            type: 'food',
            id: item.id,
            name: item.name,
            image: item.image_url,
            category: item.category,
            rating: item.rating,
          })
        }
      >
        <Heart size={16} fill={isFavorite ? 'currentColor' : 'transparent'} />
      </button>
    </div>
    <div className="menu-item-content">
      <div className="card-title-row">
        <h3>{item.name}</h3>
        <span className="rating-pill"><Star size={14} fill="currentColor" /> {item.rating}</span>
      </div>
      <p>{item.description}</p>
      <div className="menu-item-tags">
        <span>{item.category}</span>
        <span>{item.calories} kcal</span>
      </div>
      <div className="menu-item-footer">
        <strong>${item.price.toFixed(2)}</strong>
        <button className="btn btn-primary mini-btn" onClick={() => onAddToCart(item)}>
          <Plus size={14} /> Add To Cart
        </button>
      </div>
    </div>
  </article>
);

export default MenuItemCard;
