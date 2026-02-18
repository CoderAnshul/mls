import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Printer, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  MoreVertical,
  ExternalLink,
  CreditCard,
  Truck
} from 'lucide-react';
import { ordersData } from '../../data/mockData';

const OrdersView = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Orders Ledger</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Transaction history and fulfillment logistics</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
             <Search size={14} className="text-admin-muted" />
             <input type="text" placeholder="Order ID or Name..." className="bg-transparent border-none outline-none text-[13px] w-40 font-bold" />
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
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th className="w-8"><input type="checkbox" className="rounded" /></th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date / Time</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Total Amount</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {ordersData.map((order) => (
              <tr key={order.id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-2.5"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-2.5 font-mono text-[13px] font-black text-admin-accent">{order.id}</td>
                <td className="px-4 py-2.5 font-bold text-[14px] tracking-tight">{order.customer}</td>
                <td className="px-4 py-2.5 text-[13px] font-medium text-admin-muted">{new Date(order.date).toLocaleString()}</td>
                <td className="px-4 py-2.5">
                   <div className="flex items-center gap-1.5 text-[12px] font-black uppercase text-emerald-400">
                      <CreditCard size={10} /> Paid
                   </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-black uppercase tracking-widest shadow-sm ${
                    order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                    order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                    order.status === 'Canceled' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-emerald-400' :
                      order.status === 'Pending' ? 'bg-amber-400' :
                      'bg-blue-400'
                    }`} />
                    {order.status}
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono font-bold text-[14px]">£{order.amount.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg border border-admin-border hover:bg-admin-accent hover:text-white transition-all">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Order Detail Slider */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-admin-card border-l border-admin-border h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
              <div className="p-6 border-b border-admin-border flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg bg-admin-bg hover:bg-admin-border transition-colors">
                     <ChevronRight size={18} className="rotate-180" />
                   </button>
                   <div>
                     <h2 className="text-lg font-black uppercase tracking-tighter">Order {selectedOrder.id} Details</h2>
                     <p className="text-[12px] font-black text-admin-muted uppercase tracking-widest">Transaction Verified via Stripe</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button className="flex items-center gap-2 bg-admin-bg border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all">
                     <Printer size={14} /> Print Invoice
                   </button>
                   <button className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
                     Update Status
                   </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-admin-bg/50 border border-admin-border p-5 rounded-2xl relative overflow-hidden">
                       <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest mb-4">Customer Intelligence</h4>
                       <p className="text-sm font-black">{selectedOrder.customer}</p>
                       <p className="text-[13px] text-admin-accent font-bold mt-1">{selectedOrder.email}</p>
                       <p className="text-[13px] text-admin-muted mt-3 leading-relaxed">241 High St, London E1 6PQ, UK<br/>Ph: +44 20 7946 0958</p>
                    </div>
                    <div className="bg-admin-bg/50 border border-admin-border p-5 rounded-2xl">
                       <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest mb-4">Logistics State</h4>
                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-admin-muted">Shipping Zone</span>
                            <span className="text-[13px] font-black">Region 1 (UK Wide)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-admin-muted">Carrier</span>
                            <span className="text-[13px] font-black flex items-center gap-1.5"><Truck size={10} /> DHL EXPRESS</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-admin-muted">TX ID</span>
                            <span className="text-[13px] font-mono font-bold text-admin-accent">STR-PX-99201LK</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-admin-bg/50 border border-admin-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-admin-border bg-admin-card/50">
                       <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest">Ordered Manifest</h4>
                    </div>
                    <div className="p-5 space-y-4">
                       {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-admin-card border border-admin-border flex items-center justify-center font-bold text-[13px] text-admin-muted">IMG</div>
                                <div>
                                   <p className="text-[14px] font-bold">{item.name}</p>
                                   <p className="text-[12px] text-admin-muted font-bold">Qty: {item.qty} • Size: M</p>
                                </div>
                             </div>
                             <p className="text-[14px] font-bold font-mono">£{item.price.toFixed(2)}</p>
                          </div>
                       ))}
                    </div>
                    <div className="p-5 bg-admin-card/50 border-t border-admin-border space-y-2">
                       <div className="flex justify-between text-[13px] font-bold text-admin-muted">
                          <span>Subtotal</span>
                          <span>£{selectedOrder.amount.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-[13px] font-bold text-admin-muted">
                          <span>Shipping</span>
                          <span>£0.00</span>
                       </div>
                       <div className="flex justify-between text-sm font-black pt-2 border-t border-admin-border/50 text-white">
                          <span>Grand Total</span>
                          <span>£{selectedOrder.amount.toFixed(2)}</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                       <p className="text-[13px] font-black text-emerald-400 uppercase tracking-widest">Transaction successful</p>
                       <p className="text-[12px] text-admin-muted mt-0.5">Payment processed via Stripe on 13 Feb 2026</p>
                    </div>
                    <ExternalLink size={14} className="text-emerald-400" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
