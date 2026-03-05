import React, { useState, useEffect } from 'react';
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
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Global relationship management and lifecycle metrics</p>
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
                    View Case
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

      {/* CRM Detail Panel */}
      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}>
           <div 
             className="w-full max-w-2xl bg-admin-card border-l border-admin-border h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="p-6 border-b border-admin-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <button onClick={() => setSelectedUser(null)} className="p-2 rounded-lg bg-admin-bg hover:bg-admin-border transition-colors">
                     <ChevronRight size={18} className="rotate-180" />
                   </button>
                   <div>
                     <h2 className="text-lg font-black uppercase tracking-tighter">{selectedUser.name} Profile</h2>
                     <p className="text-[12px] font-black text-admin-muted uppercase tracking-widest">Member Since {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <button className="flex items-center gap-2 bg-admin-accent text-white px-5 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
                   Account Options
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                <div className="flex items-center gap-6 bg-admin-bg/40 p-6 rounded-[2rem] border border-admin-border relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-admin-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                   <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-admin-accent to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div className="flex-1">
                      <h3 className="text-xl font-black tracking-tight">{selectedUser.name}</h3>
                      <p className="text-admin-accent font-bold text-[14px] uppercase tracking-widest">{selectedUser.isAdmin ? 'Admin Node' : 'Tier Member'}</p>
                      <div className="flex gap-4 mt-3">
                         <span className="flex items-center gap-1 text-[13px] font-bold text-admin-muted"><MapPin size={10} /> {selectedUser.location || 'Global'}</span>
                         <span className="flex items-center gap-1 text-[13px] font-bold text-admin-muted"><ShoppingBag size={10} /> {selectedUser.ordersCount || 0} Orders</span>
                         <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-400 font-mono">£{(selectedUser.totalSpent || 0).toFixed(2)}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-admin-bg/50 border border-admin-border p-5 rounded-2xl">
                      <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare size={14} /> Admin Notes
                      </h4>
                      <div className="space-y-3">
                         <div className="p-3 bg-admin-card border border-admin-border rounded-xl relative">
                            <p className="text-[13px] leading-relaxed text-admin-text/80 italic font-medium">"System metadata initialized for new profile entry."</p>
                            <span className="block mt-2 text-[8px] font-black uppercase text-admin-muted">— Internal, Just Now</span>
                         </div>
                         <button className="w-full py-2 rounded-lg border border-dashed border-admin-border text-[12px] font-black uppercase text-admin-muted hover:text-white transition-colors">
                           + Add Incident Note
                         </button>
                      </div>
                   </div>
                   <div className="bg-admin-bg/50 border border-admin-border p-5 rounded-2xl">
                      <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={14} /> Lifecycle History
                      </h4>
                      <div className="space-y-2.5">
                         {[
                           { label: 'Cloud Identity Created', time: new Date(selectedUser.createdAt).toLocaleDateString(), color: 'text-blue-400' },
                         ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-admin-border/50 pb-2">
                               <p className="text-[13px] font-bold truncate pr-4">{item.label}</p>
                               <p className="text-[8px] font-mono text-admin-muted whitespace-nowrap">{item.time}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="bg-admin-bg/50 border border-admin-border rounded-2xl overflow-hidden">
                   <div className="px-5 py-3 border-b border-admin-border bg-admin-card/50">
                      <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest">Complete Order Ledger</h4>
                   </div>
                   <div className="p-0">
                      <div className="p-8 text-center text-[12px] font-bold text-admin-muted uppercase tracking-widest">
                        Zero order data found for this node.
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomersView;
