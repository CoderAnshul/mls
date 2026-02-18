import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  ShoppingBag, 
  DollarSign,
  AlertTriangle,
  History,
  Activity,
  Package,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { analyticsData, productsData, ordersData } from '../../data/mockData';

const DashboardView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Enterprise Overview</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Real-time store performance & diagnostics</p>
        </div>
        <div className="flex gap-2">
          {['Today', 'This Week', 'This Month'].map(t => (
            <button key={t} className="px-3 py-1.5 rounded-lg bg-admin-card border border-admin-border text-[12px] font-black uppercase tracking-widest hover:bg-admin-border transition-colors">
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sales', value: '£12,450.00', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Total Orders', value: '248', trend: '+8.2%', icon: ShoppingBag, color: 'text-blue-400' },
          { label: 'New Customers', value: '32', trend: '+14.1%', icon: Users, color: 'text-admin-accent' },
          { label: 'Conversion', value: '4.2%', trend: '-1.5%', icon: Activity, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-admin-card border border-admin-border p-4 rounded-xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform">
               <stat.icon size={56} />
            </div>
            <p className="text-[12px] font-black text-admin-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-black">{stat.value}</h3>
              <div className={`flex items-center gap-0.5 text-[12px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Graph */}
        <div className="lg:col-span-2 bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-sm uppercase tracking-widest text-admin-muted">Revenue Dynamics</h3>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-admin-accent/10 rounded-lg text-[12px] font-black text-admin-accent uppercase tracking-widest">
                 Live Monitoring
              </div>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={analyticsData}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C34" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#1C1C21', border: '1px solid #2C2C34', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Top Selling Mini-List */}
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm">
           <h3 className="font-black text-sm uppercase tracking-widest text-admin-muted mb-6">Top Velocity Items</h3>
           <div className="space-y-4">
              {productsData.slice(0, 4).map((p, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-admin-border/50 pb-3">
                    <div className="flex items-center gap-3">
                       <img src={p.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                       <div>
                          <p className="text-[14px] font-bold truncate leading-tight">{p.name}</p>
                          <p className="text-[13px] text-admin-muted tracking-widest font-black uppercase">{p.category}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[13px] font-black">£{p.price.toFixed(2)}</p>
                       <p className="text-[13px] text-emerald-400 font-bold">128 sold</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Low Stock Alerts */}
         <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-black text-sm uppercase tracking-widest text-rose-400 flex items-center gap-2">
                  <AlertTriangle size={14} /> Low Stock Warnings
               </h3>
               <button className="text-[12px] font-black uppercase text-admin-muted hover:text-white">Replenish All</button>
            </div>
            <div className="space-y-3">
               {productsData.slice(2, 4).map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-admin-bg/50 p-3 rounded-xl border border-admin-border/50">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                           <Package size={16} />
                        </div>
                        <div>
                           <p className="text-[14px] font-bold">{p.name}</p>
                           <p className="text-[12px] text-admin-muted uppercase tracking-widest font-black">{p.stockLeft} units remaining</p>
                        </div>
                     </div>
                     <button className="px-3 py-1 bg-admin-card hover:bg-admin-border border border-admin-border rounded-lg text-[12px] font-black uppercase">Refill</button>
                  </div>
               ))}
            </div>
         </div>

         {/* Recent Orders List */}
         <div className="bg-admin-card border border-admin-border rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-black text-sm uppercase tracking-widest text-admin-muted flex items-center gap-2">
                  <History size={14} /> Recent Logistics
               </h3>
               <button className="text-[12px] font-black uppercase text-admin-muted hover:text-white">View Ledger</button>
            </div>
            <div className="space-y-3">
               {ordersData.slice(0, 3).map((o, i) => (
                  <div key={i} className="flex items-center justify-between bg-admin-bg/50 p-3 rounded-xl border border-admin-border/50">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-admin-accent/10 rounded-lg flex items-center justify-center text-admin-accent font-black text-[12px]">
                           {o.id.split('-')[1]}
                        </div>
                        <div>
                           <p className="text-[14px] font-bold">{o.customer}</p>
                           <p className="text-[13px] text-admin-muted uppercase tracking-widest font-black">£{o.amount.toFixed(2)} • {o.status}</p>
                        </div>
                     </div>
                     <ChevronDown size={18} className="text-admin-muted -rotate-90" />
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
