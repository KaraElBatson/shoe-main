import './App.css';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Detail from './pages/Detail';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:slug" element={<Detail />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
