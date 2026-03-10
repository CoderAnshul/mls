import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  History,
  Activity,
  Package,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/imageUrl';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const getPeriodRange = (period) => {
  const now = new Date();
  const start = new Date();
  if (period === 'Today') {
    start.setHours(0, 0, 0, 0);
  } else if (period === 'This Week') {
    const day = start.getDay(); // 0=Sun
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const buildRevenueChart = (orders, period, range) => {
  if (period === 'Today') {
    // Bucket by hour 0-23
    const buckets = Array.from({ length: 24 }, (_, i) => ({ name: `${i}h`, revenue: 0, orders: 0 }));
    orders.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      buckets[h].revenue += o.totalAmount || 0;
      buckets[h].orders += 1;
    });
    // Only show hours up to now
    const currentHour = new Date().getHours();
    return buckets.slice(0, currentHour + 1);
  } else if (period === 'This Week') {
    // Bucket by day of week (Mon–Sun in current week)
    const weekStart = range.start;
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return { name: DAY_LABELS[d.getDay()], revenue: 0, orders: 0 };
    });
    orders.forEach(o => {
      const d = new Date(o.createdAt);
      const diffDays = Math.floor((d - weekStart) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        buckets[diffDays].revenue += o.totalAmount || 0;
        buckets[diffDays].orders += 1;
      }
    });
    return buckets;
  } else {
    // This Month — bucket by date number
    const daysInMonth = new Date(range.end.getFullYear(), range.end.getMonth() + 1, 0).getDate();
    const buckets = Array.from({ length: daysInMonth }, (_, i) => ({ name: `${i + 1}`, revenue: 0, orders: 0 }));
    orders.forEach(o => {
      const day = new Date(o.createdAt).getDate() - 1;
      if (day >= 0 && day < daysInMonth) {
        buckets[day].revenue += o.totalAmount || 0;
        buckets[day].orders += 1;
      }
    });
    return buckets;
  }
};

