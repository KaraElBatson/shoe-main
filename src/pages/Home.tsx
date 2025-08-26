import { motion, type Variants } from 'framer-motion';
import Categories from '../components/Home/Categories';
import Options from '../components/Home/Options';
import Shoes from '../components/Home/Shoes';

const pageVariants: Variants = {
  initial: { y: -100 },
  animate: { y: 0 },
  exit: { y: 100 },
};

export default function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <Categories />
      <Shoes />
      <Options />
    </motion.div>
  );
}
