import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Download,
  Filter,
  Calendar,
  FileText
} from 'lucide-react';
import { analyticsData } from '../../data/mockData';

const AnalyticsView = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Intelligence & Reports</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Deep-dive multidimensional store performance analysis</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-admin-muted" />
            <span className="text-[13px] font-bold uppercase tracking-widest">Last 30 Days</span>
          </div>
          <button className="flex items-center gap-2 bg-admin-accent text-white px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Sale Value', value: '£124.50', trend: '+5.2%', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Cust. Acquisition', value: '£12.40', trend: '-2.1%', icon: Users, color: 'text-blue-400' },
          { label: 'Retention Rate', value: '24.8%', trend: '+8.4%', icon: TrendingUp, color: 'text-admin-accent' },
          { label: 'Return Rate', value: '1.2%', trend: '-0.5%', icon: ShoppingBag, color: 'text-rose-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-admin-card border border-admin-border p-4 rounded-xl">
            <p className="text-[12px] font-black text-admin-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-black">{stat.value}</h3>
              <div className={`text-[12px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-admin-card border border-admin-border rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-admin-muted">Revenue & Forecasting</h3>
              <FileText size={14} className="text-admin-muted" />
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C34" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#1C1C21', border: '1px solid #2C2C34', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="#7C3AED" fillOpacity={0.1} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-admin-card border border-admin-border rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-admin-muted">Order Volume Trends</h3>
              <TrendingUp size={14} className="text-admin-muted" />
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C34" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#2C2C34', radius: 8}} contentStyle={{backgroundColor: '#1C1C21', border: '1px solid #2C2C34'}} />
                    <Bar dataKey="orders" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
