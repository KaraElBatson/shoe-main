import './App.css';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Detail from './pages/Detail';
import { AnimatePresence } from 'framer-motion';
import { FavoriteProvider } from './contexts/FavoriteContext';
import Layout from './components/common/Layout';

function App() {
  return (
    <FavoriteProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details/:slug" element={<Detail />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </FavoriteProvider>
  );
}

export default App;
