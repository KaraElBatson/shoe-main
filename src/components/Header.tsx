import { ArrowLeft, Heart, Hexagon, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export default function Header() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <div className="relative z-50 flex h-12 w-full justify-between">
      {isHome ? (
        <>
          <Link to="/" className="touch-hitbox flex">
            <Hexagon />
          </Link>
          <button className="touch-hitbox flex">
            <Search />
          </button>
        </>
      ) : (
        <>
          <Link to="/" className="touch-hitbox flex">
            <ArrowLeft color="white" />
          </Link>
          <button className="touch-hitbox flex">
            <Heart color="white" />
          </button>
        </>
      )}
    </div>
  );
}
