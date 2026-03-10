import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  MessageSquare,
  History,
  AlertCircle,
  MoreVertical,
  Download
} from 'lucide-react';
import { api } from '../../utils/api';

const CustomersView = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (keyword = '') => {
    setLoading(true);
    try {
      const data = await api.users.getAll(keyword);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Simple debounce/onEnter logic can be added, but for now just immediate
    const timeoutId = setTimeout(() => {
      fetchCustomers(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Customer Directory</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Manage global customer relationships and history</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
             <Search size={14} className="text-admin-muted" />
             <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="bg-transparent border-none outline-none text-[13px] w-48 font-bold" 
                value={searchQuery}
                onChange={handleSearch}
             />
           </div>
           <button className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all">
             <Filter size={14} /> Filter
           </button>
           <button className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all">
             <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-admin-muted font-bold uppercase tracking-widest">Scanning Neural Records...</div>
        ) : (
          <table className="w-full text-left density-table">
            <thead>
              <tr>
                <th className="w-8"><input type="checkbox" className="rounded" /></th>
                <th>Customer Intelligence</th>
                <th>Location</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Account Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {customers.map((user) => (
                <tr key={user._id} className="group hover:bg-admin-bg transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-4 py-2.5"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-admin-accent/20 flex items-center justify-center font-bold text-[13px] text-admin-accent border border-admin-accent/20 uppercase tracking-tighter">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[14px] tracking-tight">{user.name}</span>
                        <span className="text-[12px] text-admin-muted font-medium uppercase tracking-tight">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-admin-muted uppercase tracking-widest">
                        <MapPin size={10} /> {user.location || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 text-[13px] font-black uppercase">
                      <ShoppingBag size={10} className="text-blue-400" /> {user.ordersCount || 0}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono font-bold text-[14px] text-emerald-400">£{(user.totalSpent || 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <div className={`inline-flex px-2 py-0.5 rounded-md ${user.isAdmin ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'} text-[12px] font-black uppercase tracking-widest`}>
                      {user.isAdmin ? 'Admin' : 'Active'}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-admin-accent hover:underline text-[13px] uppercase tracking-widest">
                    View Profile
                  </td>
                </tr>
              ))}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-admin-muted font-bold uppercase tracking-widest">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Customer Profile View */}
      {selectedUser && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}>
           <div
             className="w-full max-w-4xl bg-admin-card border border-admin-border rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="p-8 border-b border-admin-border flex items-center justify-between bg-gradient-to-r from-admin-accent/10 to-transparent">
                <div className="flex items-center gap-4">
                   <button onClick={() => setSelectedUser(null)} className="p-3 rounded-2xl bg-admin-bg hover:bg-admin-border transition-all border border-admin-border">
                     <X size={20} className="text-admin-muted" />
                   </button>
                   <div>
                     <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedUser.name}</h2>
                     <p className="text-[11px] font-black text-admin-muted uppercase tracking-[0.2em]">Member Portfolio Since {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-admin-bg hover:bg-admin-border border border-admin-border px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all">
                     Security Options
                  </button>
                  <button className="flex items-center gap-2 bg-admin-accent text-white px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-admin-accent/20 transition-all active:scale-95">
                     Update Access
                  </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                <div className="flex items-center gap-8 bg-admin-bg/40 p-10 rounded-[2.5rem] border border-admin-border relative overflow-hidden shadow-inner">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-admin-accent/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
                   <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-tr from-admin-accent to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div className="flex-1">
                      <h3 className="text-3xl font-black tracking-tighter mb-1">{selectedUser.name}</h3>
                      <p className="text-admin-accent font-black text-[14px] uppercase tracking-[0.3em] mb-4">{selectedUser.isAdmin ? 'System Administrator' : 'Verified Member'}</p>
                      <div className="flex gap-6">
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-admin-muted uppercase tracking-widest">Global Location</span>
                            <span className="flex items-center gap-1.5 text-[15px] font-black text-white uppercase"><MapPin size={14} className="text-admin-accent" /> {selectedUser.location || 'Unknown Origin'}</span>
                         </div>
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-admin-muted uppercase tracking-widest">Interaction Pulse</span>
                            <span className="flex items-center gap-1.5 text-[15px] font-black text-blue-400 uppercase"><ShoppingBag size={14} /> {selectedUser.ordersCount || 0} Orders</span>
                         </div>
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-admin-muted uppercase tracking-widest">Total Value Contribution</span>
                            <span className="flex items-center gap-1.5 text-[18px] font-black text-emerald-400 font-mono">£{(selectedUser.totalSpent || 0).toFixed(2)}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="bg-admin-bg/50 border border-admin-border p-8 rounded-[2.5rem] space-y-6 shadow-inner">
                      <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                        <MessageSquare size={16} className="text-admin-accent" /> Staff Security Notes
                      </h4>
                      <div className="space-y-4">
                         <div className="p-5 bg-admin-card border border-admin-border rounded-2xl relative shadow-sm">
                            <p className="text-[14px] leading-relaxed text-white/80 italic font-medium">"Identity verified. Profile initialized in core database."</p>
                            <span className="block mt-3 text-[9px] font-black uppercase text-admin-muted">— System, Just Now</span>
                         </div>
                         <button className="w-full py-4 rounded-xl border border-dashed border-admin-border text-[12px] font-black uppercase text-admin-muted hover:text-white transition-all hover:bg-admin-border/10">
                           + Document New Incident
                         </button>
                      </div>
                   </div>
                   <div className="bg-admin-bg/50 border border-admin-border p-8 rounded-[2.5rem] space-y-6 shadow-inner">
                      <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                        <History size={16} className="text-admin-accent" /> Engagement Timeline
                      </h4>
                      <div className="space-y-4">
                         {[
                           { label: 'Access Control Created', time: new Date(selectedUser.createdAt).toLocaleDateString(), color: 'text-blue-400' },
                         ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-admin-card/40 p-4 rounded-xl border border-admin-border/50">
                               <p className="text-[13px] font-black uppercase tracking-tight">{item.label}</p>
                               <p className="text-[10px] font-mono text-admin-muted font-black">{item.time}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="bg-admin-bg/50 border border-admin-border rounded-[2.5rem] overflow-hidden shadow-inner">
                   <div className="px-8 py-4 border-b border-admin-border bg-admin-card/50 flex justify-between items-center">
                      <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-[0.3em]">Comprehensive Transaction History</h4>
                      <span className="px-3 py-1 bg-admin-bg rounded-lg text-[10px] font-black text-admin-muted uppercase tracking-widest border border-admin-border">Live Database Link</span>
                   </div>
                   <div className="p-0">
                      <div className="p-16 text-center text-[13px] font-black text-admin-muted uppercase tracking-[0.2em] opacity-40">
                        Zero transaction signatures found for this profile.
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomersView;
