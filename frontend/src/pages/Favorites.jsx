import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

const Favorites = () => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <div className="container page-section">
      <h1 className="page-title">Favorites</h1>
      {favorites.length === 0 ? (
        <div className="premium-card empty-state">
          <h3>No favorites yet</h3>
          <p>Save your favorite restaurants and foods for quick access.</p>
          <Link to="/restaurants" className="btn btn-primary">Explore Restaurants</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div key={`${item.type}-${item.id}`} className="premium-card favorite-item">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.cuisine || item.category}</p>
              <button className="btn btn-secondary mini-btn" onClick={() => toggleFavorite(item)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
