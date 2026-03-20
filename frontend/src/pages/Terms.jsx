import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import SectionWrapper from '../components/ui/SectionWrapper';

export default function Terms() {
  const rules = [
    {
      title: "One Student, One Room",
      desc: "To ensure fair allocation across the university, every student is strictly restricted to one active booking. Multiple reservations will be automatically flagged and cancelled.",
      icon: <CheckCircle className="text-black" />
    },
    {
      title: "Mandatory Student ID",
      desc: "Users must use their official Poornima University credentials. Misrepresentation or use of third-party IDs will lead to permanent revocation of booking privileges.",
      icon: <ShieldCheck className="text-black" />
    },
    {
      title: "Administrative Rights",
      desc: "The University Administration reserves the absolute right to modify, relocate, or cancel any booking due to technical maintenance, block renovations, or disciplinary actions.",
      icon: <Gavel className="text-black" />
    },
    {
      title: "Inventory Availability",
      desc: "Room bookings are subject to real-time availability. Joining the waitlist does not guarantee allocation but provides priority when beds become vacant.",
      icon: <AlertCircle className="text-black" />
    }
  ];

  return (
    <div className="bg-white pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">Official Governance</span>
          <h1 className="text-5xl font-black tracking-tight text-black mb-6">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Simple, clear, and professional guidelines for the Dormis institutional ecosystem.</p>
        </motion.div>

        <div className="space-y-12">
          {rules.map((rule, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-start p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                {rule.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">{rule.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">{rule.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 border-t border-gray-100 text-center"
        >
          <p className="text-gray-400 text-sm font-bold mb-8 italic">Last Updated: March 2026. This system is for official educational use of Poornima University only.</p>
          <div className="flex items-center justify-center space-x-2 grayscale opacity-40">
             <span className="font-black text-black text-lg">DORMIS</span>
             <span className="text-xs font-bold text-gray-400">Powered by HEXORA</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
