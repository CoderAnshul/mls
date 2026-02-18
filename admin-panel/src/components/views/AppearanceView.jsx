import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon, 
  Save,
  RefreshCw,
  Globe,
  Monitor,
  Layers,
  Layout
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const AppearanceView = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/home-assets`);
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      toast.error('Failed to sync design assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleUpdate = async (key, value) => {
    setSaving(true);
    try {
      const asset = assets.find(a => a.key === key);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/home-assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...asset, value })
      });
      if (!res.ok) throw new Error();
      toast.success(`${key.replace('_', ' ').toUpperCase()} updated successfully`);
      loadAssets();
    } catch (err) {
      toast.error('Failed to save appearance change');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center uppercase tracking-widest text-admin-muted font-black">Scanning Visual Matrix...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Appearance Controller</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Manage sitewide aesthetics and hero compositions</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-admin-card rounded-full border border-admin-border">
              <Globe size={12} className="text-admin-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Live</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero management and other settings would normally go here */}
        <div className="p-10 border border-dashed border-admin-border rounded-2xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Sitewide Theme Settings</p>
          <p className="text-[13px] font-bold mt-2">Manage colors, typography and global styles</p>
        </div>
      </div>
    </div>
  );
};

export default AppearanceView;
