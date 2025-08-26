import { ArrowLeft, Heart, Hexagon, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';

export default function Header() {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();

  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') ?? '';
  }, [location.search]);

  const [query, setQuery] = useState<string>(initialQuery);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(initialQuery.length > 0);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const isHome = pathname === '/';

  return (
    <div className="relative z-50 flex h-12 w-full justify-between">
      {isHome ? (
        <>
          <Link to="/" className="touch-hitbox flex">
            <Hexagon />
          </Link>
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
          <button className="touch-hitbox flex" aria-label="Favoriler" title="Favoriler">
            <Heart color="white" />
          </button>
        </>
      )}
    </div>
  );
}