/* ─── Skeleton Loader ──────────────────────────────────────────────────────── */
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-admin-border/60 rounded-lg ${className}`} />
);

/* ─── Main Component ───────────────────────────────────────────────────────── */
const DashboardView = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [period, setPeriod] = useState('This Month');
  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (showLoader = false) => {
    try {
      if (showLoader) setRefreshing(true);
      else setLoading(true);

      const [orders, products, users] = await Promise.all([
        api.orders.getAll(),
        api.products.getAll(),
        api.users.getAll()
      ]);

      setAllOrders(Array.isArray(orders) ? orders : []);
      setAllProducts(Array.isArray(products) ? products : []);
      setAllUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ─── Derived data filtered by period ─── */
  const range = useMemo(() => getPeriodRange(period), [period]);

  const periodOrders = useMemo(() =>
    allOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= range.start && d <= range.end;
    }), [allOrders, range]);

  const periodUsers = useMemo(() =>
    allUsers.filter(u => {
      const d = new Date(u.createdAt);
      return d >= range.start && d <= range.end;
    }), [allUsers, range]);

  // KPIs
  const totalSales = useMemo(() =>
    periodOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0), [periodOrders]);

  const totalOrders = periodOrders.length;
  const newCustomers = periodUsers.length;

  // Conversion: orders / total users * 100 (approximation)
  const conversionRate = allUsers.length > 0
    ? ((totalOrders / allUsers.length) * 100).toFixed(1)
    : '0.0';

  // Previous period for trend comparison
  const prevRange = useMemo(() => {
    const duration = range.end - range.start;
    return { start: new Date(range.start - duration), end: new Date(range.start) };
  }, [range]);

  const prevOrders = useMemo(() =>
    allOrders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= prevRange.start && d <= prevRange.end;
    }), [allOrders, prevRange]);

  const prevSales = prevOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const prevOrderCount = prevOrders.length;

  const trend = (current, previous) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const pct = ((current - previous) / previous * 100).toFixed(1);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  // Revenue chart
  const chartData = useMemo(() =>
    buildRevenueChart(periodOrders, period, range), [periodOrders, period, range]);

  // Top products: sort by price descending as proxy (since we have no "sold" counter)
  const topProducts = useMemo(() =>
    [...allProducts]
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 4), [allProducts]);

  // Low stock products
  const lowStockProducts = useMemo(() =>
    allProducts
      .filter(p => {
        // Check stock field — products may use stock or totalStock
        const stock = p.stock ?? p.totalStock ?? null;
        return stock !== null && stock <= 15;
      })
      .sort((a, b) => (a.stock ?? a.totalStock ?? 0) - (b.stock ?? b.totalStock ?? 0))
      .slice(0, 3), [allProducts]);

  // Recent orders (last 3 from filtered period, fallback to all)
  const recentOrders = useMemo(() =>
    (periodOrders.length > 0 ? periodOrders : allOrders).slice(0, 3), [periodOrders, allOrders]);

  const salesTrend = trend(totalSales, prevSales);
  const ordersTrend = trend(totalOrders, prevOrderCount);

  const kpis = [
    {
      label: 'Total Sales',
      value: `£${totalSales.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: salesTrend,
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      trend: ordersTrend,
      icon: ShoppingBag,
      color: 'text-blue-400'
    },
    {
      label: 'New Customers',
      value: newCustomers.toString(),
      trend: newCustomers > 0 ? `+${newCustomers}` : '0',
      icon: Users,
      color: 'text-admin-accent'
    },
    {
      label: 'Conversion',
      value: `${conversionRate}%`,
      trend: salesTrend, // proxy
      icon: Activity,
      color: 'text-amber-400'
    }
  ];

  const statusColor = (status) => {
    if (status === 'delivered') return 'text-emerald-400';
    if (status === 'pending')   return 'text-amber-400';
    if (status === 'cancelled') return 'text-rose-400';
    if (status === 'shipped')   return 'text-blue-400';
    return 'text-violet-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Enterprise Overview</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">
            Real-time store performance &amp; diagnostics
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            className="p-2 rounded-lg bg-admin-card border border-admin-border hover:bg-admin-border transition-all text-admin-muted hover:text-white"
            title="Refresh data"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {['Today', 'This Week', 'This Month'].map(t => (
            <button
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-3 py-1.5 rounded-lg border text-[12px] font-black uppercase tracking-widest transition-colors ${
                period === t
                  ? 'bg-admin-accent text-white border-admin-accent shadow-lg shadow-admin-accent/20'
                  : 'bg-admin-card border-admin-border hover:bg-admin-border'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-admin-card border border-admin-border p-4 rounded-xl">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-7 w-32" />
              </div>
            ))
          : kpis.map((stat, i) => (
              <div key={i} className="bg-admin-card border border-admin-border p-4 rounded-xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform">
                  <stat.icon size={56} />
                </div>
                <p className="text-[12px] font-black text-admin-muted uppercase tracking-[0.2em] mb-2">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <h3 className="text-xl font-black">{stat.value}</h3>
                  <div className={`flex items-center gap-0.5 text-[12px] font-black ${
                    stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* ── Chart + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-admin-muted">Revenue Dynamics</h3>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-admin-muted uppercase tracking-widest">
                {period} · {periodOrders.length} orders
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-admin-accent/10 rounded-lg text-[12px] font-black text-admin-accent uppercase tracking-widest">
                Live Monitoring
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-admin-muted">
                <TrendingUp size={32} className="opacity-20" />
                <p className="font-bold uppercase tracking-widest text-[12px]">No revenue data for this period</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C34" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A1A1AA', fontSize: 11 }}
                    dy={10}
                    interval={period === 'This Month' ? 4 : 'preserveStartEnd'}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A1A1AA', fontSize: 11 }}
                    tickFormatter={v => `£${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C1C21', border: '1px solid #2C2C34', borderRadius: '12px' }}
                    formatter={(value) => [`£${value.toFixed(2)}`, 'Revenue']}
                    labelStyle={{ color: '#A1A1AA', fontWeight: 800, fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7C3AED"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-black text-sm uppercase tracking-widest text-admin-muted mb-6">Top Velocity Items</h3>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b border-admin-border/50">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                ))
              : topProducts.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-2 text-admin-muted">
                    <Package size={24} className="opacity-30" />
                    <p className="text-[12px] font-bold uppercase tracking-widest">No products</p>
                  </div>
                )
                : topProducts.map((p, i) => {
                    const imgSrc = resolveImageUrl(p.images?.[0]);
                    const stock = p.stock ?? p.totalStock ?? 0;
                    return (
                      <div key={p._id || i} className="flex items-center justify-between group cursor-pointer border-b border-admin-border/50 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {imgSrc
                            ? <img src={imgSrc} className="w-10 h-10 rounded-lg object-cover border border-admin-border" alt={p.title} />
                            : <div className="w-10 h-10 rounded-lg bg-admin-bg border border-admin-border flex items-center justify-center text-admin-muted font-black text-[10px]">IMG</div>
                          }
                          <div>
                            <p className="text-[13px] font-bold truncate leading-tight max-w-[110px]">{p.title || p.name}</p>
                            <p className="text-[11px] text-admin-muted tracking-widest font-black uppercase">
                              {p.category?.name || p.category || '—'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-black">£{(p.price || 0).toFixed(2)}</p>
                          <p className={`text-[11px] font-bold ${stock <= 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {stock} in stock
                          </p>
                        </div>
                      </div>
                    );
                  })
            }
          </div>
        </div>
      </div>

      {/* ── Low Stock + Recent Orders ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Low Stock Warnings */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-rose-400 flex items-center gap-2">
              <AlertTriangle size={14} /> Low Stock Warnings
            </h3>
            <button
              onClick={() => navigate('/products')}
              className="text-[12px] font-black uppercase text-admin-muted hover:text-white transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-admin-border/50 bg-admin-bg/50">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-3 w-32" /><Skeleton className="h-2.5 w-20" /></div>
                  </div>
                ))
              : lowStockProducts.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-24 gap-2 text-admin-muted">
                    <Package size={24} className="opacity-30" />
                    <p className="text-[12px] font-bold uppercase tracking-widest">All products well stocked</p>
                  </div>
                )
                : lowStockProducts.map((p, i) => {
                    const stock = p.stock ?? p.totalStock ?? 0;
                    return (
                      <div key={p._id || i} className="flex items-center justify-between bg-admin-bg/50 p-3 rounded-xl border border-rose-500/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500 shrink-0">
                            <Package size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold">{p.title || p.name}</p>
                            <p className="text-[11px] text-rose-400 uppercase tracking-widest font-black">
                              {stock === 0 ? 'Out of stock' : `${stock} units left`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/products')}
                          className="px-3 py-1 bg-admin-card hover:bg-admin-border border border-admin-border rounded-lg text-[11px] font-black uppercase transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    );
                  })
            }
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-admin-muted flex items-center gap-2">
              <History size={14} /> Recent Logistics
            </h3>
            <button
              onClick={() => navigate('/orders')}
              className="text-[12px] font-black uppercase text-admin-muted hover:text-white transition-colors"
            >
              View Ledger
            </button>
          </div>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-admin-border/50 bg-admin-bg/50">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-3 w-32" /><Skeleton className="h-2.5 w-24" /></div>
                  </div>
                ))
              : recentOrders.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-24 gap-2 text-admin-muted">
                    <ShoppingBag size={24} className="opacity-30" />
                    <p className="text-[12px] font-bold uppercase tracking-widest">No orders in this period</p>
                  </div>
                )
                : recentOrders.map((o, i) => (
                    <div key={o._id || i} className="flex items-center justify-between bg-admin-bg/50 p-3 rounded-xl border border-admin-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-admin-accent/10 rounded-lg flex items-center justify-center text-admin-accent font-black text-[11px] shrink-0">
                          {o.orderNumber?.slice(-3) || `#${i + 1}`}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold">
                            {o.shippingAddress?.firstName} {o.shippingAddress?.lastName}
                          </p>
                          <p className={`text-[11px] uppercase tracking-widest font-black ${statusColor(o.status)}`}>
                            £{(o.totalAmount || 0).toFixed(2)} &bull; {o.status}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/orders')}
                        className="text-admin-muted hover:text-white transition-colors"
                      >
                        <ChevronDown size={18} className="-rotate-90" />
                      </button>
                    </div>
                  ))
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;
