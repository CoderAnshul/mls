import React from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Globe
} from 'lucide-react';
import { shippingData } from '../../data/mockData';

const ShippingView = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Global Logistics</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Monitor fulfillment zones, carriers, and real-time tracking</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
             <Globe size={14} className="text-admin-muted" />
             <span className="text-[13px] font-bold uppercase tracking-widest">Zone Config</span>
           </div>
           <button className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
             <Plus size={14} /> New Manifest
           </button>
        </div>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th>Manifest ID</th>
              <th>Order Ref</th>
              <th>Zone / Destination</th>
              <th>Carrier / Tracking</th>
              <th>Shipping Rate</th>
              <th>Logistics Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {shippingData.map((sh) => (
              <tr key={sh.id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-3 font-mono text-[13px] font-black text-admin-accent">{sh.id}</td>
                <td className="px-4 py-3 font-bold text-[14px] uppercase tracking-tight">{sh.orderId}</td>
                <td className="px-4 py-3 px-4 py-3">
                   <div className="flex items-center gap-1.5 text-[13px] font-bold text-admin-muted uppercase tracking-widest">
                      <MapPin size={10} /> {sh.zone}
                   </div>
                </td>
                <td className="px-4 py-3">
                   <div className="flex flex-col">
                      <span className="text-[13px] font-black uppercase tracking-widest text-white">{sh.carrier}</span>
                      <span className="text-[12px] font-mono font-bold text-admin-muted">{sh.tracking}</span>
                   </div>
                </td>
                <td className="px-4 py-3 font-bold text-[13px] tracking-widest uppercase text-admin-muted">{sh.rate}</td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-black uppercase tracking-widest ${
                    sh.status === 'In Transit' ? 'bg-blue-500/10 text-blue-400' :
                    sh.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {sh.status}
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

export default ShippingView;
