import { motion } from 'framer-motion';

export default function GlobalLoader() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-24 h-24 border border-white/20 rounded-full border-t-white/80"
        />
        {/* Inner static branding */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl font-black text-2xl tracking-tighter"
        >
          D
        </motion.div>
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 font-bold tracking-widest uppercase text-sm text-gray-400"
      >
        Initializing Dormis
      </motion.p>
    </motion.div>
  );
}
