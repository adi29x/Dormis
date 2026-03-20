import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import RoomListing from './pages/RoomListing';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import Terms from './pages/Terms';
import GlobalLoader from './components/ui/GlobalLoader';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 15 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.02, y: -15 }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4
};

const AnimatedPage = ({ children }) => (
  <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();
  const [appLoading, setAppLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowBackToTop(true);
      else setShowBackToTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white relative">
      <AnimatePresence mode="wait">
        {appLoading && <GlobalLoader key="loader" />}
      </AnimatePresence>

      {!appLoading && (
        <>
          {/* Global Scroll Progress Bar */}
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black z-[100] origin-left" style={{ scaleX }} />
          
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
              <Route path="/rooms" element={<AnimatedPage><RoomListing /></AnimatedPage>} />
              <Route path="/booking/:id" element={<AnimatedPage><BookingPage /></AnimatedPage>} />
              <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/admin" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
              <Route path="/support" element={<AnimatedPage><Support /></AnimatedPage>} />
              <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>

          {/* Back to Top */}
          <AnimatePresence>
            {showBackToTop && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-50 p-3 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 transition-colors"
              >
                <ArrowUp size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
