import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Hexagon, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Hash,
  Palette,
  Maximize2
} from 'lucide-react';
import { api } from '../../utils/api';

const AttributesView = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttributes = async () => {
    setLoading(true);
    try {
      const data = await api.attributes.getAll();
      const core = [
        { name: 'Color Library', type: 'color', values: ['#000000', '#F5F5DC'] },
        { name: 'Size Archetypes', type: 'size', values: ['S', 'M', 'L', 'XL'] },
        { name: 'Material Ledger', type: 'text', values: ['Premium Nidha', 'Turkish Crepe'] }
      ];
      
      const merged = core.map(c => {
        const found = data.find(d => d.name === c.name);
        return found ? { ...c, ...found } : c;
      });
      
      setAttributes(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  const handleUpdate = async (name, type, values) => {
    try {
      await api.attributes.create({ name, type, values });
      loadAttributes();
    } catch (err) {
      console.error(err);
    }
  };

  const getAttr = (name) => attributes.find(a => a.name === name) || { values: [] };

  const removeValue = (name, type, value) => {
    const attr = getAttr(name);
    const updated = attr.values.filter(v => v !== value);
    handleUpdate(name, type, updated);
  };

  const addValue = (name, type) => {
    const val = prompt(`Add new value for ${name}:`);
    if (val) {
      const attr = getAttr(name);
      handleUpdate(name, type, [...attr.values, val]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Global Attribute Matrix</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Configure master properties for variant generation and catalog scaling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-20 text-center uppercase tracking-widest text-admin-muted font-black">Syncing Matrix...</div>
        ) : (
          <>
            {/* Colors Palette */}
            <div className="bg-admin-card border border-admin-border rounded-xl p-6 space-y-4">
               <div className="flex items-center justify-between border-b border-admin-border pb-3">
                  <h3 className="text-[13px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
                     <Palette size={14} /> Color Library
                  </h3>
                  <Plus size={14} onClick={() => addValue('Color Library', 'color')} className="text-admin-muted cursor-pointer hover:text-white transition-colors" />
               </div>
               <div className="flex flex-wrap gap-2">
                  {getAttr('Color Library').values.map(c => (
                     <div key={c} className="group relative">
                        <div className="w-10 h-10 rounded-xl border border-admin-border shadow-sm" style={{ backgroundColor: c }} />
                        <button onClick={() => removeValue('Color Library', 'color', c)} className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75"><Trash2 size={10} /></button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Sizes Matrix */}
            <div className="bg-admin-card border border-admin-border rounded-xl p-6 space-y-4">
               <div className="flex items-center justify-between border-b border-admin-border pb-3">
                  <h3 className="text-[13px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
                     <Maximize2 size={14} /> Size Archetypes
                  </h3>
                  <Plus size={14} onClick={() => addValue('Size Archetypes', 'size')} className="text-admin-muted cursor-pointer hover:text-white transition-colors" />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  {getAttr('Size Archetypes').values.map(s => (
                     <div key={s} className="flex items-center justify-between bg-admin-bg/50 border border-admin-border px-3 py-2 rounded-lg group">
                        <span className="text-[14px] font-black">{s}</span>
                        <Trash2 onClick={() => removeValue('Size Archetypes', 'size', s)} size={10} className="text-admin-muted opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-400 transition-all" />
                     </div>
                  ))}
               </div>
            </div>

            {/* Fabric Registry */}
            <div className="bg-admin-card border border-admin-border rounded-xl p-6 space-y-4">
               <div className="flex items-center justify-between border-b border-admin-border pb-3">
                  <h3 className="text-[13px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
                     <Layers size={14} /> Material Ledger
                  </h3>
                  <Plus size={14} onClick={() => addValue('Material Ledger', 'text')} className="text-admin-muted cursor-pointer hover:text-white transition-colors" />
               </div>
               <div className="space-y-2">
                  {getAttr('Material Ledger').values.map(f => (
                     <div key={f} className="flex items-center justify-between bg-admin-bg/50 border border-admin-border px-3 py-2 rounded-lg group">
                        <span className="text-[14px] font-bold">{f}</span>
                        <Trash2 onClick={() => removeValue('Material Ledger', 'text', f)} size={10} className="text-admin-muted opacity-0 group-hover:opacity-100 cursor-pointer hover:text-rose-400 transition-all" />
                     </div>
                  ))}
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttributesView;
