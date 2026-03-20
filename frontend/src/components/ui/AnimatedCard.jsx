import { motion } from 'framer-motion';

export default function AnimatedCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 relative overflow-hidden group ${className}`}
    >
      {/* Decorative gradient blob on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-gray-100 transition-colors pointer-events-none"></div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
