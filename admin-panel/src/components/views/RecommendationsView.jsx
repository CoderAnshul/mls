import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search,
  ShoppingCart,
  Image as ImageIcon,
  X,
  Star,
  Check,
  Upload,
  RefreshCw,
  Layout,
  ChevronDown
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const RecommendationsView = ({ type }) => {
  const toast = useToast();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRec, setEditingRec] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await api.recommendations.getAll();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recommendation?')) return;
    try {
      await api.recommendations.delete(id);
      toast.success('Recommendation removed');
      loadRecommendations();
    } catch (err) {
      toast.error('Failed to delete recommendation');
      console.error(err);
    }
  };

  if (isAdding || editingRec) {
    return (
      <RecommendationForm 
        recommendation={editingRec}
        defaultType={type}
        onCancel={() => { setIsAdding(false); setEditingRec(null); }} 
        onSuccess={() => { setIsAdding(false); setEditingRec(null); loadRecommendations(); }} 
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-admin-border pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Recommendation Engine</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-[0.3em] font-bold mt-2">Manage cart & checkout upsell cards</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-admin-accent text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-admin-accent/20 hover:scale-105 transition-all">
             <Plus size={16} /> New Recommendation
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-20 text-center uppercase tracking-widest text-admin-muted font-black animate-pulse">Scanning Recommendations...</div>
        ) : recommendations.filter(r => !type || type === 'all' || r.type === type).length > 0 ? (
          recommendations.filter(r => !type || type === 'all' || r.type === type).map((rec) => (
            <div key={rec._id} className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden group hover:border-admin-accent/50 transition-all flex flex-col shadow-sm">
              <div className="relative aspect-[16/9] bg-admin-bg overflow-hidden border-b border-admin-border p-4 bg-neutral-100 flex items-center justify-center">
                 {/* Card Preview */}
                 <div className="bg-white border border-neutral-200 p-4 rounded-sm shadow-md w-full max-w-[280px]">
                    <p className="text-[9px] font-bold text-center mb-2 uppercase tracking-tighter text-neutral-800 line-clamp-1">{rec.heading}</p>
                    <div className="flex gap-3">
                        <img 
                            src={rec.image || rec.product?.images?.[0] || rec.product?.image || rec.product?.coverImage || 'https://via.placeholder.com/150'} 
                            alt={rec.product?.title} 
                            className="w-10 h-13 object-cover border border-neutral-100" 
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] font-bold truncate tracking-tighter uppercase">{rec.product?.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] text-red-600 line-through">£{rec.product?.price}</span>
                                <span className="text-[10px] font-bold">£{(rec.product?.price * (1 - rec.discountPercentage/100)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                 </div>
                 
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px] gap-2">
                   <button 
                     onClick={() => setEditingRec(rec)}
                     className="p-3 bg-white text-black rounded-xl hover:bg-neutral-200 transition-all scale-90 group-hover:scale-100"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button 
                     onClick={() => handleDelete(rec._id)}
                     className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all scale-90 group-hover:scale-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 text-white backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/20">
                    {rec.type}
                </div>
              </div>

              <div className="p-5 space-y-3">
                 <div>
                    <h3 className="text-[14px] font-black tracking-tight uppercase leading-tight truncate">{rec.product?.title}</h3>
                    <p className="text-[10px] text-admin-muted font-bold tracking-widest mt-1 uppercase opacity-60 line-clamp-1">{rec.heading}</p>
                 </div>
                 <div className="flex items-center justify-between pt-3 border-t border-admin-border/50">
                    <div className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${rec.isActive ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${rec.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                        {rec.isActive ? 'Active' : 'Draft'}
                    </div>
                    <div className="text-[10px] font-black uppercase text-admin-accent">
                        {rec.discountPercentage}% OFF
                    </div>
                 </div>
              </div>
            </div>
          ))
        ) : (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-admin-border rounded-3xl bg-admin-card/20">
                <p className="text-admin-muted uppercase tracking-[0.3em] font-black text-[11px]">No recommendation protocols active</p>
                <button onClick={() => setIsAdding(true)} className="mt-4 px-6 py-2 bg-admin-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Deploy First Card</button>
             </div>
        )}
      </div>
    </div>
  );
};

