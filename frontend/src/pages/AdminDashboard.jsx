import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShieldAlert, Users, Building, AlertTriangle, Trash2, ArrowRightCircle, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SectionWrapper from '../components/ui/SectionWrapper';

const COLORS = ['#000000', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Room Creation State
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Single', capacity: 1 });
  const [bulkRoom, setBulkRoom] = useState({ blockPrefix: 'A', startFloor: 1, endFloor: 3, roomsPerFloor: 5, type: 'Single', capacity: 1 });
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(res.data.data);
      } else if (activeTab === 'rooms') {
        const res = await axios.get('http://localhost:5000/api/rooms');
        setRooms(res.data.data);
      } else if (activeTab === 'bookings') {
        const res = await axios.get('http://localhost:5000/api/bookings');
        setBookings(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSystem = async () => {
    const confirm = window.confirm("EMERGENCY RESET: This will delete all bookings, waitlists, and reset room occupancies. Are you absolutely sure?");
    if (!confirm) return;
    setActionLoading(true);
    try {
      await axios.delete('http://localhost:5000/api/admin/reset');
      toast.success('System has been completely reset.');
      fetchData();
    } catch (err) {
      toast.error('Failed to reset system');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    const confirm = window.confirm("PITCH MODE: This will wipe the database and pre-fill realistic demo data for presentation purposes. Proceed?");
    if (!confirm) return;
    setActionLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/seed-demo');
      toast.success('System securely seeded with pitch data!');
      fetchData();
    } catch (err) {
      toast.error('Failed to seed system');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await axios.post('http://localhost:5000/api/rooms', newRoom);
      toast.success('Room created successfully');
      setNewRoom({ roomNumber: '', type: 'Single', capacity: 1 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create room');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkCreateRooms = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/bulk-rooms', bulkRoom);
      toast.success(res.data.message || 'Bulk creation successful');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to bulk create rooms');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      toast.success('Room deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete room');
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceCancelBooking = async (id) => {
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      toast.success('Booking forcefully cancelled');
      fetchData();
    } catch (err) {
      toast.error('Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    if(!bookings || bookings.length === 0) return toast.error('No bookings to export.');
    
    const headers = ['Booking ID', 'User ID', 'Room ID', 'Room Number', 'Status', 'Booking Date'];
    const csvRows = bookings.map(b => [
      b._id,
      b.userId?._id || b.userId,
      b.roomId?._id || b.roomId,
      b.roomId?.roomNumber || 'Unknown',
      b.status,
      new Date(b.createdAt).toLocaleDateString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dormis_bookings_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Bookings exported successfully');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin System</h1>
              <p className="text-gray-500 font-medium">Manage properties, visualize analytics, and control bookings.</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
               onClick={handleSeedDemo} 
               disabled={actionLoading}
               variant="outline"
               className="py-3 px-6 rounded-xl border-2"
            >
              Seed Demo Data
            </Button>
            <Button 
               onClick={handleResetSystem} 
               disabled={actionLoading}
               variant="danger"
               className="py-3 px-6 rounded-xl"
            >
              Emergency Reset
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 flex space-x-2 overflow-x-auto">
          {['stats', 'rooms', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-black text-white shadow-md' 
                : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'stats' ? 'Overview' : tab === 'rooms' ? 'Management' : 'Archive'}
            </button>
          ))}
        </div>

        <SectionWrapper>
          <AnimatePresence mode="wait">
            {/* STATS TAB */}
            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {loading ? (
                  <p className="text-gray-500 text-center py-20 animate-pulse">Synchronizing metrics...</p>
                ) : stats && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Logic Rooms</p>
                          <p className="text-4xl font-black text-black">{stats.totalRooms}</p>
                        </div>
                        <Building className="w-10 h-10 text-gray-200" />
                      </div>
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Available Slots</p>
                          <p className="text-4xl font-black text-green-500">{stats.availableSlots}</p>
                        </div>
                        <Users className="w-10 h-10 text-gray-200" />
                      </div>
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmed Bookings</p>
                          <p className="text-4xl font-black text-black">{stats.totalBookings}</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                          <span className="font-bold text-gray-500 text-xs">BK</span>
                        </div>
                      </div>
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Global Occupancy</p>
                          <p className="text-4xl font-black text-black">{stats.occupancyPercentage}%</p>
                        </div>
                        <AlertTriangle className="w-10 h-10 text-yellow-500" />
                      </div>
                    </div>

                    {/* Chart Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[400px]">
                         <h3 className="text-lg font-bold text-gray-900 mb-6">Occupancy vs Capacity</h3>
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={stats.chartBar || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 700 }} dy={10} />
                             <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 700 }} />
                             <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                             <Bar dataKey="Capacity" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="Occupancy" fill="#000000" radius={[4, 4, 0, 0]} />
                           </BarChart>
                         </ResponsiveContainer>
                      </div>

                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[400px] flex flex-col justify-center">
                         <h3 className="text-lg font-bold text-gray-900 mb-2">Room Type Distribution</h3>
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={stats.chartPie || []} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                               {(stats.chartPie || []).map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                               ))}
                             </Pie>
                             <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                             <Legend iconType="circle" />
                           </PieChart>
                         </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ROOMS TAB */}
            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Bulk Create Form */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 opacity-50 pointer-events-none"></div>
                    <div className="relative z-10 w-14 h-14 bg-gray-50 text-black rounded-2xl flex items-center justify-center mb-6">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Bulk Generation Engine</h2>
                    <p className="text-gray-500 mb-8 max-w-sm">Automatically provision exact clones of block parameters sequentially into the master database.</p>
                    
                    <form onSubmit={handleBulkCreateRooms} className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Block Prefix</label>
                        <input required type="text" placeholder="e.g. A" value={bulkRoom.blockPrefix} onChange={e => setBulkRoom({...bulkRoom, blockPrefix: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-medium" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label>
                        <select value={bulkRoom.type} onChange={e => Object.assign(bulkRoom, {type: e.target.value, capacity: e.target.value === 'Single' ? 1 : e.target.value === 'Double' ? 2 : 3})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all font-bold">
                          <option value="Single">Single (1)</option><option value="Double">Double (2)</option><option value="Triple">Triple (3)</option>
                        </select>
                      </div>
                      <div className="col-span-1 border-t border-gray-100 pt-4 mt-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Floor</label>
                        <input required type="number" min="1" value={bulkRoom.startFloor} onChange={e => setBulkRoom({...bulkRoom, startFloor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all font-medium" />
                      </div>
                      <div className="col-span-1 border-t border-gray-100 pt-4 mt-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">End Floor</label>
                        <input required type="number" min="1" value={bulkRoom.endFloor} onChange={e => setBulkRoom({...bulkRoom, endFloor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all font-medium" />
                      </div>
                      <div className="col-span-2 border-t border-gray-100 pt-4 mt-2 mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rooms Per Floor Count</label>
                        <input required type="number" min="1" value={bulkRoom.roomsPerFloor} onChange={e => setBulkRoom({...bulkRoom, roomsPerFloor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all font-medium" />
                      </div>
                      <div className="col-span-2">
                        <Button loading={actionLoading} type="submit" variant="primary" className="w-full py-4 rounded-xl">Execute Bulk Generation</Button>
                      </div>
                    </form>
                  </div>

                  {/* Room List Table */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[700px] overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h2 className="text-xl font-bold text-gray-900">Active Directory</h2>
                      <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">{rooms.length} Units</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-0">
                      {loading ? <p className="text-center py-10 text-gray-400">Loading...</p> : (
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identifier</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-50">
                            {rooms.map(room => (
                              <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{room.roomNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {room.type} <span className="text-gray-300 ml-1">({room.capacity})</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${room.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : room.status === 'Full' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                    {room.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <button onClick={() => handleDeleteRoom(room._id)} disabled={actionLoading} className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Master Booking Ledger</h2>
                    <Button onClick={handleExportCSV} variant="primary" className="px-6 py-2 rounded-lg text-sm">
                      <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Reference</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room Matrix</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Override</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-50">
                        {loading ? <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium">Loading ledger...</td></tr> : bookings.length === 0 ? <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-medium">Record empty.</td></tr> : bookings.map(booking => (
                          <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{booking._id.substring(0, 10)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm font-bold text-gray-900">
                                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500 font-bold uppercase">{String(booking.userId?._id || '?').charAt(0)}</span>
                                {booking.userId?.name || booking.userId || 'Guest Instance'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 border-l border-gray-50 bg-gray-50/30">
                              {booking.roomId?.roomNumber || 'Data Missing'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button 
                                onClick={() => handleForceCancelBooking(booking._id)} 
                                disabled={actionLoading}
                                variant="outline"
                                className="!py-1.5 !px-3 !text-xs !text-red-600 !border-red-100 hover:!bg-red-50 hover:!border-red-200"
                              >
                                Force Detach
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionWrapper>
      </div>
    </div>
  );
}
