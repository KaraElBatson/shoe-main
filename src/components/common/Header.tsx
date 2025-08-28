import { ArrowLeft, Heart, Hexagon, Search, ShoppingBag, X, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { useFavorites } from '../../contexts/FavoriteContext';
import data from '../../data/shoes.json';
import { cn } from '../../utils';

export default function Header() {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, removeFavorite, toggleFavorite, isFavorite } = useFavorites();

  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') ?? '';
  }, [location.search]);

  const [query, setQuery] = useState<string>(initialQuery);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(initialQuery.length > 0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFavoriteMenuOpen, setIsFavoriteMenuOpen] = useState<boolean>(false);

  // Basit sepet state'i
  const [cart, setCart] = useState<Array<{id: string, name: string, price: number, quantity: number}>>([]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const isHome = pathname === '/';

  // Sepetten çıkarma
  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Toplam sepet tutarı
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Favori ekleme fonksiyonu
  const handleAddToFavorites = (shoe: { slug: string; name: string; price: string; img: string; sizes: Array<{ label: string; stock: boolean }> }, size: string) => {
    const favoriteItem = {
      id: shoe.slug,
      size: size,
      name: shoe.name,
      price: shoe.price,
      img: shoe.img
    };
    toggleFavorite(favoriteItem);
  };

  // Favoriyi sepete ekleme
  const addFavoriteToCart = (favoriteItem: { id: string; size: string; name: string; price: string; img: string }) => {
    const priceNumber = parseInt(favoriteItem.price.replace(/[^0-9]/g, ''));
    const cartItem = {
      id: `${favoriteItem.id}-${favoriteItem.size}`,
      name: `${favoriteItem.name} (${favoriteItem.size})`,
      price: priceNumber,
      quantity: 1
    };
    
    setCart(prev => {
      const existingItem = prev.find(item => item.id === cartItem.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === cartItem.id 
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      }
      return [...prev, cartItem];
    });
  };

  // Sağ üstteki kalp ikonuna tıklama fonksiyonu
  const handleHeartClick = () => {
    // Eğer detay sayfasındaysak
    if (pathname.includes('/details/')) {
      const slug = pathname.split('/details/')[1];
      const shoe = data.find(s => s.slug === slug);
      
      if (shoe) {
        // İlk mevcut numarayı bul
        const firstAvailableSize = shoe.sizes.find(size => size.stock);
        if (firstAvailableSize) {
          handleAddToFavorites(shoe, firstAvailableSize.label);
        } else {
          alert('Bu ürünün mevcut numarası yok!');
        }
      }
    } else {
      // Ana sayfadaysak favoriler menüsünü aç
      setIsFavoriteMenuOpen(!isFavoriteMenuOpen);
    }
  };

  // Mevcut sayfadaki ayakkabının favori durumunu kontrol et
  const getCurrentShoeFavoriteStatus = () => {
    if (pathname.includes('/details/')) {
      const slug = pathname.split('/details/')[1];
      const shoe = data.find(s => s.slug === slug);
      
      if (shoe) {
        // Bu ayakkabının herhangi bir numarası favorilerde mi kontrol et
        return shoe.sizes.some(size => isFavorite(slug, size.label));
      }
    }
    return false;
  };

  const isCurrentShoeFavorite = getCurrentShoeFavoriteStatus();

  return (
    <div className="relative z-50 flex h-12 w-full justify-between">
      {isHome ? (
        <>
          {/* Logo ve Dropdown Menü */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="touch-hitbox flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              title="Menüyü aç/kapat"
            >
              <Hexagon />
              <span className="text-sm font-medium">Menü</span>
            </button>

            {/* Dropdown Menü */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Hesabım</h3>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Menüyü kapat"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Favorilerim Bölümü */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart size={20} className="text-red-500" />
                      <h4 className="font-medium">Favorilerim ({favorites.length})</h4>
                    </div>
                    {favorites.length === 0 ? (
                      <p className="text-gray-500 text-sm">Henüz favori ürününüz yok</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {favorites.map((item, index) => (
                          <div key={`${item.id}-${item.size}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <img src={item.img} alt={item.name} className="w-8 h-8 rounded object-cover" />
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.size} - {item.price}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => addFavoriteToCart(item)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Sepete ekle"
                              >
                                <ShoppingBag size={14} />
                              </button>
                              <button 
                                onClick={() => removeFavorite(item.id, item.size)}
                                className="text-red-500 hover:text-red-700"
                                title="Favorilerden çıkar"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sepet Bölümü */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag size={20} className="text-blue-500" />
                      <h4 className="font-medium">Sepet ({cart.length})</h4>
                    </div>
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-sm">Sepetiniz boş</p>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} adet - {item.price}₺
                              </p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Sepetten çıkar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Toplam ve Butonlar */}
                  {cart.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Toplam:</span>
                        <span className="font-semibold text-blue-600">{cartTotal}₺</span>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Sepeti Tamamla
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Arama Bölümü */}
          {isSearchActive ? (
            <div className="flex w-full max-w-[420px] items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  const params = new URLSearchParams(location.search);
                  if (value) {
                    params.set('q', value);
                  } else {
                    params.delete('q');
                  }
                  navigate({ pathname: '/', search: `?${params.toString()}` });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (!query) setIsSearchActive(false);
                  }
                }}
                onBlur={() => {
                  if (!query) setIsSearchActive(false);
                }}
                placeholder="Ayakkabı ara…"
                aria-label="Arama"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300"
              />
            </div>
          ) : (
            <button
              className="touch-hitbox flex"
              aria-label="Arama"
              title="Arama"
              onClick={() => setIsSearchActive(true)}
            >
              <Search />
            </button>
          )}
        </>
      ) : (
        <>
          <Link to="/" className="touch-hitbox flex">
            <ArrowLeft color="white" />
          </Link>
          
          {/* Favori Butonu ve Menüsü */}
          <div className="relative">
            <button 
              className="touch-hitbox flex" 
              aria-label="Favoriler" 
              title={isCurrentShoeFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              onClick={handleHeartClick}
            >
              <Heart 
                className={cn(
                  "transition-all duration-200",
                  isCurrentShoeFavorite && "fill-red-500 text-red-500"
                )}
                color="white" 
              />
            </button>

            {/* Favori Dropdown Menüsü */}
            {isFavoriteMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Favorilerim</h3>
                    <button 
                      onClick={() => setIsFavoriteMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Menüyü kapat"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {favorites.length === 0 ? (
                    <p className="text-gray-500 text-sm">Henüz favori ürününüz yok</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {favorites.map((item, index) => (
                        <div key={`${item.id}-${item.size}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded object-cover" />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.size} - {item.price}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => addFavoriteToCart(item)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Sepete ekle"
                            >
                              <ShoppingBag size={14} />
                            </button>
                            <button 
                              onClick={() => removeFavorite(item.id, item.size)}
                              className="text-red-500 hover:text-red-700"
                              title="Favorilerden çıkar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
