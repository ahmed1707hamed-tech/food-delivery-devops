import { createContext, useMemo, useState } from 'react';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const sync = (nextFavorites) => {
    setFavorites(nextFavorites);
    localStorage.setItem('favorites', JSON.stringify(nextFavorites));
  };

  const toggleFavorite = (entity) => {
    const exists = favorites.some((item) => item.id === entity.id && item.type === entity.type);
    if (exists) {
      sync(favorites.filter((item) => !(item.id === entity.id && item.type === entity.type)));
      return;
    }
    sync([...favorites, entity]);
  };

  const isFavorite = (id, type) => favorites.some((item) => item.id === id && item.type === type);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      favoriteCount: favorites.length,
    }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
