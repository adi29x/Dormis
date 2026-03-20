import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function SectionWrapper({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  
  // Parallax effect for section reveal
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.2 1"] // Trigger when top of section crosses bottom of window
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      transition={{ delay }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}
