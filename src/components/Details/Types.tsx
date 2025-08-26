import { cn } from '../../utils';

interface TypesProps {
  types: { img: string }[];
}

export default function Types({ types }: TypesProps) {
  return (
    <div className="flex gap-4">
      {types.map((type, index) => (
        <button
          key={index}
          className={cn('flex h-24 w-24 items-center justify-center rounded-3xl', {
            'border-2': index === 0,
          })}
        >
          <img src={type.img} className="w-20" />
        </button>
      ))}
    </div>
  );
}
