import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Users, Building2, User, UserPlus, Users as Group, CheckCircle2, Star } from 'lucide-react';
import axios from 'axios';
import SectionWrapper from '../components/ui/SectionWrapper';
import ParticleBackground from '../components/ui/ParticleBackground';

// Animated Counter Component
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    if (value === 0) return setCount(0); // safeguard

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
};

export default function Landing() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mouse Tracking for Hero Glow
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  
  const springConfig = { damping: 40, stiffness: 200 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);
  
  // Parallax offsets based on mouse
  const pX1 = useTransform(glowX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [30, -30]);
  const pY1 = useTransform(glowY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [30, -30]);
  
  const pX2 = useTransform(glowX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-40, 40]);
  const pY2 = useTransform(glowY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [-40, 40]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white flex flex-col items-center overflow-hidden">
      
      {/* 1. Interactive Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col items-center text-center min-h-[90vh] justify-center overflow-hidden">
        
        {/* Dynamic Glow Tracking Cursor */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-gray-200 to-gray-50 blur-[100px] -z-10 opacity-60 pointer-events-none"
          style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
        />

        {/* Premium Particle Background */}
        <ParticleBackground mouseX={mouseX} mouseY={mouseY} />
        
        {/* Abstract Parallax Blobs */}
        <motion.div 
          style={{ x: pX1, y: pY1 }}
          className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-gray-100 rounded-[40%_60%_70%_30%] blur-[60px] opacity-70 -z-20 pointer-events-none"
        />
        <motion.div 
          style={{ x: pX2, y: pY2 }}
          className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-gray-50 rounded-[60%_40%_30%_70%] blur-[80px] opacity-80 -z-20 pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md border border-gray-200 shadow-sm text-sm px-5 py-2.5 rounded-full mb-10"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="font-semibold text-gray-800 tracking-wide">Status: Booking Open for 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-8 leading-[1.1] relative"
        >
          <span className="relative inline-block overflow-hidden">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-black to-gray-400 relative z-10">Smart Hostel Allocation,</span>
            <br />
            Simplified.
            <motion.span 
               className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
               animate={{ left: ["-100%", "200%"] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed font-light"
        >
          No chaos. No confusion. Just seamless room booking for Poornima University students. Experience a high-performance system designed for total fairness and real-time efficiency.
        </motion.p>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-4"
        >
           An Institutional Solution Powered by HEXORA
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 mb-24 z-10"
        >
          <Link
            to="/rooms"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-black text-white font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
          >
            <span>Explore Rooms</span>
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 2. Live Stats Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 text-left relative z-10"
        >
          <div className="flex flex-col md:flex-row md:items-center p-2 justify-between mb-10 border-b border-gray-100 pb-8">
            <h2 className="text-3xl font-black flex items-center tracking-tight text-gray-900">
               <Building2 className="mr-4 w-8 h-8 text-black" /> Live Availability
            </h2>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[1,2,3,4].map(i => (
                 <div key={i} className="animate-pulse bg-gray-50 rounded-3xl h-36 w-full border border-gray-100"></div>
               ))}
             </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex flex-col items-start justify-center text-left transition-transform hover:-translate-y-1 hover:shadow-lg hover:bg-white duration-300">
                 <p className="text-5xl font-black text-black mb-3"><AnimatedNumber value={stats.totalRooms} /></p>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Rooms</p>
              </div>
              <div className="bg-gray-50/50 p-8 rounded-3xl border border-green-100 flex flex-col items-start justify-center text-left transition-transform hover:-translate-y-1 hover:shadow-lg hover:bg-white duration-300 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full opacity-50 group-hover:bg-green-200 transition-colors"></div>
                 <p className="text-5xl font-black text-green-600 mb-3 relative z-10"><AnimatedNumber value={stats.availableSlots} /></p>
                 <p className="text-sm font-bold text-green-600/70 uppercase tracking-widest relative z-10">Beds Left</p>
              </div>
              <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex flex-col items-start justify-center text-left transition-transform hover:-translate-y-1 hover:shadow-lg hover:bg-white duration-300">
                 <p className="text-5xl font-black text-black mb-3"><AnimatedNumber value={stats.totalBookings} /></p>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bookings</p>
              </div>
              <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex flex-col items-start justify-center text-left transition-transform hover:-translate-y-1 hover:shadow-lg hover:bg-white duration-300">
                 <p className="text-5xl font-black text-black mb-3"><AnimatedNumber value={stats.occupancyPercentage} />%</p>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Occupied</p>
              </div>
            </div>
          ) : (
             <p className="text-gray-500 text-center py-10 font-medium">System offline.</p>
          )}
        </motion.div>
      </section>

      {/* 2. Problem-Solution Section */}
      <SectionWrapper className="w-full bg-white py-32 border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">The Problem</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-8 leading-tight">
                Traditional allocation <br />is broken.
              </h2>
              <ul className="space-y-6">
                {[
                  "Manual room allocation creates unnecessary chaos.",
                  "Overbooking issues lead to student frustration.",
                  "Lack of transparency breeds mistrust in the system."
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2.5 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-600 text-lg font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">The Solution</span>
              <h2 className="text-4xl font-black mb-8 leading-tight">
                Engineered for <br />Certainty.
              </h2>
              <ul className="space-y-6">
                {[
                  "Real-time availability accessible instantly.",
                  "Strict one-user-one-booking enforcement.",
                  "Structured, verifiable allocation ledgers."
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 mr-4 flex-shrink-0"></div>
                    <span className="text-gray-300 text-lg font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* 4. How It Works Section */}
      <SectionWrapper className="w-full bg-black py-32 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">How Dormis Works</h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">Three simple steps to claim your premium space on campus.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gray-800 z-0"></div>
            
            {[
              { step: 1, title: 'Real-Time Inventory', desc: 'Browse live inventory with zero delay. What you see is exactly what is available.' },
              { step: 2, title: 'Smart Allocation', desc: 'Our logic ensures fair distribution based on institutional rules and bed status.' },
              { step: 3, title: 'Instant Confirmation', desc: 'Secure your space instantly with digital ledgers. No paperwork, no wait times.' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white text-black font-black text-3xl rounded-3xl flex items-center justify-center shadow-2xl mb-8 transform transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 3. Room Categories Section */}
      <SectionWrapper className="w-full bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">Tailored to Your Vibe</h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Select a room configuration that flawlessly matches your lifestyle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Single Occupancy", icon: <User className="w-10 h-10" />, desc: "Absolute privacy for intense focus. Uninterrupted personal space tailored for independent living.", price: "₹85,000 / Sem" },
              { title: "Double Occupancy", icon: <UserPlus className="w-10 h-10" />, desc: "The perfect balance of social connection and personal comfort. Ideal for pairing up with a friend.", price: "₹70,000 / Sem" },
              { title: "Triple Occupancy", icon: <Group className="w-10 h-10" />, desc: "A vibrant, energetic environment. The most cost-effective way to experience the true campus hustle.", price: "₹60,000 / Sem" }
            ].map((cat, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-3 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-gray-100 transition-colors pointer-events-none"></div>
                 <div className="relative z-10 w-20 h-20 bg-gray-50 text-black rounded-3xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-black/20">
                   {cat.icon}
                 </div>
                 <h3 className="relative z-10 text-3xl font-black text-gray-900 mb-4">{cat.title}</h3>
                 <p className="relative z-10 text-gray-500 text-lg leading-relaxed mb-8 flex-1">{cat.desc}</p>
                 <div className="relative z-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                   <span className="font-bold text-gray-900 text-xl">{cat.price}</span>
                   <Link to="/rooms" className="text-black font-bold hover:underline underline-offset-4 group-hover:translate-x-1 transition-transform inline-block">Explore Units &rarr;</Link>
                 </div>
               </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 5. Why Choose Dormis */}
      <SectionWrapper className="w-full bg-white py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">Why Choose Dormis</h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Engineered from the ground up to redefine what student accommodation means.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <ShieldCheck className="w-7 h-7" />, title: "Digital Security", desc: "Automated verification ensuring every booking is legitimate and unique." },
              { icon: <Clock className="w-7 h-7" />, title: "Optimized Speed", desc: "Built for scale, handling thousands of concurrent users with zero lag." },
              { icon: <Building2 className="w-7 h-7" />, title: "Institutional Grade", desc: "Tailored specifically for the administrative needs of Poornima University." },
              { icon: <CheckCircle2 className="w-7 h-7" />, title: "Fair Allocation", desc: "Algorithmic fairness that eliminates bias in room distribution." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center flex flex-col items-center group"
              >
                <div className="w-16 h-16 bg-gray-50 text-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 7. CTA Section */}
      <section className="w-full bg-black py-40 px-4 text-center relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiI+CiAgPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz4KPC9zdmc+')] bg-[length:22px_22px]"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">Ready to secure your spot?</h2>
          <p className="text-2xl text-gray-400 font-light mb-12">Join the revolution. Upgrade your university living instantly.</p>
          <Link
            to="/rooms"
            className="group relative inline-flex items-center justify-center px-12 py-6 bg-white text-black font-black text-2xl rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-white/20"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <span className="relative z-10">Show Me The Rooms</span>
            <ArrowRight className="relative z-10 ml-4 w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* 8. Footer */}
      <footer className="w-full bg-white border-t border-gray-100 py-16 text-center md:text-left relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 text-black font-extrabold text-2xl tracking-tight mb-2 justify-center md:justify-start group">
              <div className="bg-black text-white p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <Building2 size={24} />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight">Dormis</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Powered by HEXORA</span>
              </div>
            </div>
            <p className="text-gray-500 font-medium mt-4 max-w-sm">The leading institutional hostel allocation engine for Poornima University.</p>
          </div>
          
          <div className="flex space-x-8 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <Link to="/rooms" className="hover:text-black transition-colors">Rooms</Link>
            <Link to="/support" className="hover:text-black transition-colors">Support</Link>
            <Link to="/terms" className="hover:text-black transition-colors">Terms</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between text-sm text-gray-400 font-medium">
          <p>© 2026 Dormis Platform. Built for Institutional Excellence.</p>
          <div className="flex items-center mt-4 md:mt-0 italic">
            <span>Engineering the future of campus living</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mx-3"></div>
            <span className="text-black font-bold">HEXORA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
