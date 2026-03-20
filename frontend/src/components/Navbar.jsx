import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, toggleRole } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Active Pill Animation Component
  const NavLinkXY = ({ to, label }) => (
    <Link 
      to={to} 
      className={`relative px-4 py-2 font-bold text-sm transition-colors z-10 ${isActive(to) ? 'text-black' : 'text-gray-500 hover:text-black'}`}
    >
      {isActive(to) && (
        <motion.div 
          layoutId="navbar-pill"
          className="absolute inset-0 bg-gray-100 rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {label}
    </Link>
  );

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' : 'py-5 bg-white/0 border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-black font-extrabold text-xl tracking-tight transition-transform hover:scale-105 active:scale-95">
            <div className="bg-black text-white p-1.5 rounded-xl shadow-lg shadow-black/20">
              <Home size={20} />
            </div>
            <div className="flex flex-col">
              <span className="leading-none tracking-tight">Dormis</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none mt-1">Powered by HEXORA</span>
            </div>
          </Link>

          <div className="flex space-x-2 items-center relative">
            <div className="hidden sm:flex space-x-1 mr-4 bg-white/50 p-1 rounded-full border border-gray-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-md">
              <NavLinkXY to="/" label="Home" />
              <NavLinkXY to="/rooms" label="Rooms" />
              {user?.role === 'admin' ? (
                <NavLinkXY to="/admin" label="Admin Panel" />
              ) : (
                <NavLinkXY to="/dashboard" label="My Booking" />
              )}
              <NavLinkXY to="/support" label="Support" />
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRole}
              className="flex items-center space-x-1.5 px-4 py-2 bg-black text-white text-xs font-bold rounded-full shadow-xl shadow-black/10 hover:shadow-black/20 transition-shadow"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{user?.role === 'admin' ? 'Admin Mode' : 'Student Mode'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
