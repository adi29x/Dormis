import { Link } from 'react-router-dom';
import { Users, Building } from 'lucide-react';

export default function RoomCard({ room }) {
  const isFull = room.status === 'Full';
  
  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 opacity-50 group-hover:bg-gray-100 transition-colors"></div>

      <div className="relative z-10 flex justify-between items-start mb-8">
        <div className="flex space-x-4">
          <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
            <Building size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{room.roomNumber}</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{room.type}</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
          room.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' :
          room.status === 'Full' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-yellow-50 text-yellow-700 border-yellow-200'
        }`}>
          {room.status}
        </span>
      </div>

      <div className="relative z-10 bg-gray-50 rounded-2xl p-5 mb-8 mt-auto border border-gray-100 border-dashed">
        <div className="flex items-center text-gray-600 font-medium">
          <Users size={18} className="mr-3 text-gray-400" />
          <span>Occupancy: <strong className="text-black">{room.occupants.length}</strong> / {room.capacity}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
          <div 
            className="bg-black h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }}
          ></div>
        </div>
      </div>

      <Link
        to={`/booking/${room._id}`}
        className={`relative z-10 w-full py-4 rounded-xl font-bold flex justify-center items-center transition-all ${
          isFull 
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer border border-gray-200' 
          : 'bg-black text-white hover:bg-gray-900 shadow-xl shadow-black/10 hover:shadow-black/20'
        }`}
      >
        {isFull ? 'Join Waitlist' : 'View Space'}
      </Link>
    </div>
  );
}
