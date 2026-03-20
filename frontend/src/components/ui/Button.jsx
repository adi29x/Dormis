import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({ children, onClick, disabled, loading, variant = 'primary', className = "" }) {
  
  const baseClass = "relative overflow-hidden font-bold flex justify-center items-center transition-all disabled:cursor-not-allowed group focus:outline-none focus:ring-4 focus:ring-black/10";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-900 shadow-xl shadow-black/10 hover:shadow-black/20",
    secondary: "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 hover:shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 hover:shadow-red-600/30",
    outline: "bg-transparent text-black border-2 border-gray-200 hover:border-black"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
      ) : (
        <>
          <span className="relative z-10 flex items-center space-x-2">{children}</span>
          {/* Subtle glow layer that shimmers on hover for primary/danger buttons */}
          {(variant === 'primary' || variant === 'danger') && (
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></span>
          )}
        </>
      )}
    </motion.button>
  );
}
