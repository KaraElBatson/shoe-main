import categories from '../../data/categories.json';
import { cn } from '../../utils';
import { useLocation, useNavigate } from 'react-router';

export default function Categories() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const active = params.get('cat') ?? '';

  const setCategory = (value?: string) => {
    const next = new URLSearchParams(search);
    if (value) next.set('cat', value);
    else next.delete('cat');
    navigate({ pathname: '/', search: `?${next.toString()}` });
  };
  return (
    <div className="-mr-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Shoes</h1>
      <div className="no-scrollbar flex flex-shrink-0 gap-2 overflow-x-auto scroll-smooth whitespace-nowrap">
        <button
          onClick={() => setCategory(undefined)}
          className={cn(
            'rounded-full px-6 py-2 text-xs',
            active
              ? 'border border-gray-300 bg-gray-50 text-gray-700'
              : 'bg-gray-900 text-gray-100',
          )}
        >
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className={cn(
              'rounded-full px-6 py-2 text-xs',
              active === category
                ? 'bg-gray-900 text-gray-100'
                : 'border border-gray-300 bg-gray-50 text-gray-700',
              { 'mr-2': categories.length - 1 === index },
            )}
            onClick={() => setCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
