import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Package, 
  MoreVertical, 
  ChevronRight, 
  Plus, 
  Settings, 
  Trash2, 
  LayoutGrid, 
  Layers, 
  Hexagon,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ChevronDown,
  Upload,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { api } from '../../utils/api';

// ─── Excel Import Component ───────────────────────────────────────────────────
const ExcelImportModal = ({ onClose, onSuccess }) => {
  const fileRef = useRef();
  const [status, setStatus] = useState('idle'); // idle | preview | importing | done
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState({ ok: 0, fail: 0, errors: [] });

  const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
      setRows(data);
      setStatus('preview');
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleImport = async () => {
    setStatus('importing');
    let ok = 0, fail = 0;
    const errors = [];
    for (const row of rows) {
      try {
        const product = {
          title: row.title || row.Title || '',
          slug: row.slug || row.Slug || '',
          price: parseFloat(row.price || row.Price || 0),
          discount: parseInt(row.discount || row.Discount || 0),
          category: row.category || row.Category || 'Uncategorized',
          subCategory: row.subCategory || row.SubCategory || '',
          sku: row.sku || row.SKU || '',
          stock: parseInt(row.stock || row.Stock || 0),
          sizes: (row.sizes || row.Sizes || '').toString().split(',').map(s => s.trim()).filter(Boolean),
          colors: (row.colors || row.Colors || '').toString().split(',').map(c => c.trim()).filter(Boolean),
          coverImage: row.coverImage || row.CoverImage || '',
          hoverImage: row.hoverImage || row.HoverImage || '',
          gallery: (row.gallery || row.Gallery || '').toString().split('|').map(u => u.trim()).filter(Boolean),
          description: row.description || row.Description || '',
          fabricDetails: row.fabricDetails || row.FabricDetails || '',
          careInstructions: row.careInstructions || row.CareInstructions || '',
          fitInfo: row.fitInfo || row.FitInfo || '',
          isNew: (row.isNew || row.IsNew || '').toString().toLowerCase() === 'true',
        };
        if (!product.title) throw new Error('Missing title');
        await api.products.create(product);
        ok++;
      } catch (err) {
        fail++;
        errors.push(`Row "${row.title || '?'}": ${err.message}`);
      }
    }
    setResults({ ok, fail, errors });
    setStatus('done');
    if (ok > 0) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={18} className="text-emerald-400" />
            <h2 className="text-[13px] font-black uppercase tracking-widest">Excel Bulk Import</h2>
          </div>
          <button onClick={onClose} className="text-admin-muted hover:text-white transition-colors"><XCircle size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {status === 'idle' && (
            <>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-admin-border rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
              >
                <Upload size={32} className="text-admin-muted group-hover:text-emerald-400 transition-colors" />
                <div className="text-center">
                  <p className="text-[13px] font-black uppercase tracking-widest">Drop your Excel file here</p>
                  <p className="text-[11px] text-admin-muted mt-1">or click to browse — .xlsx / .xls / .csv</p>
                </div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files[0] && parseFile(e.target.files[0])} />
              </div>

              {/* Column Reference */}
              <div className="bg-admin-bg border border-admin-border rounded-xl p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-3">Required & Optional Columns</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
                  {[
                    ['title', 'required', 'Product name'],
                    ['price', 'required', 'Number (e.g. 185.00)'],
                    ['category', 'required', 'Category name'],
                    ['stock', 'required', 'Quantity (e.g. 100)'],
                    ['slug', 'optional', 'Auto-generated if blank'],
                    ['discount', 'optional', 'Discount % (e.g. 10)'],
                    ['sku', 'optional', 'e.g. MLS-SAT-001'],
                    ['sizes', 'optional', 'Comma-separated: S,M,L'],
                    ['colors', 'optional', 'Hex codes: #000,#FFF'],
                    ['coverImage', 'optional', 'Image URL'],
                    ['hoverImage', 'optional', 'Hover image URL'],
                    ['gallery', 'optional', 'Pipe-separated URLs'],
                    ['description', 'optional', 'Product description'],
                    ['fabricDetails', 'optional', 'Fabric composition'],
                    ['careInstructions', 'optional', 'Care guidance'],
                    ['fitInfo', 'optional', 'Fit description'],
                    ['isNew', 'optional', 'true or false'],
                  ].map(([col, type, hint]) => (
                    <div key={col} className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${type === 'required' ? 'bg-rose-500/20 text-rose-400' : 'bg-admin-border text-admin-muted'}`}>{type}</span>
                      <span className="font-mono font-bold text-white">{col}</span>
                      <span className="text-admin-muted truncate">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {status === 'preview' && (
            <>
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-[12px] font-bold">
                  <span className="text-emerald-400">{rows.length} products</span> ready to import
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto border border-admin-border rounded-xl divide-y divide-admin-border">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 text-[12px]">
                    <span className="font-bold truncate max-w-[60%]">{r.title || r.Title || `Row ${i + 1}`}</span>
                    <span className="text-admin-muted font-mono">£{parseFloat(r.price || r.Price || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStatus('idle')} className="flex-1 py-3 border border-admin-border rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-admin-bg transition-all">Back</button>
                <button onClick={handleImport} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
                  Import {rows.length} Products
                </button>
              </div>
            </>
          )}

          {status === 'importing' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-12 h-12 border-4 border-admin-border border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-[12px] font-black uppercase tracking-widest text-admin-muted">Importing products...</p>
            </div>
          )}

          {status === 'done' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <p className="text-3xl font-black text-emerald-400">{results.ok}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-admin-muted mt-1">Imported</p>
                </div>
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center">
                  <p className="text-3xl font-black text-rose-400">{results.fail}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-admin-muted mt-1">Failed</p>
                </div>
              </div>
              {results.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto bg-admin-bg border border-rose-500/20 rounded-xl p-3 space-y-1">
                  {results.errors.map((e, i) => (
                    <p key={i} className="text-[11px] text-rose-400 font-mono">{e}</p>
                  ))}
                </div>
              )}
              <button onClick={onClose} className="w-full py-3 bg-admin-accent text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Done</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export const InventoryView = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Erase this asset from master registry?')) {
      try {
        await api.products.delete(id);
        loadProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (editingProduct || onEdit === true) {
    return <ProductForm 
      product={editingProduct} 
      onCancel={() => {
        setEditingProduct(null);
        if (typeof onEdit === 'function') onEdit();
        loadProducts();
      }} 
    />;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Product Catalog</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Manage global inventory and product master data</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
             <Search size={14} className="text-admin-muted" />
             <input type="text" placeholder="SKU or Name..." className="bg-transparent border-none outline-none text-[13px] w-40 font-bold" />
           </div>
           <button className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all">
             <Filter size={14} /> Filter
           </button>
           <button
             onClick={() => setShowImport(true)}
             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 transition-all"
           >
             <Upload size={14} /> Import Excel
           </button>
           <button onClick={() => setEditingProduct(null) || onEdit()} className="flex items-center gap-2 bg-admin-accent px-3 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest text-white shadow-lg shadow-admin-accent/20">
             <Plus size={14} /> Add Product
           </button>
        </div>
      </div>

      {showImport && (
        <ExcelImportModal
          onClose={() => setShowImport(false)}
          onSuccess={() => { setShowImport(false); loadProducts(); }}
        />
      )}

      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-admin-border bg-admin-bg" /></th>
              <th>Product Details</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price/Disc.</th>
              <th>Stock (Left/Total)</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-20 text-center uppercase tracking-widest text-admin-muted font-black">Loading Assets...</td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id || p.id} className="group hover:bg-admin-bg transition-colors">
                  <td className="px-4 py-2.5"><input type="checkbox" className="rounded border-admin-border bg-admin-bg" /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <img src={p.coverImage || p.images?.[0] || '/img/placeholder-product.jpg'} className="w-10 h-10 rounded-lg object-cover border border-admin-border shadow-sm" alt="" />
                      <span className="font-bold text-[14px] tracking-tight">{p.title || p.name} <span className="text-admin-muted ml-2 font-mono text-[12px]">ID:{(p._id || p.id).substring(0, 8)}</span></span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[13px] font-bold text-admin-muted">{p.sku || `MLS-PROD-${(p._id || p.id).substring(0, 4)}`}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[12px] font-black py-0.5 px-2 bg-admin-bg border border-admin-border rounded-md text-admin-muted tracking-widest uppercase">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px]">£{p.price.toFixed(2)}</span>
                      {p.discount && <span className="text-[12px] text-rose-400 font-bold">-{p.discount}% Off</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="w-28 space-y-1.5">
                      <div className="flex justify-between text-[12px] font-black uppercase">
                        <span className={(p.stock || p.stockLeft) < 20 ? 'text-rose-400' : 'text-emerald-400'}>{p.stock || p.stockLeft || 0} Left</span>
                        <span className="text-admin-muted">{p.totalStock || p.stock || 100} Total</span>
                      </div>
                      <div className="h-1 w-full bg-admin-bg border border-admin-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${(p.stock || p.stockLeft) < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${((p.stock || p.stockLeft) / (p.totalStock || p.stock || 100)) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className={`flex items-center gap-1.5 text-[12px] font-black uppercase ${(p.stock || p.stockLeft) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {(p.stock || p.stockLeft) > 0 ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      {(p.stock || p.stockLeft) > 0 ? 'Active' : 'Stock Out'}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(p)} className="p-1.5 rounded-lg border border-admin-border hover:bg-admin-card text-admin-muted hover:text-white transition-all"><Settings size={14} /></button>
                      <button onClick={() => handleDelete(p._id || p.id)} className="p-1.5 rounded-lg border border-admin-border hover:border-rose-500/50 text-admin-muted hover:text-rose-400 transition-all"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-20 text-center uppercase tracking-widest text-admin-muted font-black">No Products in Registry</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-admin-border flex items-center justify-between text-[10px] font-bold text-admin-muted uppercase tracking-widest bg-admin-bg/30">
          <div>Showing 1-{products.length} of {products.length} Items</div>
          <div className="flex gap-1">
             <button className="px-2 py-1 rounded bg-admin-card border border-admin-border text-white">1</button>
             <button className="px-2 py-1 rounded hover:bg-admin-card transition-colors">2</button>
             <button className="px-2 py-1 rounded hover:bg-admin-card transition-colors">3</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductForm = ({ product, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    subCategory: '',
    sku: '',
    stock: '',
    sizes: ['S', 'M', 'L'],
    colors: ['#000000'],
    coverImage: '',
    hoverImage: '',
    gallery: [],
    fabricDetails: '',
    careInstructions: '',
    fitInfo: '',
    wearWith: []
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price || '',
        discount: product.discount || '',
        stock: product.stock || '',
        wearWith: product.wearWith ? product.wearWith.map(p => typeof p === 'object' ? p._id : p) : []
      });
    }
  }, [product]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          api.categories.getAll(),
          api.products.getAll()
        ]);
        setCategories(cats);
        setAllProducts(prods.filter(p => p._id !== (product?._id || product?.id)));
        if (cats.length > 0 && !product) setFormData(prev => ({ ...prev, category: cats[0].name }));
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    loadData();
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : 0,
        images: [formData.coverImage, formData.hoverImage, ...formData.gallery].filter(Boolean)
      };
      
      if (product) {
        await api.products.update(product._id || product.id, productData);
      } else {
        await api.products.create(productData);
      }
      onCancel();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Error saving product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = (s) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) 
        ? prev.sizes.filter(size => size !== s) 
        : [...prev.sizes, s]
    }));
  };

  const toggleWearWith = (id) => {
    setFormData(prev => ({
      ...prev,
      wearWith: prev.wearWith.includes(id)
        ? prev.wearWith.filter(i => i !== id)
        : [...prev.wearWith, id]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between border-b border-admin-border pb-4 bg-admin-bg sticky top-0 z-10 py-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase">{product ? 'Edit Master Record' : 'Master Catalog Entry'}</h2>
          <p className="text-[10px] text-admin-muted uppercase tracking-widest font-bold mt-1">Configure global product attributes and operations</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-admin-border text-[10px] font-black uppercase tracking-widest hover:bg-admin-card transition-all">Discard</button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-admin-accent text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20 transition-all disabled:opacity-50">
            {loading ? 'Processing...' : product ? 'Update Registry' : 'Publish Master'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-admin-muted border-b border-admin-border pb-3">Identity & Content</h3>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Product Name</label>
                   <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                    placeholder="e.g. LUXURY SATIN ABAYA" 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg focus:border-admin-accent outline-none text-xs font-bold transition-all" 
                  />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Custom Slug (Optional)</label>
                   <input 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="luxury-satin-abaya" 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg focus:border-admin-accent outline-none text-xs font-mono" 
                  />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Master Description</label>
                 <textarea 
                  rows={4} 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed product narrative..." 
                  className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg focus:border-admin-accent outline-none text-xs font-medium transition-all resize-none" 
                />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Base Price (£)</label>
                   <input 
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                    placeholder="185.00" 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg focus:border-admin-accent outline-none text-xs font-bold" 
                  />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Discount (%)</label>
                   <input 
                    type="number" 
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    placeholder="10" 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg focus:border-admin-accent outline-none text-xs font-bold border-rose-500/30" 
                  />
                 </div>
               </div>
            </div>
          </div>

          {/* Visual Assets */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-admin-muted border-b border-admin-border pb-3">Visual Media Registry</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Cover Image (Default)</label>
                 <input 
                  type="text" 
                  value={formData.coverImage}
                  onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  placeholder="https://... cover.jpg" 
                  className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-mono" 
                />
                {formData.coverImage && <img src={formData.coverImage} className="w-full h-32 object-cover rounded-lg border border-admin-border" />}
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Hover Image (Secondary)</label>
                 <input 
                  type="text" 
                  value={formData.hoverImage}
                  onChange={e => setFormData({...formData, hoverImage: e.target.value})}
                  placeholder="https://... hover.jpg" 
                  className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-mono" 
                />
                {formData.hoverImage && <img src={formData.hoverImage} className="w-full h-32 object-cover rounded-lg border border-admin-border" />}
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Gallery Showcase</label>
               <div className="grid grid-cols-4 gap-2">
                 {formData.gallery.map((url, i) => (
                   <div key={i} className="relative group">
                     <img src={url} className="w-full h-20 object-cover rounded-lg border border-admin-border" />
                     <button 
                      type="button" 
                      onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx) => idx !== i)})}
                      className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><XCircle size={10} /></button>
                   </div>
                 ))}
                 <button 
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter Image URL:');
                    if (url) setFormData({...formData, gallery: [...formData.gallery, url]});
                  }}
                  className="w-full h-20 rounded-lg border border-dashed border-admin-border flex flex-col items-center justify-center text-admin-muted hover:border-admin-accent hover:text-admin-accent transition-all">
                   <Plus size={16} />
                   <span className="text-[8px] font-black uppercase mt-1">Add Shot</span>
                 </button>
               </div>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[14px] font-black uppercase tracking-widest text-admin-muted border-b border-admin-border pb-3">Technical Specifications</h3>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Fabric & Composition</label>
                 <textarea 
                  rows={2} 
                  value={formData.fabricDetails}
                  onChange={e => setFormData({...formData, fabricDetails: e.target.value})}
                  placeholder="e.g. 100% Nidha Silk with premium lace borders..." 
                  className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-medium" 
                />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Care Instructions</label>
                   <textarea 
                    rows={3} 
                    value={formData.careInstructions}
                    onChange={e => setFormData({...formData, careInstructions: e.target.value})}
                    placeholder="Dry clean only..." 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-medium" 
                  />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Size & Fit Info</label>
                   <textarea 
                    rows={3} 
                    value={formData.fitInfo}
                    onChange={e => setFormData({...formData, fitInfo: e.target.value})}
                    placeholder="Regular fit. Model is 5'8 wearing size M..." 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-medium" 
                  />
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Attributes */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-admin-muted border-b border-admin-border pb-3">Operational Meta</h3>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">SKU ID</label>
                 <input 
                  type="text" 
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  placeholder="MLS-SAT-2026-X" 
                  className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg font-mono text-[10px] font-bold" 
                />
               </div>
               <div className="grid grid-cols-1 gap-4">
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Main Category</label>
                   <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-bold appearance-none outline-none focus:border-admin-accent">
                      {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Initial Batch Quantity</label>
                   <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    required
                    placeholder="500" 
                    className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-bold focus:border-admin-accent outline-none" 
                  />
                 </div>
               </div>
               
               <div className="space-y-3">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Size Options</label>
                 <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL', 'ONESIZE'].map(s => (
                       <button 
                        key={s} 
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`px-2 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${formData.sizes.includes(s) ? 'bg-admin-accent border-admin-accent text-white' : 'border-admin-border text-admin-muted hover:bg-admin-bg'}`}>
                         {s}
                       </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em]">Active Palette</label>
                 <div className="flex flex-wrap gap-2">
                   {formData.colors.map((c, i) => (
                     <div key={i} className="group relative">
                       <div className="w-6 h-6 rounded-lg border-2 border-admin-bg shadow-sm" style={{ backgroundColor: c }} />
                       <button 
                        type="button"
                        onClick={() => {
                          const newColors = [...formData.colors];
                          newColors.splice(i, 1);
                          setFormData({...formData, colors: newColors});
                        }}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={8} /></button>
                     </div>
                   ))}
                   <button 
                    type="button"
                    onClick={() => {
                      const color = prompt('Enter Hex Color:', '#000000');
                      if (color) setFormData({...formData, colors: [...formData.colors, color]});
                    }}
                    className="w-6 h-6 rounded-lg border border-dashed border-admin-border flex items-center justify-center text-admin-muted hover:border-admin-accent hover:text-admin-accent transition-colors"><Plus size={12} /></button>
                 </div>
               </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-admin-muted border-b border-admin-border pb-3">"Wear With" Recommendations</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {allProducts.map(p => (
                <div 
                  key={p._id} 
                  onClick={() => toggleWearWith(p._id)}
                  className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${formData.wearWith.includes(p._id) ? 'bg-admin-accent/10 border-admin-accent' : 'bg-admin-bg border-admin-border hover:border-admin-muted'}`}
                >
                  <img src={p.coverImage || p.images?.[0] || '/img/placeholder-product.jpg'} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-tight leading-none">{p.title}</p>
                    <p className="text-[8px] text-admin-muted font-bold mt-1">£{p.price.toFixed(2)}</p>
                  </div>
                  {formData.wearWith.includes(p._id) && <CheckCircle2 size={12} className="text-admin-accent" />}
                </div>
              ))}
            </div>
            <p className="text-[8px] text-admin-muted italic font-bold text-center">Select products to appear as recommendations on the detail page.</p>
          </div>
        </div>
      </div>
    </form>
  );
};
