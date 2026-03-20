import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Filter, Users, Building } from 'lucide-react';
import RoomCard from '../components/RoomCard';

export default function RoomListing() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchRooms();
  }, [filterType, filterStatus]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
       const res = await axios.get(`http://localhost:5000/api/rooms?type=${filterType}&availability=${filterStatus}`);
       setRooms(res.data.data);
    } catch (err) {
       console.error("Failed to load rooms", err);
    } finally {
       setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Available Spaces</h1>
            <p className="text-lg text-gray-500 font-medium">Find your perfect spot on campus.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-2">
              <div className="px-3 text-gray-400"><Filter size={18} /></div>
              <select 
                title="Room Type"
                className="bg-transparent text-sm font-bold text-gray-700 outline-none pr-4 cursor-pointer"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
            
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-2">
              <select 
                title="Availability"
                className="bg-transparent pl-4 text-sm font-bold text-gray-700 outline-none pr-4 cursor-pointer"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="All">Any Status</option>
                <option value="Available">Strictly Available</option>
                <option value="Partial">Includes Waitlist</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[280px]">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex space-x-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl"></div>
                    <div className="flex flex-col space-y-3 py-1 mt-1">
                      <div className="h-5 bg-gray-100 rounded w-20"></div>
                      <div className="h-4 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
                </div>
                <div className="w-full bg-gray-100 rounded-2xl h-20 mb-6 mt-auto"></div>
                <div className="w-full bg-gray-200 rounded-xl h-12"></div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 flex flex-col items-center text-center mt-8"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Building className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Rooms Found</h2>
            <p className="text-gray-500 max-w-md">Try adjusting your filters. We might be fully booked for the selected criteria.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rooms.map(room => (
              <motion.div variants={itemVariants} key={room._id} className="group">
                <RoomCard room={room} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
