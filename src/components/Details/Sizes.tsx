import { cn } from '../../utils';

interface SizesProps {
  sizes: { label: string; stock: boolean }[];
  selected?: string | null;
  onSelect?: (label: string) => void;
}

export default function Sizes({ sizes, selected, onSelect }: SizesProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">Select Size</h3>
      <div className="flex flex-wrap gap-4">
        {sizes.map((size, i) => (
          <button
            key={i}
            className={cn(
              'flex h-12 w-[calc(25%-16px)] items-center justify-center rounded-xl border bg-white sm:w-[calc(20%-16px)]',
              selected === size.label
                ? 'border-gray-900 text-gray-900'
                : 'border-gray-200 text-gray-800',
              { 'cursor-not-allowed opacity-50': !size.stock },
            )}
            disabled={!size.stock}
            onClick={() => size.stock && onSelect?.(size.label)}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
