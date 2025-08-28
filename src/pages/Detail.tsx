import { useParams } from 'react-router';
import { useState } from 'react';
import data from '../data/shoes.json';
import Info from '../components/Details/Info';
import Types from '../components/Details/Types';
import Sizes from '../components/Details/Sizes';
import { motion, type Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { y: 100 },
  animate: { y: 0 },
  exit: { y: -100 },
};

export default function Detail() {
  const { slug } = useParams();
  const shoe = data.find((s) => s.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!shoe) {
    return <div>Product not found</div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex flex-col gap-6"
    >
      <motion.div
        className="absolute -top-105 -right-40 h-[640px] w-[140vw] min-w-[640px] rounded-full sm:-top-115 sm:w-[140vw] md:w-[1200px]"
        style={{ backgroundColor: shoe.bgColor }}
        layoutId={`${slug}-bg-color`}
      />

      <div className="z-50 flex h-64 items-end justify-center relative">
        <motion.img layoutId={slug} src={shoe.img} className="mb-8 w-80 md:w-96" />
      </div>

      <Info description={shoe.description} name={shoe.name} price={shoe.price} />
      <Types types={shoe.types} />
      <Sizes sizes={shoe.sizes} selected={selectedSize} onSelect={setSelectedSize} />

      <button
        className="w-full rounded-xl bg-gray-800 p-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!selectedSize}
      >
        {selectedSize ? `Add size ${selectedSize} to Bag` : 'Add to Bag'}
      </button>
    </motion.div>
  );
}
