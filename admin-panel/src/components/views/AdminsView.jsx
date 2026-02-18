import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Plus, 
  MoreVertical, 
  Clock, 
  Mail, 
  Search, 
  Lock,
  Activity
} from 'lucide-react';
import { adminsData, activityLogs } from '../../data/mockData';

const AdminsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Identity Management</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Configure privileged access and role-based permissions (RBAC)</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
             <Plus size={14} /> Add Admin User
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-admin-muted flex items-center gap-2 px-1">
               <ShieldCheck size={16} /> Privileged Access Registry
            </h3>
            <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
               <table className="w-full text-left density-table">
                  <thead>
                     <tr>
                        <th>Operator</th>
                        <th>Role / Level</th>
                        <th>Last Activity</th>
                        <th className="text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border">
                     {adminsData.map((admin) => (
                        <tr key={admin.id} className="group hover:bg-admin-bg transition-colors">
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-admin-accent/20 flex items-center justify-center font-black text-[13px] text-admin-accent border border-admin-accent/20 italic">
                                    {admin.name[0]}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-bold text-[14px] tracking-tight text-white">{admin.name}</span>
                                    <span className="text-[12px] text-admin-muted font-mono tracking-tight">{admin.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-4 py-3 text-[13px] font-black uppercase tracking-widest">
                              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                                 admin.role === 'Super Admin' ? 'bg-admin-accent/10 text-admin-accent' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                 <Lock size={10} /> {admin.role}
                              </div>
                           </td>
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-[13px] font-bold text-admin-muted uppercase tracking-widest">
                                 <Clock size={10} /> {admin.lastLogin}
                              </div>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <MoreVertical size={14} className="text-admin-muted cursor-pointer hover:text-white ml-auto" />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-admin-muted flex items-center gap-2 px-1">
               <Activity size={16} /> Global Audit Trail
            </h3>
            <div className="bg-admin-card border border-admin-border rounded-xl p-4 space-y-4">
               {activityLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 relative pb-4 last:pb-0">
                     {/* Line connector */}
                     <div className="absolute left-1.5 top-3 bottom-0 w-0.5 bg-admin-border/50" />
                     <div className="w-3 h-3 rounded-full bg-admin-accent border border-admin-bg relative z-10 mt-0.5" />
                     <div>
                        <p className="text-[13px] font-bold text-white leading-tight">{log.action}</p>
                        <p className="text-[11px] font-black uppercase tracking-widest text-admin-muted mt-1">{log.user} • {log.time}</p>
                     </div>
                  </div>
               ))}
               <button className="w-full py-2 bg-admin-bg hover:bg-admin-border border border-admin-border rounded-lg text-[12px] font-black uppercase tracking-widest text-admin-muted transition-colors mt-2">
                  View Full Audit Ledger
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminsView;
