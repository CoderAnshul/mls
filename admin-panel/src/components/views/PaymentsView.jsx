import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Map order paymentMethod -> display label
const methodLabel = {
  'credit-card': 'Credit / Debit Card',
  'paypal': 'PayPal',
  'cod': 'Cash on Delivery',
  'clearpay': 'Clearpay',
  'klarna': 'Klarna',
};

// Map paymentStatus -> tx status
const statusMap = {
  paid: 'Success',
  unpaid: 'Pending',
  refunded: 'Refunded',
};

// Map order status 'cancelled' -> Failed for COD unpaid cancelled orders
const deriveStatus = (order) => {
  if (order.status === 'cancelled' && order.paymentStatus === 'unpaid') return 'Failed';
  return statusMap[order.paymentStatus] || 'Pending';
};

const PaymentsView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [syncing, setSyncing] = useState(false);

  const fetchOrders = async () => {
    try {
      setSyncing(true);
      const res = await fetch(`${API_BASE}/api/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Derive transactions from orders
  const transactions = orders.map((order) => ({
    id: order.orderNumber || order._id?.slice(-8).toUpperCase(),
    customer: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Guest',
    method: methodLabel[order.paymentMethod] || order.paymentMethod,
    amount: order.totalAmount,
    status: deriveStatus(order),
    date: order.createdAt,
    orderId: order._id,
  }));

  // Filter
  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.id?.toLowerCase().includes(search.toLowerCase()) ||
      tx.customer?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || tx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const successful = transactions.filter((t) => t.status === 'Success').reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter((t) => t.status === 'Pending').reduce((s, t) => s + t.amount, 0);
  const failedRefunded = transactions.filter((t) => t.status === 'Failed' || t.status === 'Refunded').reduce((s, t) => s + t.amount, 0);
  const gatewayHealth = transactions.length === 0 ? 100 : Math.round((transactions.filter(t => t.status === 'Success').length / transactions.length) * 100);

  const statuses = ['All', 'Success', 'Pending', 'Failed', 'Refunded'];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Payment Hub</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">
            Live transaction logs derived from orders
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
            <Search size={14} className="text-admin-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or Customer..."
              className="bg-transparent border-none outline-none text-[13px] w-44 font-bold"
            />
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-admin-card border border-admin-border px-2 py-1.5 rounded-lg">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === s ? 'bg-admin-accent text-white' : 'text-admin-muted hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={fetchOrders}
            disabled={syncing}
            className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20 disabled:opacity-60 transition-all"
          >
            {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Sync
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: 'Successful', value: `£${successful.toFixed(2)}`, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Pending', value: `£${pending.toFixed(2)}`, icon: Clock, color: 'text-amber-400' },
          { label: 'Failed / Refunded', value: `£${failedRefunded.toFixed(2)}`, icon: XCircle, color: 'text-rose-400' },
          { label: 'Gateway Health', value: `${gatewayHealth}%`, icon: ShieldCheck, color: 'text-admin-accent' },
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

      {/* Table */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-admin-muted">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-[13px] font-black uppercase tracking-widest">Loading Transactions...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-3 py-16 text-rose-400">
            <AlertCircle size={18} />
            <span className="text-[13px] font-black uppercase tracking-widest">{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-admin-muted text-[13px] font-black uppercase tracking-widest">
            No transactions found
          </div>
        ) : (
          <table className="w-full text-left density-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Method / Gateway</th>
                <th>Date / Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map((tx) => (
                <tr key={tx.orderId} className="group hover:bg-admin-bg transition-colors">
                  <td className="px-4 py-3 font-mono text-[13px] font-black text-admin-accent">{tx.id}</td>
                  <td className="px-4 py-3 font-bold text-[14px] uppercase tracking-tight">{tx.customer}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-admin-muted">
                      <CreditCard size={12} /> {tx.method}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-admin-muted">
                    {tx.date ? new Date(tx.date).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[14px]">£{tx.amount?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] font-black uppercase tracking-widest ${
                        tx.status === 'Success'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : tx.status === 'Failed'
                          ? 'bg-rose-500/10 text-rose-400'
                          : tx.status === 'Refunded'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {tx.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => window.open(`/orders`, '_self')}
                      className="text-admin-muted hover:text-white transition-colors"
                      title="View Order"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && !error && (
        <p className="text-[11px] text-admin-muted font-bold uppercase tracking-widest text-right">
          Showing {filtered.length} of {transactions.length} transactions
        </p>
      )}
    </div>
  );
};

export default PaymentsView;
