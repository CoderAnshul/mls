import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Upload, 
  Link as LinkIcon, 
  Type, 
  RefreshCw, 
  Save,
  ShoppingBag
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const ShopHijabView = () => {
  const [assets, setAssets] = useState([]);
  const [localValue, setLocalValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const assetKey = 'shop_hijabs';

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/home-assets`);
      const data = await res.json();
      setAssets(data);
      
      const hijabAsset = data.find(a => a.key === assetKey);
      setLocalValue(hijabAsset?.value || []);
    } catch (err) {
      toast.error('Failed to sync hijab assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const asset = assets.find(a => a.key === assetKey);
      const assetData = asset || { 
        key: assetKey, 
        value: localValue, 
        type: 'object', 
        description: 'Shop Hijabs Category Cluster' 
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/home-assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assetData, value: localValue })
      });
      
      if (!res.ok) throw new Error();
      toast.success('Hijab Cluster updated successfully');
      loadAssets();
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url } = await api.navigation.uploadImage(file);
      const updatedValue = [...localValue];
      updatedValue[index].image = url;
      setLocalValue(updatedValue);
      toast.success('Visual asset buffered');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const addItem = () => {
    setLocalValue([...localValue, { image: '', link: '', title: '' }]);
  };

  const removeItem = (index) => {
    setLocalValue(localValue.filter((_, i) => i !== index));
  };

  const hasChanges = JSON.stringify(assets.find(a => a.key === assetKey)?.value || []) !== JSON.stringify(localValue);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-32 h-1 bg-admin-border rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-admin-accent animate-progress origin-left" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-admin-muted animate-pulse">Syncing hijab matrix...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="flex items-end justify-between border-b border-admin-border pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-admin-accent text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Category Module</span>
            <div className="h-0.5 w-12 bg-admin-border rounded-full" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">Hijab Commander</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-[0.3em] font-bold">Homepage Hijab Classification Engine</p>
        </div>
        <div className="flex items-center gap-4">
          {hasChanges && (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-admin-accent text-white px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-admin-accent/20 hover:scale-105 transition-all disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Execute Sync
            </button>
          )}
          <button 
            onClick={loadAssets}
            className="p-3 bg-admin-card border border-admin-border rounded-xl hover:rotate-180 transition-all duration-700"
          >
            <RefreshCw size={18} className="text-admin-muted" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-admin-accent/10 rounded-xl">
              <ShoppingBag size={18} className="text-admin-accent" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Active Hijab Nodes</h3>
          </div>
          <button 
            onClick={addItem}
            className="flex items-center gap-1.5 px-4 py-2 bg-admin-card text-admin-muted rounded-full border border-admin-border hover:bg-admin-accent hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={12} /> Add Cluster
          </button>
        </div>

        {localValue.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-admin-border rounded-[3rem] text-center bg-admin-card/20">
            <p className="text-[11px] font-black text-admin-muted uppercase tracking-[0.3em]">No hijacking detected in this sector</p>
            <button 
              onClick={addItem}
              className="mt-6 px-8 py-3 bg-admin-card border border-admin-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-admin-accent transition-all"
            >
              Initialize Hijab Cluster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {localValue.map((item, idx) => (
              <div key={idx} className="bg-admin-card border border-admin-border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col group relative">
                <button 
                  onClick={() => removeItem(idx)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white/50 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>

                <div className="relative aspect-[3/4] bg-admin-bg/50 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-admin-muted">
                      <ImageIcon size={32} strokeWidth={1} className="opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                    <label className="cursor-pointer bg-white text-black px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-2xl scale-90 group-hover:scale-100">
                      <Upload size={14} />
                      {item.image ? 'Swap Vision' : 'Inject Asset'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, idx)}
                      />
                    </label>
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1 bg-gradient-to-b from-admin-card to-[#121214]">
                  <div className="space-y-2">
                    <label className="text-[7px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-1.5 ml-1">
                      <Type size={10} className="text-admin-accent" /> Identity Header
                    </label>
                    <input 
                      type="text" 
                      value={item.title}
                      onChange={(e) => {
                        const val = [...localValue];
                        val[idx].title = e.target.value;
                        setLocalValue(val);
                      }}
                      className="w-full bg-admin-bg border border-admin-border px-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[11px] font-black uppercase tracking-tight shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[7px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-1.5 ml-1">
                      <LinkIcon size={10} className="text-admin-accent" /> Redirection Protcol
                    </label>
                    <input 
                      type="text" 
                      value={item.link}
                      onChange={(e) => {
                        const val = [...localValue];
                        val[idx].link = e.target.value;
                        setLocalValue(val);
                      }}
                      className="w-full bg-admin-bg border border-admin-border px-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[9px] font-mono text-admin-accent shadow-inner lowercase"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopHijabView;
