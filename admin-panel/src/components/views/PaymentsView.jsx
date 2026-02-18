import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { paymentsData } from '../../data/mockData';

const PaymentsView = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Payment Hub</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Consolidated transaction logs and gateway diagnostics</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
             <Search size={14} className="text-admin-muted" />
             <input type="text" placeholder="Transaction ID..." className="bg-transparent border-none outline-none text-[13px] w-40 font-bold" />
           </div>
           <button className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all">
             <Filter size={14} /> Filter
           </button>
           <button className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
             <RefreshCw size={14} /> Sync Logs
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         {[
           { label: 'Successful', value: '£8,420.00', icon: CheckCircle2, color: 'text-emerald-400' },
           { label: 'Pending', value: '£1,240.00', icon: Clock, color: 'text-amber-400' },
           { label: 'Failed/Refunded', value: '£312.00', icon: XCircle, color: 'text-rose-400' },
           { label: 'Gateway Health', value: '100%', icon: ShieldCheck, color: 'text-admin-accent' },
         ].map((stat, i) => (
            <div key={i} className="bg-admin-card border border-admin-border p-4 rounded-xl flex items-center justify-between">
               <div>
                  <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className="text-sm font-black tracking-tight">{stat.value}</h4>
               </div>
               <stat.icon size={20} className={stat.color} />
            </div>
         ))}
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th>TX ID</th>
              <th>Customer Intelligence</th>
              <th>Method / Gateway</th>
              <th>Date / Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {paymentsData.map((tx) => (
              <tr key={tx.id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-3 font-mono text-[13px] font-black text-admin-accent">{tx.id}</td>
                <td className="px-4 py-3 font-bold text-[14px] uppercase tracking-tight">{tx.customer}</td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-admin-muted">
                      <CreditCard size={12} /> {tx.method}
                   </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-medium text-admin-muted">{new Date(tx.date).toLocaleString()}</td>
                <td className="px-4 py-3 font-mono font-bold text-[14px]">£{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-black uppercase tracking-widest ${
                    tx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' :
                    tx.status === 'Failed' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {tx.status}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                   <button className="text-admin-muted hover:text-white transition-colors"><ExternalLink size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsView;
