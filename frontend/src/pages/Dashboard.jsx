import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, MapPin, SearchX, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import SectionWrapper from '../components/ui/SectionWrapper';

export default function Dashboard() {
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      fetchBooking();
    }
  }, [user]);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/user/${user.userId}`);
      setBooking(res.data.data || null);
    } catch (err) {
      console.log('No booking found', err);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${booking._id}`);
      toast.success('Booking cancelled successfully');
      setBooking(null);
      setShowCancelModal(false);
    } catch (err) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-black" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
              <p className="text-gray-500 mb-8">Are you sure you want to cancel your reservation for Room {booking?.roomId?.roomNumber}? This action cannot be undone.</p>
              
              <div className="flex space-x-4 mt-8">
                <Button 
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  variant="secondary"
                  className="flex-1 py-4 rounded-xl"
                >
                  Keep It
                </Button>
                <Button 
                  onClick={confirmCancel}
                  loading={cancelling}
                  variant="danger"
                  className="flex-1 py-4 rounded-xl"
                >
                  Yes, Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">My Booking</h1>

        {booking ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-8 sm:p-10 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Room Number</p>
                <h2 className="text-5xl font-black text-black">{booking.roomId?.roomNumber || 'N/A'}</h2>
              </div>
              <div className="mt-6 sm:mt-0 text-left sm:text-right">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${booking.status === 'Confirmed' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Calendar className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Booking Date</p>
                    <p className="font-bold text-gray-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Room Type</p>
                    <p className="font-bold text-gray-900">{booking.roomId?.type || 'Standard'} Occupancy</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 mb-4 sm:mb-0">Booking ID: <span className="font-mono">{booking._id}</span></p>
                <Button
                  onClick={() => setShowCancelModal(true)}
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl !text-red-600 !border-red-100 hover:!bg-red-50 hover:!border-red-200"
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <SectionWrapper>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 hover:scale-110 transition-transform">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Bookings</h2>
              <p className="text-gray-500 mb-8 max-w-md">You currently don't have any room reservations. Browse the available inventory and secure your spot today.</p>
              <Link to="/rooms">
                <Button variant="primary" className="px-10 py-5 rounded-full text-lg">
                  Browse Available Rooms
                </Button>
              </Link>
            </motion.div>
          </SectionWrapper>
        )}
      </div>
    </div>
  );
}
