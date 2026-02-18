import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Upload,
  Search,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const ReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const toast = useToast();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.reviews.getAll();
      setReviews(data);
    } catch (err) {
      toast.error('Failed to fetch sentiment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.reviews.update(id, { status });
      toast.success(`Review marked as ${status}`);
      loadReviews();
    } catch (err) {
      toast.error('Moderation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this review forever?')) return;
    try {
      await api.reviews.delete(id);
      toast.success('Sentiment data purged');
      loadReviews();
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const res = await api.reviews.importExcel(file);
      toast.success(res.message || 'Bulk import successful');
      loadReviews();
    } catch (err) {
      toast.error('Import failed: Check file format');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      <div className="flex items-end justify-between border-b border-admin-border pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-admin-accent text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Sentiment Analysis</span>
            <div className="h-0.5 w-12 bg-admin-border rounded-full" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Review Moderation</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-[0.3em] font-bold">Audit customer feedback and maintain brand sentiment</p>
        </div>
        
        <div className="flex items-center gap-3">
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleBulkImport} 
             className="hidden" 
             accept=".xlsx, .xls, .csv" 
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={importing}
             className="flex items-center gap-2 bg-admin-card border border-admin-border text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-admin-accent transition-all disabled:opacity-50 shadow-xl"
           >
             {importing ? <RefreshCw size={14} className="animate-spin text-admin-accent" /> : <FileSpreadsheet size={14} className="text-admin-accent" />}
             Bulk Import Excel
           </button>
           <button onClick={loadReviews} className="p-3 bg-admin-card border border-admin-border rounded-xl hover:bg-admin-border transition-all">
             <RefreshCw size={18} className={`text-admin-muted ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-admin-card border border-admin-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-admin-border bg-admin-bg/30 flex items-center justify-between gap-4">
             <div className="flex items-center gap-4 flex-1 max-w-md bg-admin-bg border border-admin-border rounded-2xl px-4 py-2 focus-within:border-admin-accent transition-all">
                <Search size={16} className="text-admin-muted" />
                <input 
                  type="text" 
                  placeholder="Filter reviews by name or content..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold w-full text-white placeholder:text-admin-muted/50" 
                />
             </div>
             <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-admin-muted">
                <span>Total: {reviews.length}</span>
                <span className="text-emerald-400">Approved: {reviews.filter(r => r.status === 'Approved').length}</span>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-admin-border text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">
                  <th className="px-8 py-5">Customer Profile</th>
                  <th className="px-8 py-5">Sentiment Analysis</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border/50">
                {loading && reviews.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center uppercase tracking-widest text-admin-muted font-black animate-pulse">Scanning Sentiment Database...</td>
                  </tr>
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map((rev) => (
                    <tr key={rev._id} className="group hover:bg-admin-bg/40 transition-all duration-300">
                      <td className="px-8 py-6">
                         <div className="space-y-1.5">
                            <h4 className="text-[14px] font-black uppercase tracking-tight text-white">{rev.name}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-admin-muted font-bold uppercase tracking-wider">
                               <span className="flex items-center gap-1"><MapPin size={10} className="text-admin-accent" /> {rev.location || 'Unknown'}</span>
                               <span className="flex items-center gap-1"><Calendar size={10} className="text-admin-accent" /> {rev.date}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 max-w-xl">
                         <div className="space-y-3">
                            <div className="flex items-center gap-0.5 text-amber-500">
                               {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < (rev.rating || 5) ? 'currentColor' : 'none'} className={i < (rev.rating || 5) ? 'shadow-lg shadow-amber-500/20' : 'text-admin-border'} />
                               ))}
                            </div>
                            <p className="text-[13px] text-neutral-300 leading-relaxed font-medium bg-admin-bg/50 p-4 rounded-2xl border border-admin-border group-hover:border-admin-accent/30 transition-all">
                               "{rev.review}"
                            </p>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            rev.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            rev.status === 'Spam' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                         }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${rev.status === 'Approved' ? 'bg-emerald-400' : rev.status === 'Spam' ? 'bg-red-500' : 'bg-amber-400 animate-pulse'}`} />
                            {rev.status}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            {rev.status !== 'Approved' && (
                              <button 
                                onClick={() => handleStatusUpdate(rev._id, 'Approved')}
                                className="p-2.5 rounded-xl border border-admin-border hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all shadow-lg"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            {rev.status !== 'Spam' && (
                              <button 
                                onClick={() => handleStatusUpdate(rev._id, 'Spam')}
                                className="p-2.5 rounded-xl border border-admin-border hover:bg-amber-500 text-amber-400 hover:text-white transition-all shadow-lg"
                              >
                                <AlertCircle size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(rev._id)}
                              className="p-2.5 rounded-xl border border-admin-border hover:bg-red-500 text-red-400 hover:text-white transition-all shadow-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center border-2 border-dashed border-admin-border m-8 rounded-3xl bg-admin-card/20">
                       <p className="text-admin-muted uppercase tracking-[0.3em] font-black text-[11px]">No categorical signatures detected</p>
                       <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-6 py-2 bg-admin-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20">Initialize Bulk Import</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsView;
