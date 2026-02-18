import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Layers, 
  Layout,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  Type,
  Monitor,
  RefreshCw,
  Save
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const BannersView = () => {
  const [assets, setAssets] = useState([]);
  const [localAssets, setLocalAssets] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // Tracking saving state per key
  const toast = useToast();

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/home-assets`);
      const data = await res.json();
      setAssets(data);
      
      // Initialize local state
      const local = {};
      data.forEach(asset => {
        local[asset.key] = asset.value;
      });
      setLocalAssets(local);
    } catch (err) {
      toast.error('Failed to sync banner assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleLocalUpdate = (key, value) => {
    setLocalAssets(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      const asset = assets.find(a => a.key === key);
      const value = localAssets[key];
      
      const assetData = asset || { 
        key, 
        value, 
        type: Array.isArray(value) ? 'object' : (typeof value === 'string' ? 'text' : 'object'), 
        description: key.replace(/_/g, ' ').toUpperCase() 
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/home-assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assetData, value })
      });
      
      if (!res.ok) throw new Error();
      toast.success(`${key.replace(/_/g, ' ').toUpperCase()} updated successfully`);
      
      // Update the base assets to match local state
      const updatedAssets = [...assets];
      const idx = updatedAssets.findIndex(a => a.key === key);
      if (idx !== -1) {
        updatedAssets[idx] = { ...updatedAssets[idx], value };
      } else {
        updatedAssets.push(assetData);
      }
      setAssets(updatedAssets);

    } catch (err) {
      toast.error(`Failed to save ${key}`);
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImageUpload = async (e, key, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url } = await api.navigation.uploadImage(file);
      if (index !== null) {
        const updatedValue = [...(localAssets[key] || [])];
        if (updatedValue[index]) {
          updatedValue[index].image = url;
        } else {
          updatedValue.push({ image: url, link: '', title: '' });
        }
        handleLocalUpdate(key, updatedValue);
      } else {
        handleLocalUpdate(key, url);
      }
      toast.success('Image uploaded to pending state');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const addItem = (key) => {
    const newValue = [...(localAssets[key] || [])];
    newValue.push({ image: '', link: '', title: '' });
    handleLocalUpdate(key, newValue);
  };

  const removeItem = (key, index) => {
    const newValue = (localAssets[key] || []).filter((_, i) => i !== index);
    handleLocalUpdate(key, newValue);
  };

  const hasChanges = (key) => {
    const original = assets.find(a => a.key === key)?.value;
    const current = localAssets[key];
    return JSON.stringify(original) !== JSON.stringify(current);
  };

  const BannerSection = ({ title, assetKey, icon: Icon, showTitle = false }) => {
    const items = localAssets[assetKey] || [];
    const isEditing = hasChanges(assetKey);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-admin-accent/10 rounded-xl">
              <Icon size={18} className="text-admin-accent" />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h3>
              {isEditing && <span className="text-[8px] font-black text-admin-accent uppercase tracking-widest animate-pulse">Unsaved Changes Detected</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => addItem(assetKey)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-admin-card text-admin-muted rounded-full border border-admin-border hover:bg-admin-accent hover:text-white hover:border-admin-accent transition-all text-[9px] font-black uppercase tracking-widest"
            >
              <Plus size={10} /> Add Node
            </button>
            {isEditing && (
              <button 
                onClick={() => handleSave(assetKey)}
                disabled={saving[assetKey]}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-admin-accent text-white rounded-full shadow-lg shadow-admin-accent/20 hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {saving[assetKey] ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
                Process Upload & Save
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-16 border-2 border-dashed border-admin-border rounded-[2.5rem] text-center bg-admin-card/20 group hover:border-admin-accent/50 transition-colors">
            <p className="text-[10px] font-black text-admin-muted uppercase tracking-[0.3em] group-hover:text-admin-accent transition-colors">No data segments found in this block</p>
            <button 
              onClick={() => addItem(assetKey)}
              className="mt-6 px-8 py-2.5 bg-admin-card border border-admin-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-admin-accent hover:text-admin-accent transition-all shadow-xl"
            >
              Initialize Cluster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, idx) => (
              <div key={idx} className="bg-admin-card border border-admin-border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col group/card relative transform transition-all duration-500 hover:-translate-y-1">
                <button 
                  onClick={() => removeItem(assetKey, idx)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white/50 backdrop-blur-md rounded-xl opacity-0 group-hover/card:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>

                <div className="relative aspect-[3/4] md:aspect-video group/img bg-admin-bg/50 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-admin-muted bg-gradient-to-br from-admin-bg to-admin-card">
                      <ImageIcon size={32} strokeWidth={1} className="opacity-20 translate-y-2 group-hover/img:translate-y-0 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-2xl scale-90 group-hover/img:scale-100">
                      <Upload size={14} />
                      {item.image ? 'Change Vision' : 'Import Asset'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, assetKey, idx)}
                      />
                    </label>
                  </div>
                  {/* Index Indicator */}
                  <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black text-white/60 uppercase tracking-widest">
                    Seg-0{idx + 1}
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1 bg-gradient-to-b from-admin-card to-[#121214]">
                  {showTitle && (
                    <div className="space-y-2">
                      <label className="text-[7px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-1.5 ml-1">
                        <Type size={10} className="text-admin-accent opacity-50" /> Identity Header
                      </label>
                      <input 
                        type="text" 
                        value={item.title}
                        onChange={(e) => {
                          const val = [...localAssets[assetKey]];
                          val[idx].title = e.target.value;
                          handleLocalUpdate(assetKey, val);
                        }}
                        placeholder="Untitled Sequence..."
                        className="w-full bg-admin-bg border border-admin-border px-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[11px] font-black uppercase tracking-tight shadow-inner"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[7px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-1.5 ml-1">
                      <LinkIcon size={10} className="text-admin-accent opacity-50" /> Redirection Protocol
                    </label>
                    <input 
                      type="text" 
                      value={item.link}
                      onChange={(e) => {
                        const val = [...localAssets[assetKey]];
                        val[idx].link = e.target.value;
                        handleLocalUpdate(assetKey, val);
                      }}
                      placeholder="/navigation/target..."
                      className="w-full bg-admin-bg border border-admin-border px-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[10px] font-mono text-admin-accent shadow-inner lowercase"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SingleAssetSection = ({ title, bannerKey, textKey, linkKey }) => {
    const banner = localAssets[bannerKey];
    const text = localAssets[textKey];
    const link = localAssets[linkKey];
    
    const isEditing = hasChanges(bannerKey) || hasChanges(textKey) || hasChanges(linkKey);
    const isSaveDisabled = saving[bannerKey] || saving[textKey] || saving[linkKey];

    const saveHero = async () => {
       // Save all hero keys
       await Promise.all([
         handleSave(bannerKey),
         handleSave(textKey),
         handleSave(linkKey)
       ]);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-admin-accent/10 rounded-xl text-admin-accent">
              <Monitor size={18} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h3>
              {isEditing && <span className="text-[8px] font-black text-admin-accent uppercase tracking-widest animate-pulse">Unsaved Changes Detected</span>}
            </div>
          </div>
          {isEditing && (
              <button 
                onClick={saveHero}
                disabled={isSaveDisabled}
                className="flex items-center gap-1.5 px-6 py-2 bg-admin-accent text-white rounded-full shadow-lg shadow-admin-accent/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isSaveDisabled ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                Update Hero Commander
              </button>
            )}
        </div>

        <div className="bg-admin-card border border-admin-border rounded-[2.5rem] p-10 shadow-2xl space-y-8 bg-gradient-to-br from-admin-card to-[#0F0F11] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-admin-accent/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-4">
               <div className="relative aspect-video rounded-[2rem] overflow-hidden group/hero bg-admin-bg/50 border border-admin-border shadow-inner">
                  {banner ? (
                    <img src={banner} alt="" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover/hero:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-admin-muted bg-admin-bg/40">
                      <ImageIcon size={48} strokeWidth={1} className="opacity-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/hero:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                    <label className="cursor-pointer bg-white text-black px-7 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-neutral-200 transition-all shadow-2xl scale-95 group-hover/hero:scale-100">
                      <Upload size={16} />
                      {banner ? 'Swap Vision' : 'Inject Banner Asset'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, bannerKey)}
                      />
                    </label>
                  </div>
               </div>
            </div>

            <div className="space-y-8 justify-center flex flex-col">
               <div className="space-y-3">
                  <label className="text-[8px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
                    <Type size={12} className="text-admin-accent opacity-50" /> Command Text
                  </label>
                  <input 
                    type="text" 
                    value={text || ''}
                    onChange={(e) => handleLocalUpdate(textKey, e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border px-6 py-4 rounded-[1.25rem] focus:border-admin-accent outline-none text-[18px] font-black uppercase tracking-tighter shadow-inner transition-all placeholder:text-admin-muted/30"
                    placeholder="Enter hero text..."
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[8px] font-black text-admin-muted uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
                    <LinkIcon size={12} className="text-admin-accent opacity-50" /> Navigation Target
                  </label>
                  <input 
                    type="text" 
                    value={link || ''}
                    onChange={(e) => handleLocalUpdate(linkKey, e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border px-6 py-4 rounded-[1.25rem] focus:border-admin-accent outline-none text-[13px] font-mono text-admin-accent shadow-inner transition-all placeholder:text-admin-accent/20 lowercase"
                    placeholder="/shop/ramadan..."
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-1 w-32 bg-admin-border rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-admin-accent animate-progress origin-left" />
      </div>
      <p className="p-20 text-center uppercase tracking-[0.5em] text-admin-muted font-black animate-pulse text-[10px]">Syncing Banner Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto space-y-24 animate-in fade-in zoom-in-95 duration-1000 pb-40 px-4">
      <div className="flex items-end justify-between border-b border-admin-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-admin-accent text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-admin-accent/30">System v4.0</span>
            <div className="h-0.5 w-12 bg-admin-border rounded-full" />
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-white selection:bg-admin-accent">Banner Commander</h2>
          <p className="text-[14px] text-admin-muted uppercase tracking-[0.4em] font-bold">Homepage Visual Narrative Orchestrator</p>
        </div>
        <button 
          onClick={loadAssets}
          className="p-4 bg-admin-card border border-admin-border rounded-2xl hover:rotate-180 transition-all duration-1000 active:scale-90 shadow-2xl hover:border-admin-accent group"
        >
          <RefreshCw size={24} className="text-admin-muted group-hover:text-admin-accent transition-colors" />
        </button>
      </div>

      {/* Hero Section */}
      <SingleAssetSection 
        title="Main Hero Landing Commander"
        bannerKey="hero_banner"
        textKey="hero_text"
        linkKey="hero_link"
      />

      {/* Discover More */}
      <div className="pt-12">
        <BannerSection 
          title="Discover More Horizontal Cluster" 
          assetKey="discover_more" 
          icon={ImageIcon} 
        />
      </div>

      {/* Ramadan Essentials */}
      <div className="border-t border-admin-border pt-20">
        <BannerSection 
          title="Ramadan Essentials Grid Nodes" 
          assetKey="ramadan_essentials" 
          icon={Layers} 
          showTitle={true}
        />
      </div>

      {/* Featured Large Banners */}
      <div className="border-t border-admin-border pt-20">
        <BannerSection 
          title="Featured Dual-Promo Segments" 
          assetKey="dual_banners" 
          icon={Layout} 
        />
      </div>
    </div>
  );
};

export default BannersView;
