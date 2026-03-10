import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit2, 
  Search,
  ShoppingCart,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';
import ImageUpload from './ImageUpload';

const CategoriesView = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.categories.delete(id);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (err) {
      toast.error('Failed to delete category');
      console.error(err);
    }
  };

  if (isAdding || editingCategory) {
    return (
      <CategoryForm 
        category={editingCategory}
        onCancel={() => { setIsAdding(false); setEditingCategory(null); }} 
        onSuccess={() => { setIsAdding(false); setEditingCategory(null); loadCategories(); }} 
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-admin-border pb-6 mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Category Management</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-[0.3em] font-bold mt-2">Manage shop categories and homepage visuals</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-admin-accent text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-admin-accent/20 hover:scale-105 transition-all">
             <Plus size={16} /> New Category
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-20 text-center uppercase tracking-widest text-admin-muted font-black animate-pulse">Loading Categories...</div>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat._id} className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden group hover:border-admin-accent/50 transition-all flex flex-col shadow-sm">
              <div className="relative aspect-[4/3] bg-admin-bg overflow-hidden border-b border-admin-border">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-admin-muted/30">
                    <ImageIcon size={40} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px] gap-2">
                   <button 
                     onClick={() => setEditingCategory(cat)}
                     className="p-3 bg-white text-black rounded-xl hover:bg-neutral-200 transition-all scale-90 group-hover:scale-100"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button 
                     onClick={() => handleDelete(cat._id)}
                     className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all scale-90 group-hover:scale-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                {cat.isActive ? (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500/20 text-emerald-400 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-500/30">
                    Live
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-500/20 text-red-500 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-500/30">
                    Hidden
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                 <div>
                    <h3 className="text-[14px] font-black tracking-tight uppercase leading-tight truncate">{cat.name}</h3>
                    <p className="text-[10px] text-admin-muted font-mono tracking-tighter mt-1 uppercase opacity-60">/{cat.slug}</p>
                 </div>
                 <div className="flex items-center justify-between pt-3 border-t border-admin-border/50">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-admin-accent">
                       <ShoppingCart size={12} className="opacity-50" /> {cat.count || 0} Products
                    </div>
                 </div>
              </div>
            </div>
          ))
        ) : (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-admin-border rounded-3xl bg-admin-card/20">
                <p className="text-admin-muted uppercase tracking-[0.3em] font-black text-[11px]">No categories found</p>
                <button onClick={() => setIsAdding(true)} className="mt-4 px-6 py-2 bg-admin-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Add First Category</button>
             </div>
        )}
        
        {/* Shadow Add Card */}
        {categories.length > 0 && (
          <div onClick={() => setIsAdding(true)} className="border-2 border-dashed border-admin-border rounded-2xl flex flex-col items-center justify-center text-admin-muted hover:border-admin-accent hover:text-admin-accent transition-all cursor-pointer aspect-[4/3] bg-admin-card/5 animate-pulse hover:animate-none">
             <Plus size={32} className="mb-2 opacity-30 group-hover:opacity-100" />
             <p className="text-[11px] font-black uppercase tracking-[0.2em] transform -translate-y-1">Add Category</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryForm = ({ category, onCancel, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    image: category?.image || '',
    isActive: category?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name) return toast.error('Category Name is required');
    setLoading(true);
    try {
      if (category) {
        await api.categories.update(category._id, formData);
        toast.success('Category updated successfully');
      } else {
        await api.categories.create(formData);
        toast.success('Category created successfully');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-md" onClick={onCancel} />
       <div className="relative bg-admin-card border border-admin-border w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 scrollbar-hide animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-admin-border pb-6 px-1 mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-admin-accent/10 flex items-center justify-center text-admin-accent">
                  <Layers size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase leading-none">{category ? 'Update Category' : 'Add New Category'}</h2>
                  <p className="text-[10px] text-admin-muted uppercase tracking-[0.3em] font-bold mt-2">Modify category details and display image</p>
               </div>
            </div>
            <button onClick={onCancel} className="p-3 hover:bg-admin-bg rounded-xl transition-colors border border-admin-border">
               <X size={20} className="text-admin-muted" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Visual Config */}
            <div className="space-y-4">
               <ImageUpload 
                value={formData.image}
                onChange={url => setFormData(prev => ({ ...prev, image: url }))}
                label="Category Display Image"
               />
               <p className="text-[8px] text-admin-muted uppercase tracking-[0.3em] text-center font-bold">Standard 4:3 or 16:9 aspect ratio recommended</p>
            </div>

            {/* Identity Config */}
            <div className="bg-admin-bg/30 border border-admin-border rounded-[2.5rem] p-8 space-y-8 shadow-inner justify-center flex flex-col">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
                   <Layers size={14} className="text-admin-accent" /> Category Name
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev, 
                      name: name, 
                      slug: category ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    }));
                  }}
                  placeholder="e.g. PREMIUM KAFTANS" 
                  className="w-full bg-admin-bg border border-admin-border px-5 py-4 rounded-2xl focus:border-admin-accent outline-none text-[15px] font-black uppercase tracking-tight shadow-inner" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
                   <Search size={14} className="text-admin-accent" /> Category URL Path
                </label>
                <div className="flex items-center group">
                  <div className="bg-admin-bg border-y border-l border-admin-border px-5 py-4 rounded-l-2xl text-[12px] font-mono text-admin-muted group-focus-within:border-admin-accent">/collections/</div>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="kaftans" 
                    className="w-full bg-admin-bg border border-admin-border px-5 py-4 rounded-r-2xl focus:border-admin-accent outline-none text-[12px] font-bold border-l-0 shadow-inner" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-admin-bg border border-admin-border rounded-2xl shadow-inner group transition-all hover:border-admin-accent/30">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${formData.isActive ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-admin-muted opacity-30 animate-pulse'}`} />
                  <div>
                     <span className="text-[11px] font-black uppercase tracking-widest text-white">Public Status</span>
                     <p className="text-[8px] text-admin-muted uppercase font-black tracking-widest mt-0.5">{formData.isActive ? 'Indexed & Visible' : 'Hidden from Registry'}</p>
                  </div>
                </div>
                <div 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`w-14 h-7 rounded-full relative p-1 cursor-pointer transition-all duration-500 ${formData.isActive ? 'bg-admin-accent' : 'bg-admin-border'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-xl transition-all duration-500 ${formData.isActive ? 'ml-7 rotate-180' : 'ml-0'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 pt-8 border-t border-admin-border">
             <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="flex-1 px-8 py-4 rounded-[1.25rem] bg-admin-accent text-white text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-admin-accent/30 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95"
             >
                {loading ? 'Processing Protocol...' : category ? 'Sync Changes' : 'Initialize Category'}
             </button>
             <button 
                onClick={onCancel}
                className="px-10 py-4 bg-admin-card text-admin-muted border border-admin-border rounded-[1.25rem] font-black uppercase text-[12px] tracking-widest hover:text-white transition-all"
             >
                Cancel
             </button>
          </div>
       </div>
    </div>,
    document.body
  );
};

export default CategoriesView;
