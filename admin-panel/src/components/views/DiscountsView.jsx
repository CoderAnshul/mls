import React from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Hash
} from 'lucide-react';
import { couponsData } from '../../data/mockData';

const DiscountsView = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Campaign Console</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Manage promotional coupons and conversion incentives</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
             <Plus size={14} /> Create Coupon
           </button>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Type / Value</th>
              <th>Expiry Registry</th>
              <th>Usage Stats</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {couponsData.map((cp) => (
              <tr key={cp.id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                      <div className="p-1 px-2 bg-admin-accent/10 border border-admin-accent/20 rounded font-mono text-[14px] font-black text-admin-accent tracking-widest">
                         {cp.code}
                      </div>
                   </div>
                </td>
                <td className="px-4 py-3 font-bold text-[13px] uppercase tracking-widest text-white">
                   {cp.type} ({cp.value}{cp.type === 'Percentage' ? '%' : '£'})
                </td>
                <td className="px-4 py-3 text-[13px] font-bold text-admin-muted uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><Calendar size={10} /> {cp.expiry}</div>
                </td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-1.5 text-[13px] font-black uppercase text-admin-muted">
                      <Hash size={10} className="text-blue-400" /> {cp.usage} / {cp.limit}
                   </div>
                </td>
                <td className="px-4 py-3">
                   <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[12px] font-black uppercase tracking-widest">
                      {cp.status}
                   </div>
                </td>
                <td className="px-4 py-3 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg border border-admin-border hover:bg-admin-bg"><Trash2 size={14} className="text-admin-muted hover:text-rose-400" /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountsView;
