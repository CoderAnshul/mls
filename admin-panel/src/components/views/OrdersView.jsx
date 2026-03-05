import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  ExternalLink,
  CreditCard,
  Truck,
  Package,
  X,
  Send,
  MapPin,
  Hash,
  Link,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

/* ─── Dispatch Modal ─────────────────────────────────────────────────────────── */
const DispatchModal = ({ order, onClose, onDispatched }) => {
  const toast = useToast();
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    partnerId: '',
    trackingNumber: '',
    trackingUrl: '',
    notes: ''
  });

  // Pre-fill tracking URL from selected partner
  const selectedPartner = partners.find(p => p._id === form.partnerId);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.deliveryPartners.getAll();
        const active = Array.isArray(data) ? data.filter(p => p.isActive) : [];
        setPartners(active);
        if (active.length > 0) {
          setForm(prev => ({
            ...prev,
            partnerId: active[0]._id,
            trackingUrl: active[0].trackingUrl || ''
          }));
        }
      } catch (err) {
        toast.error('Failed to load delivery partners');
      } finally {
        setLoadingPartners(false);
      }
    };
    fetchPartners();
  }, []);

  const handlePartnerChange = (e) => {
    const pid = e.target.value;
    const partner = partners.find(p => p._id === pid);
    setForm(prev => ({
      ...prev,
      partnerId: pid,
      trackingUrl: partner?.trackingUrl || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.trackingNumber.trim()) {
      toast.error('Tracking number is required');
      return;
    }
    try {
      setIsSubmitting(true);
      const partner = partners.find(p => p._id === form.partnerId);

      // Build the final tracking URL: replace {tracking} placeholder if present
      let finalTrackingUrl = form.trackingUrl;
      if (finalTrackingUrl && form.trackingNumber) {
        finalTrackingUrl = finalTrackingUrl.replace('{tracking}', form.trackingNumber.trim());
      }

      await api.orders.dispatch(order._id, {
        partnerId: form.partnerId || null,
        partnerName: partner?.name || '',
        partnerCode: partner?.code || '',
        trackingNumber: form.trackingNumber.trim(),
        trackingUrl: finalTrackingUrl,
        notes: form.notes.trim()
      });

      toast.success(`Order ${order.orderNumber} dispatched via ${partner?.name || 'carrier'}!`);
      onDispatched();
      onClose();
    } catch (err) {
      toast.error('Failed to dispatch order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-admin-card border border-admin-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border bg-gradient-to-r from-blue-500/10 to-admin-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Send size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-[15px] font-black uppercase tracking-tight">Dispatch Order</h3>
              <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest mt-0.5">
                {order.orderNumber} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-admin-border transition-colors text-admin-muted hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Customer Summary */}
        <div className="px-6 py-3 bg-admin-bg/40 border-b border-admin-border flex items-center gap-3">
          <MapPin size={13} className="text-admin-muted shrink-0" />
          <p className="text-[13px] font-bold text-admin-muted">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName} &mdash;{' '}
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postcode}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Delivery Partner */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-1.5">
              <Truck size={11} /> Delivery Partner
            </label>
            {loadingPartners ? (
              <div className="h-9 bg-admin-bg rounded-lg border border-admin-border animate-pulse" />
            ) : partners.length === 0 ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[13px] font-bold">
                <AlertCircle size={14} />
                No active delivery partners. Add one first.
              </div>
            ) : (
              <select
                value={form.partnerId}
                onChange={handlePartnerChange}
                className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[13px] font-bold outline-none focus:ring-1 focus:ring-blue-400 transition-all"
              >
                {partners.map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.code})</option>
                ))}
              </select>
            )}
          </div>

          {/* Tracking Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-1.5">
              <Hash size={11} /> Tracking Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={form.trackingNumber}
              onChange={(e) => setForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
              placeholder="e.g. JD123456789GB"
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[13px] font-mono font-bold outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-admin-muted/50 placeholder:font-sans transition-all"
              required
            />
          </div>

          {/* Tracking URL */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-1.5">
              <Link size={11} /> Tracking URL
              <span className="text-[10px] normal-case text-admin-muted/60 font-bold">(optional — auto-filled from partner)</span>
            </label>
            <input
              type="text"
              value={form.trackingUrl}
              onChange={(e) => setForm(prev => ({ ...prev, trackingUrl: e.target.value }))}
              placeholder="https://track.example.com/{tracking}"
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[13px] font-bold outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-admin-muted/50 transition-all"
            />
            {form.trackingUrl && form.trackingNumber && (
              <p className="text-[11px] font-bold text-blue-400 truncate">
                → {form.trackingUrl.replace('{tracking}', form.trackingNumber)}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-1.5">
              <FileText size={11} /> Internal Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special instructions for this dispatch..."
              rows={2}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[13px] font-bold outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-admin-muted/50 resize-none transition-all"
            />
          </div>

          {/* Info pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/15 text-[12px] font-bold text-blue-400">
            <Package size={12} />
            Dispatching will automatically set order status to <strong className="font-black">Shipped</strong>.
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-admin-border text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingPartners || partners.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-[13px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Confirm Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Orders View ───────────────────────────────────────────────────────── */
const OrdersView = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState(null); // order to dispatch

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status, paymentStatus) => {
    try {
      setIsUpdating(true);
      await api.orders.updateStatus(id, { status, paymentStatus });
      toast.success('Order updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, status: status || prev.status, paymentStatus: paymentStatus || prev.paymentStatus }));
      }
    } catch (err) {
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDispatchSuccess = () => {
    fetchOrders();
    // Refresh the detail panel if the dispatched order is currently open
    if (selectedOrder && dispatchTarget && selectedOrder._id === dispatchTarget._id) {
      setSelectedOrder(prev => ({ ...prev, status: 'shipped' }));
    }
  };

  const statusColor = (status) => {
    if (status === 'delivered') return 'bg-emerald-500/10 text-emerald-400';
    if (status === 'pending')   return 'bg-amber-500/10 text-amber-400';
    if (status === 'cancelled') return 'bg-rose-500/10 text-rose-400';
    if (status === 'shipped')   return 'bg-blue-500/10 text-blue-400';
    return 'bg-violet-500/10 text-violet-400'; // processing
  };

  const dotColor = (status) => {
    if (status === 'delivered') return 'bg-emerald-400';
    if (status === 'pending')   return 'bg-amber-400';
    if (status === 'cancelled') return 'bg-rose-400';
    if (status === 'shipped')   return 'bg-blue-400';
    return 'bg-violet-400';
  };

  const isDispatched = (order) => !!order.dispatchInfo?.trackingNumber;

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
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-admin-muted font-bold uppercase tracking-widest">
                  Loading Transactions...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-admin-muted font-bold uppercase tracking-widest">
                  No orders found
                </td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order._id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-2.5"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-2.5 font-mono text-[13px] font-black text-admin-accent">{order.orderNumber}</td>
                <td className="px-4 py-2.5 font-bold text-[14px] tracking-tight">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </td>
                <td className="px-4 py-2.5 text-[13px] font-medium text-admin-muted">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2.5">
                   <div className={`flex items-center gap-1.5 text-[12px] font-black uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      <CreditCard size={10} /> {order.paymentStatus}
                   </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-black uppercase tracking-widest shadow-sm ${statusColor(order.status)}`}>
                    <div className={`w-1 h-1 rounded-full ${dotColor(order.status)}`} />
                    {order.status}
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono font-bold text-[14px]">£{order.totalAmount?.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Dispatch button — show when order is not yet shipped/delivered/cancelled */}
                    {!['shipped', 'delivered', 'cancelled'].includes(order.status) && (
                      <button
                        onClick={() => setDispatchTarget(order)}
                        title="Dispatch Order"
                        className="p-1.5 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                      >
                        <Truck size={14} />
                      </button>
                    )}
                    {/* Already dispatched badge */}
                    {isDispatched(order) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Dispatched
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg border border-admin-border hover:bg-admin-accent hover:text-white transition-all"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Expanded Order Detail Slider ────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-admin-card border-l border-admin-border h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
              <div className="p-6 border-b border-admin-border flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg bg-admin-bg hover:bg-admin-border transition-colors">
                     <ChevronRight size={18} className="rotate-180" />
                   </button>
                   <div>
                     <h2 className="text-lg font-black uppercase tracking-tighter">Order {selectedOrder.orderNumber} Details</h2>
                     <p className="text-[12px] font-black text-admin-muted uppercase tracking-widest">Transaction Verified via Database</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button className="flex items-center gap-2 bg-admin-bg border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all">
                     <Printer size={14} /> Print Invoice
                   </button>
                   {/* Dispatch from detail panel */}
                   {!['shipped', 'delivered', 'cancelled'].includes(selectedOrder.status) ? (
                     <button
                       onClick={() => setDispatchTarget(selectedOrder)}
                       className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                     >
                       <Truck size={14} /> Dispatch
                     </button>
                   ) : (
                     <button
                       disabled
                       className="flex items-center gap-2 bg-admin-bg border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed"
                     >
                       Update Status
                     </button>
                   )}
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-admin-bg/50 border border-admin-border p-5 rounded-2xl relative overflow-hidden">
                        <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest mb-4">Customer Intelligence</h4>
                        <p className="text-sm font-black">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                        <p className="text-[13px] text-admin-accent font-bold mt-1">{selectedOrder.shippingAddress.email}</p>
                        <p className="text-[13px] text-admin-muted mt-3 leading-relaxed">
                          {selectedOrder.shippingAddress.address}<br/>
                          {selectedOrder.shippingAddress.apartment && <>{selectedOrder.shippingAddress.apartment}<br/></>}
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postcode}<br/>
                          Ph: {selectedOrder.shippingAddress.phone}
                        </p>
                     </div>
                     <div className="bg-admin-bg/50 border border-admin-border p-5 rounded-2xl">
                        <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest mb-4">Logistics State</h4>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <span className="text-[13px] font-bold text-admin-muted">Shipping Country</span>
                             <span className="text-[13px] font-black">{selectedOrder.shippingAddress.country}</span>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-[13px] font-bold text-admin-muted">Payment Method</span>
                             <span className="text-[13px] font-black uppercase px-2 py-0.5 bg-admin-accent/10 text-admin-accent rounded text-[11px]">{selectedOrder.paymentMethod}</span>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-[13px] font-bold text-admin-muted">Payment Status</span>
                             <select 
                               value={selectedOrder.paymentStatus}
                               onChange={(e) => handleUpdateStatus(selectedOrder._id, null, e.target.value)}
                               disabled={isUpdating}
                               className="text-[13px] font-black bg-admin-bg border border-admin-border rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-admin-accent"
                             >
                               <option value="unpaid">Unpaid</option>
                               <option value="paid">Paid</option>
                               <option value="refunded">Refunded</option>
                             </select>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-[13px] font-bold text-admin-muted">Order Status</span>
                             <select 
                               value={selectedOrder.status}
                               onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value, null)}
                               disabled={isUpdating}
                               className="text-[13px] font-black bg-admin-bg border border-admin-border rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-admin-accent"
                             >
                               <option value="pending">Pending</option>
                               <option value="processing">Processing</option>
                               <option value="shipped">Shipped</option>
                               <option value="delivered">Delivered</option>
                               <option value="cancelled">Cancelled</option>
                             </select>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Dispatch Info Card — shown when already dispatched */}
                  {isDispatched(selectedOrder) && (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                      <h4 className="text-[12px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Truck size={13} /> Dispatch Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedOrder.dispatchInfo?.partnerName && (
                          <div>
                            <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest">Carrier</p>
                            <p className="text-[13px] font-black mt-0.5">
                              {selectedOrder.dispatchInfo.partnerName}
                              {selectedOrder.dispatchInfo.partnerCode && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-admin-bg border border-admin-border font-mono">
                                  {selectedOrder.dispatchInfo.partnerCode}
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                        {selectedOrder.dispatchInfo?.trackingNumber && (
                          <div>
                            <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest">Tracking #</p>
                            <p className="text-[13px] font-mono font-black mt-0.5">{selectedOrder.dispatchInfo.trackingNumber}</p>
                          </div>
                        )}
                        {selectedOrder.dispatchInfo?.dispatchedAt && (
                          <div>
                            <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest">Dispatched At</p>
                            <p className="text-[13px] font-bold mt-0.5">{new Date(selectedOrder.dispatchInfo.dispatchedAt).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedOrder.dispatchInfo?.trackingUrl && (
                          <div>
                            <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest">Track Link</p>
                            <a
                              href={selectedOrder.dispatchInfo.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[13px] font-bold text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              Open Tracking <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                      </div>
                      {selectedOrder.dispatchInfo?.notes && (
                        <div className="pt-2 border-t border-blue-500/15">
                          <p className="text-[11px] font-black text-admin-muted uppercase tracking-widest">Notes</p>
                          <p className="text-[13px] font-bold mt-0.5 text-admin-muted">{selectedOrder.dispatchInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-admin-bg/50 border border-admin-border rounded-2xl overflow-hidden">
                     <div className="px-5 py-3 border-b border-admin-border bg-admin-card/50">
                        <h4 className="text-[12px] font-black text-admin-muted uppercase tracking-widest">Ordered Manifest</h4>
                     </div>
                     <div className="p-5 space-y-4">
                        {selectedOrder.items.map((item, i) => (
                           <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 {item.image ? (
                                   <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-admin-border" />
                                 ) : (
                                   <div className="w-10 h-10 rounded-lg bg-admin-card border border-admin-border flex items-center justify-center font-bold text-[13px] text-admin-muted">IMG</div>
                                 )}
                                 <div>
                                    <p className="text-[14px] font-bold">{item.title}</p>
                                    <p className="text-[12px] text-admin-muted font-bold">
                                      Qty: {item.quantity} 
                                      {item.selectedSize && ` • Size: ${item.selectedSize}`}
                                      {item.selectedColor && ` • Color: ${item.selectedColor}`}
                                      {item.selectedLength && ` • Length: ${item.selectedLength}`}
                                    </p>
                                 </div>
                              </div>
                              <p className="text-[14px] font-bold font-mono">£{(item.price * item.quantity).toFixed(2)}</p>
                           </div>
                        ))}
                     </div>
                     <div className="p-5 bg-admin-card/50 border-t border-admin-border space-y-2">
                        <div className="flex justify-between text-[13px] font-bold text-admin-muted">
                           <span>Subtotal</span>
                           <span>£{selectedOrder.totalAmount?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[13px] font-bold text-admin-muted">
                           <span>Shipping</span>
                           <span>£0.00</span>
                        </div>
                        <div className="flex justify-between text-sm font-black pt-2 border-t border-admin-border/50 text-white">
                           <span>Grand Total</span>
                           <span>£{selectedOrder.totalAmount?.toFixed(2)}</span>
                        </div>
                     </div>
                  </div>

                  <div className={`p-5 rounded-2xl flex items-center justify-between border ${selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                     <div>
                        <p className={`text-[13px] font-black uppercase tracking-widest ${selectedOrder.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          Payment {selectedOrder.paymentStatus}
                        </p>
                        <p className="text-[12px] text-admin-muted mt-0.5">Method: {selectedOrder.paymentMethod?.toUpperCase()}</p>
                     </div>
                     {selectedOrder.paymentStatus === 'paid' && <ExternalLink size={14} className="text-emerald-400" />}
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* ── Dispatch Modal ────────────────────────────────────────────────── */}
      {dispatchTarget && (
        <DispatchModal
          order={dispatchTarget}
          onClose={() => setDispatchTarget(null)}
          onDispatched={handleDispatchSuccess}
        />
      )}
    </div>
  );
};

export default OrdersView;