const RecommendationForm = ({ recommendation, defaultType, onCancel, onSuccess }) => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    heading: recommendation?.heading || 'Add this product to your order and get 25% OFF',
    product: recommendation?.product?._id || recommendation?.product || '',
    image: recommendation?.image || '',
    description: recommendation?.description || '',
    type: recommendation?.type || (defaultType === 'all' ? 'checkout' : defaultType) || 'checkout',
    discountPercentage: recommendation?.discountPercentage || 25,
    isActive: recommendation?.isActive ?? true,
    order: recommendation?.order || 0
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setFetchingProducts(true);
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setFetchingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.navigation.uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Visual artifact ingested');
    } catch (err) {
      toast.error('Transmission failure: Image not loaded');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.product) return toast.error('Please select a product');
    
    setLoading(true);
    try {
      if (recommendation) {
        await api.recommendations.update(recommendation._id, formData);
        toast.success('Recommendation reconfigured');
      } else {
        await api.recommendations.create(formData);
        toast.success('Recommendation card deployed');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = products.find(p => p._id === formData.product);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between border-b border-admin-border pb-6 px-1">
        <div className="flex items-center gap-4">
           <button onClick={onCancel} className="p-2 hover:bg-admin-card rounded-lg border border-admin-border text-admin-muted">
              <X size={18} />
           </button>
           <div>
              <h2 className="text-2xl font-black tracking-tight uppercase leading-none">{recommendation ? 'Modify Offer' : 'Deploy New Offer'}</h2>
              <p className="text-[10px] text-admin-muted uppercase tracking-[0.3em] font-bold mt-2">Adjust upsell parameters and messaging</p>
           </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSubmit} disabled={loading || uploading} className="px-8 py-3 rounded-xl bg-admin-accent text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-admin-accent/20 transition-all disabled:opacity-50 hover:scale-105 active:scale-95">
            {loading ? 'Processing...' : recommendation ? 'Save Protocol' : 'Finalize Deployment'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration */}
        <div className="space-y-6">
          <div className="bg-admin-card border border-admin-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-admin-accent flex items-center gap-2">
                <Star size={14} /> Protocol Config
            </h3>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.3em] mb-1">Offer Message (Heading)</label>
              <textarea 
                value={formData.heading}
                onChange={e => setFormData({...formData, heading: e.target.value})}
                placeholder="e.g. Add this to your order and get 25% OFF" 
                className="w-full bg-admin-bg border border-admin-border px-4 py-3 rounded-2xl focus:border-admin-accent outline-none text-[14px] font-black uppercase tracking-tight shadow-inner min-h-[80px]" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.3em] mb-1">Product Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Write a compelling description for this product..." 
                className="w-full bg-admin-bg border border-admin-border px-4 py-3 rounded-2xl focus:border-admin-accent outline-none text-[13px] font-medium shadow-inner min-h-[120px]" 
              />
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.3em] mb-1">Promotional Visual (Optional)</label>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-admin-bg border border-admin-border group border-dashed">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-admin-muted gap-2">
                          <ImageIcon size={32} strokeWidth={1} className="opacity-20" />
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Using Default Product Image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-2xl">
                          {uploading ? <RefreshCw className="animate-spin" size={12} /> : <Upload size={14} />}
                          {formData.image ? 'Swap Artifact' : 'Inject Asset'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        {formData.image && (
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.3em] mb-1">Target Location</label>
                    <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-admin-bg border border-admin-border px-4 py-3 rounded-2xl focus:border-admin-accent outline-none text-[12px] font-black uppercase tracking-widest shadow-inner appearance-none"
                    >
                        <option value="checkout">Checkout Page</option>
                        <option value="cart">Cart Sidebar</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.3em] mb-1">Discount %</label>
                    <input 
                        type="number"
                        value={formData.discountPercentage}
                        onChange={e => setFormData({...formData, discountPercentage: e.target.value})}
                        className="w-full bg-admin-bg border border-admin-border px-4 py-3 rounded-2xl focus:border-admin-accent outline-none text-[14px] font-black uppercase tracking-tight shadow-inner"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-admin-bg border border-admin-border rounded-2xl shadow-inner group">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-white">Active Status</span>
                </div>
                <div 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-all duration-500 ${formData.isActive ? 'bg-admin-accent' : 'bg-admin-border'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-xl transition-all duration-500 ${formData.isActive ? 'ml-6' : 'ml-0'}`} />
                </div>
            </div>
          </div>

          <div className="bg-admin-card border border-admin-border rounded-[2.5rem] p-8 space-y-4 shadow-sm">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-admin-accent flex items-center gap-2">
                <Layout size={14} /> Live Preview
            </h3>
            <div className="bg-neutral-100/50 p-8 rounded-2xl flex items-center justify-center border border-dashed border-admin-border">
                {/* Visual Preview Card */}
                 <div className="bg-white border border-neutral-200 p-6 rounded-sm shadow-xl w-full max-w-[320px] transition-all">
                    <p className="text-[10px] font-bold text-center mb-4 uppercase tracking-[0.1em] text-neutral-800 border-b border-neutral-100 pb-2 line-clamp-2">{formData.heading}</p>
                    <div className="flex gap-4">
                        <div className="w-20 h-25 bg-neutral-50 border border-neutral-100 overflow-hidden rounded-sm">
                            {(formData.image || selectedProduct) ? (
                                <img src={formData.image || selectedProduct?.images?.[0] || selectedProduct?.image} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-10">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h4 className="text-[12px] font-black tracking-tight uppercase leading-tight line-clamp-2">
                                    {selectedProduct ? selectedProduct.title : 'Select a Product'}
                                </h4>
                                <button className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                    Description <ChevronDown size={8} className="translate-y-[0.5px]" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-red-600 line-through font-bold">£{selectedProduct?.price || '0.00'}</span>
                                <span className="text-[13px] font-black tracking-tight">£{( (selectedProduct?.price || 0) * (1 - formData.discountPercentage/100) ).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {formData.description && (
                         <div className="mt-4 pt-4 border-t border-neutral-100">
                             <p className="text-[10px] leading-relaxed text-neutral-600 font-medium">{formData.description}</p>
                         </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Right: Product Selector */}
        <div className="bg-admin-card border border-admin-border rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-admin-accent flex items-center gap-2">
                    <ShoppingCart size={14} /> Product Catalog
                </h3>
                <span className="text-[10px] text-admin-muted font-bold">{products.length} Items</span>
            </div>

            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full bg-admin-bg border border-admin-border pl-12 pr-4 py-3.5 rounded-2xl focus:border-admin-accent outline-none text-[13px] font-bold shadow-inner"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {fetchingProducts ? (
                    <div className="py-20 text-center uppercase tracking-widest text-admin-muted font-black animate-pulse text-[10px]">Loading Catalog...</div>
                ) : filteredProducts.map(p => (
                    <div 
                        key={p._id}
                        onClick={() => setFormData({...formData, product: p._id})}
                        className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${formData.product === p._id ? 'bg-admin-accent/10 border-admin-accent' : 'bg-admin-bg/40 border-admin-border hover:bg-admin-bg'}`}
                    >
                        <img src={p.images?.[0] || p.image || p.coverImage} className="w-10 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-black uppercase truncate">{p.title}</p>
                            <p className="text-[10px] text-admin-muted font-bold">£{p.price}</p>
                        </div>
                        {formData.product === p._id && <div className="w-6 h-6 rounded-full bg-admin-accent flex items-center justify-center text-white"><Check size={14} strokeWidth={3} /></div>}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsView;
