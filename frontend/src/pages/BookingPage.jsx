import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, CheckCircle2, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function BookingPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingAction, setBookingAction] = useState(false);
  
  // Success Receipt State
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(res.data.data);
      } catch (err) {
        console.error("Failed to load room", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBooking = async () => {
    setBookingAction(true);
    try {
      const res = await axios.post('http://localhost:5000/api/bookings', {
        userId: user?.userId,
        roomId: room._id
      });
      // Instead of an immediate redirect or simple toast, render the success receipt
      setSuccessReceipt(res.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book room.');
    } finally {
      setBookingAction(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-black" />
    </div>
  );

  if (!room) return (
    <div className="text-center py-20 text-gray-500">Room not found</div>
  );

  const isFull = room.status === 'Full';

  // Render the Success Screen if a receipt exists
  if (successReceipt) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 p-10 max-w-lg w-full text-center border border-gray-100 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-full -z-0 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gray-50 rounded-tr-full -z-0 opacity-50"></div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <h2 className="text-4xl font-black text-gray-900 mb-4 relative z-10 tracking-tight">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-10 text-lg relative z-10">Your space in <strong className="text-black">Block {room.roomNumber.split('-')[0]}</strong> is highly secured.</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left border border-gray-100 border-dashed relative z-10">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Booking ID</span>
            <span className="font-mono text-black font-bold flex items-center">
              <Ticket className="w-4 h-4 mr-2 text-gray-400" />
              {successReceipt.booking?._id || successReceipt.waitlist?._id}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 font-semibold">Allocated Room</span>
            <span className="font-bold text-gray-900">{room.roomNumber}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 font-semibold">User Reference</span>
            <span className="font-bold text-gray-900">{user?.userId || 'Guest'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Status</span>
            <span className={`font-bold ${successReceipt.booking ? 'text-green-600' : 'text-yellow-600'}`}>
              {successReceipt.booking ? 'Confirmed' : 'Waitlisted'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link to="/rooms" className="flex-1">
            <Button variant="secondary" className="w-full py-4 rounded-xl">Generate Another</Button>
          </Link>
          <Link to="/dashboard" className="flex-1">
            <Button variant="primary" className="w-full py-4 rounded-xl">View Dashboard</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors group font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-10 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Review Reservation</h1>
            <p className="text-gray-500 text-lg">Confirm your details to secure this highly coveted space.</p>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Room Identifier</p>
                <div className="text-4xl font-black text-black">{room.roomNumber}</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Configuration Type</p>
                <div className="text-2xl font-bold text-gray-900 mt-1">{room.type} Occupancy</div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-4">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Capacity Metrics</h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">Current Occupancy</span>
                <span className="font-bold text-black">{room.occupants.length} / {room.capacity} Slots</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }}
                ></div>
              </div>

              {isFull ? (
                <div className="bg-yellow-50 text-yellow-800 p-5 rounded-xl text-sm font-semibold border border-yellow-200 mt-6 flex items-start">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-3 flex-shrink-0 animate-pulse"></div>
                  This room has reached maximum capacity. Clicking below will automatically enter you into the priority waitlist.
                </div>
              ) : (
                <div className="bg-green-50 text-green-800 p-5 rounded-xl text-sm font-semibold border border-green-200 mt-6 flex items-start">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0 animate-pulse"></div>
                  Instant booking is currently available. Your reservation will be confirmed immediately.
                </div>
              )}
            </div>

            {isFull ? (
              <Button
                onClick={handleBooking}
                disabled={bookingAction}
                loading={bookingAction}
                variant="secondary"
                className="w-full py-5 rounded-2xl text-lg mt-8 border-2"
              >
                Join Priority Waitlist
              </Button>
            ) : (
              <Button
                onClick={handleBooking}
                disabled={bookingAction}
                loading={bookingAction}
                variant="primary"
                className="w-full py-5 rounded-2xl text-lg mt-8 shadow-2xl"
              >
                Secure Booking Now
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
