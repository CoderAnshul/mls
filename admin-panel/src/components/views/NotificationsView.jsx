import React from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingBag, 
  UserPlus, 
  Clock,
  MoreVertical
} from 'lucide-react';

const NotificationsView = () => {
  const alerts = [
    { id: 1, type: 'Order', message: 'New order #1286 received from Aisha Omar', time: '2 mins ago', priority: 'High', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 2, type: 'Stock', message: 'Low stock warning: Jouri Abaya (XL) - only 3 units left', time: '15 mins ago', priority: 'Critical', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 3, type: 'System', message: 'Daily backup successful. Storage at 42%', time: '1 hour ago', priority: 'Low', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 4, type: 'User', message: 'New customer registration: Mariam Khan', time: '3 hours ago', priority: 'Medium', icon: UserPlus, color: 'text-admin-accent', bg: 'bg-admin-accent/10' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">System Notifications</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Real-time system alerts and activity logs</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all text-rose-400">
             <Trash2 size={14} /> Clear All
           </button>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Time</th>
              <th>Priority</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {alerts.map((alert) => (
              <tr key={alert.id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-admin-muted">
                      <div className={`p-1.5 rounded-lg ${alert.bg} ${alert.color}`}><alert.icon size={14} /></div>
                      {alert.type}
                   </div>
                </td>
                <td className="px-4 py-3 font-bold text-[14px] tracking-tight text-white">{alert.message}</td>
                <td className="px-4 py-3 text-[13px] font-bold text-admin-muted uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><Clock size={10} /> {alert.time}</div>
                </td>
                <td className="px-4 py-3">
                   <div className={`inline-flex px-2 py-0.5 rounded-md text-[12px] font-black uppercase tracking-widest ${
                      alert.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400' :
                      alert.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-blue-500/10 text-blue-400'
                   }`}>
                      {alert.priority}
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
  );
};

export default NotificationsView;
