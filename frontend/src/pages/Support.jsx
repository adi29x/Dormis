import React from 'react';
import { motion } from 'framer-motion';
import { Mail, HelpCircle, MessageSquare } from 'lucide-react';
import SectionWrapper from '../components/ui/SectionWrapper';
import Button from '../components/ui/Button';

export default function Support() {
  const faqs = [
    {
      q: "How do I book a room?",
      a: "Navigate to the 'Rooms' tab, browse available units, and click 'Secure Booking' on your preferred room. One student is allowed only one booking."
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes, you can cancel your booking from your Personal Dashboard. Once cancelled, the bed becomes instantly available for other students or the waitlist."
    },
    {
      q: "What is the priority waitlist?",
      a: "If a room is full, you can join the waitlist. You will be automatically promoted and notified if an occupant cancels their booking."
    },
    {
      q: "Who do I contact for technical issues?",
      a: "For system errors or login issues, please email our technical team at support@dormis.in or visit the HEXORA helpdesk."
    }
  ];

  return (
    <div className="bg-white pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black tracking-tight text-black mb-6">Help & Support</h1>
          <p className="text-xl text-gray-600 font-medium">Everything you need to navigate the Dormis portal seamlessly.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/10">
              <Mail size={24} />
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Email Support</h3>
            <p className="text-gray-600 mb-6 leading-relaxed font-medium">Direct queries regarding allocation or technical glitches to our dedicated support mail.</p>
            <a href="mailto:support@dormis.in" className="text-black font-bold text-lg hover:underline underline-offset-4">support@dormis.in</a>
          </div>

          <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-start">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/10">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Admin Desk</h3>
            <p className="text-gray-600 mb-6 leading-relaxed font-medium">For physical verification or block-specific queries, visit the Chief Warden's office.</p>
            <span className="text-black font-bold text-lg leading-tight">Administrative Block, PU</span>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-black text-black mb-10 flex items-center tracking-tight">
            <HelpCircle className="mr-3 w-8 h-8" /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="text-xl font-bold text-black mb-3">{faq.q}</h4>
                <p className="text-gray-600 leading-relaxed font-medium">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <SectionWrapper className="bg-black text-white p-12 rounded-[3.5rem] text-center relative overflow-hidden mb-10">
           <div className="relative z-10">
             <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">Still have questions?</h3>
             <p className="text-gray-400 mb-8 max-w-lg mx-auto font-medium">Our team is available 24/7 to ensure your transition to PU Hostels is as smooth as possible.</p>
             <div className="flex justify-center">
               <Button variant="outline" className="bg-white text-black border-none hover:bg-gray-100 px-10 py-4 rounded-full font-black text-lg">
                 Contact Administration
               </Button>
             </div>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
        </SectionWrapper>
      </div>
      
      <div className="max-w-4xl mx-auto text-center pb-20 pt-10 border-t border-gray-50 flex flex-col items-center">
        <p className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-2">Institutional Platform</p>
        <div className="flex items-center space-x-2 grayscale opacity-40">
           <span className="font-black text-black text-lg">DORMIS</span>
           <span className="text-xs font-bold text-gray-400">Powered by HEXORA</span>
        </div>
      </div>
    </div>
  );
}
