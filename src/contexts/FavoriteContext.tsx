import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FavoriteItem {
  id: string;
  size: string;
  name: string;
  price: string;
  img: string;
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (itemId: string, size?: string) => boolean;
  removeFavorite: (itemId: string, size: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const existingIndex = prev.findIndex(fav => fav.id === item.id && fav.size === item.size);
      if (existingIndex >= 0) {
        // Favorilerden çıkar
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Favorilere ekle
        return [...prev, item];
      }
    });
  };

  const isFavorite = (itemId: string, size?: string) => {
    if (size) {
      return favorites.some(fav => fav.id === itemId && fav.size === size);
    }
    return favorites.some(fav => fav.id === itemId);
  };

  const removeFavorite = (itemId: string, size: string) => {
    setFavorites(prev => prev.filter(fav => !(fav.id === itemId && fav.size === size)));
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
