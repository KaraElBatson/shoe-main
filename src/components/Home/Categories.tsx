import categories from '../../mock/categories.json';
import { cn } from '../../utils';

export default function Categories() {
  return (
    <div className="-mr-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Shoes</h1>
      <div className="no-scrollbar flex flex-shrink-0 gap-2 overflow-x-auto scroll-smooth whitespace-nowrap">
        <div className="rounded-full bg-gray-900 px-6 py-2 text-xs text-gray-100">All</div>
        {categories.map((category, index) => (
          <button
            key={index}
            className={cn(
              'rounded-full border border-gray-300 bg-gray-50 px-6 py-2 text-xs text-gray-700',
              { 'mr-2': categories.length - 1 === index },
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
