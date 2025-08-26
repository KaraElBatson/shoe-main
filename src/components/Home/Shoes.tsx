import data from '../../data/shoes.json';
import { cn } from '../../utils';
import { useLocation, useNavigate } from 'react-router';
import { motion, type Variants } from 'framer-motion';
import { useMemo } from 'react';

export default function Shoes() {
  const { search } = useLocation();

  const filtered = useMemo(() => {
    const params = new URLSearchParams(search);
    const q = (params.get('q') ?? '').trim().toLowerCase();
    if (!q) return data;
    return data.filter((shoe) =>
      [shoe.name, shoe.slug].some((v) => v.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="no-scrollbar -mr-4 flex snap-x snap-mandatory gap-18 overflow-x-auto overflow-y-hidden">
      {filtered.map((shoe) => (
        <Shoe
          key={shoe.slug}
          name={shoe.name}
          slug={shoe.slug}
          price={shoe.price}
          img={shoe.img}
          bgColor={shoe.bgColor}
          theme={shoe.theme as 'light' | 'dark'}
        />
      ))}
    </div>
  );
}

type ShoeProps = {
  name: string;
  slug: string;
  price: string;
  img: string;
  bgColor: string;
  theme: 'light' | 'dark';
};

function Shoe({ name, slug, price, img, bgColor, theme = 'light' }: ShoeProps) {
  const navigate = useNavigate();

  const shoeVariants: Variants = {
    offscreen: {
      rotate: 0,
    },
    onscreen: {
      rotate: -30,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 22,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        'relative flex h-92 w-[75%] shrink-0 snap-start flex-col gap-4 rounded-2xl px-8 py-6 sm:w-[60%]',
      )}
      layoutId={`${slug}-bg-color`}
      style={{ backgroundColor: bgColor }}
      onClick={() => navigate(`details/${slug}`)}
    >
      <div className={cn({ 'text-white': theme === 'dark', 'text-gray-950': theme === 'light' })}>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="font-light tracking-widest">{price}</p>
      </div>
      <div
        className={cn('h-[70%] w-0 border-r opacity-20', {
          'border-white': theme === 'dark',
          'border-gray-600': theme === 'light',
        })}
      />

      <motion.img
        layoutId={slug}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.5 }}
        variants={shoeVariants}
        className="absolute -right-16 bottom-16 w-92"
        src={img}
        alt={name}
      />
    </motion.div>
  );
}
