import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle2,
  XCircle,
  Link,
  Mail,
  Phone,
  FileText,
  Hash,
  ToggleLeft,
  ToggleRight,
  Search,
  AlertCircle,
  Package
} from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

/* ─── Form Modal (Add / Edit) ────────────────────────────────────────────────── */
const PartnerModal = ({ partner, onClose, onSaved }) => {
  const toast = useToast();
  const isEditing = !!partner;

  const [form, setForm] = useState({
    name: partner?.name || '',
    code: partner?.code || '',
    trackingUrl: partner?.trackingUrl || '',
    contactEmail: partner?.contactEmail || '',
    contactPhone: partner?.contactPhone || '',
    notes: partner?.notes || '',
    isActive: partner?.isActive ?? true
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Name and code are required');
      return;
    }
    try {
      setSaving(true);
      if (isEditing) {
        await api.deliveryPartners.update(partner._id, form);
        toast.success('Delivery partner updated');
      } else {
        await api.deliveryPartners.create(form);
        toast.success('Delivery partner added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error('Failed to save delivery partner');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#09090B]/90 backdrop-blur-md animate-in fade-in duration-300 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-admin-card border border-admin-border rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border bg-gradient-to-r from-admin-accent/10 to-admin-card">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-admin-accent/20 rounded-lg text-admin-accent">
                <Truck size={18} />
             </div>
             <div>
                <h3 className="text-[14px] font-black uppercase tracking-tight">{partner ? 'Edit Delivery Partner' : 'Initialize Partner'}</h3>
                <p className="text-[10px] text-admin-muted font-black uppercase tracking-widest">Protocol Sync Settings</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-admin-bg rounded-lg transition-colors border border-admin-border">
            <X size={16} className="text-admin-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest ml-1">Partner Identity</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. DHL Express Global"
                className="w-full bg-admin-bg border border-admin-border px-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[13px] font-bold shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest ml-1">Base Protocol Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted font-bold text-[13px]">£</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.shippingFee}
                    onChange={(e) => set('shippingFee', e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border pl-8 pr-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[13px] font-mono shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest ml-1">Min Threshold</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted font-bold text-[13px]">£</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.freeShippingThreshold}
                    onChange={(e) => set('freeShippingThreshold', e.target.value)}
                    className="w-full bg-admin-bg border border-admin-border pl-8 pr-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[13px] font-mono shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest ml-1">Service SLA (Est. Delivery)</label>
              <input
                required
                type="text"
                value={form.estimatedDelivery}
                onChange={(e) => set('estimatedDelivery', e.target.value)}
                placeholder="e.g. 3-5 Working Days"
                className="w-full bg-admin-bg border border-admin-border px-4 py-2.5 rounded-xl focus:border-admin-accent outline-none text-[13px] font-bold shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-admin-bg border border-admin-border rounded-xl shadow-inner group transition-all hover:border-admin-accent/30">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${form.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-admin-muted opacity-30'}`} />
                <span className="text-[11px] font-black uppercase text-white tracking-widest">Active Status</span>
              </div>
              <div 
                onClick={() => set('isActive', !form.isActive)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-1.5">
              <FileText size={11} /> Notes
            </label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any internal notes about this carrier..."
              rows={2}
              className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[13px] font-bold outline-none focus:ring-1 focus:ring-admin-accent placeholder:text-admin-muted/40 resize-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-admin-border text-[13px] font-black uppercase tracking-widest hover:bg-admin-border transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-admin-accent text-white text-[13px] font-black uppercase tracking-widest hover:bg-admin-accent/90 transition-all shadow-lg shadow-admin-accent/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  {isEditing ? 'Save Changes' : 'Add Partner'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

/* ─── Main ShippingView ──────────────────────────────────────────────────────── */
const ShippingView = () => {
  const toast = useToast();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode, obj = edit mode
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await api.deliveryPartners.getAll();
      setPartners(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load delivery partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleToggleActive = async (partner) => {
    try {
      setTogglingId(partner._id);
      await api.deliveryPartners.update(partner._id, { ...partner, isActive: !partner.isActive });
      toast.success(`${partner.name} ${!partner.isActive ? 'activated' : 'deactivated'}`);
      fetchPartners();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await api.deliveryPartners.delete(id);
      toast.success('Delivery partner deleted');
      fetchPartners();
    } catch {
      toast.error('Failed to delete partner');
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (p) => { setEditTarget(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = partners.filter(p => p.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-admin-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Delivery Partners</h2>
          <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">
            Manage carriers used to dispatch orders
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-admin-card border border-admin-border px-3 py-1.5 rounded-lg">
            <Search size={14} className="text-admin-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search carriers..."
              className="bg-transparent border-none outline-none text-[13px] w-36 font-bold placeholder:text-admin-muted/50"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-admin-accent text-white px-4 py-1.5 rounded-lg text-[13px] font-black uppercase tracking-widest shadow-lg shadow-admin-accent/20 hover:bg-admin-accent/90 transition-all"
          >
            <Plus size={14} /> Add Partner
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Partners', value: partners.length, color: 'text-white' },
          { label: 'Active', value: activeCount, color: 'text-emerald-400' },
          { label: 'Inactive', value: partners.length - activeCount, color: 'text-amber-400' }
        ].map(stat => (
          <div key={stat.label} className="bg-admin-card border border-admin-border rounded-xl p-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-admin-muted">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-admin-card border border-admin-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left density-table">
          <thead>
            <tr>
              <th>Carrier</th>
              <th>Code</th>
              <th>Tracking URL</th>
              <th>Contact</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-admin-muted font-bold uppercase tracking-widest">
                  Loading Partners...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center gap-3 text-admin-muted">
                    <Truck size={32} className="opacity-30" />
                    <p className="font-bold uppercase tracking-widest text-[13px]">
                      {search ? 'No carriers match your search' : 'No delivery partners yet'}
                    </p>
                    {!search && (
                      <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-admin-accent text-white px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest mt-1 hover:bg-admin-accent/90 transition-all"
                      >
                        <Plus size={12} /> Add Your First Partner
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p._id} className="group hover:bg-admin-bg transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-admin-bg border border-admin-border flex items-center justify-center">
                      <Truck size={15} className="text-admin-muted" />
                    </div>
                    <div>
                      <p className="text-[14px] font-black">{p.name}</p>
                      {p.notes && <p className="text-[11px] text-admin-muted font-bold truncate max-w-[160px]">{p.notes}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-black text-[12px] px-2 py-0.5 bg-admin-bg border border-admin-border rounded text-admin-accent">
                    {p.code}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.trackingUrl ? (
                    <span className="text-[12px] font-bold text-blue-400 truncate block max-w-[200px]" title={p.trackingUrl}>
                      {p.trackingUrl}
                    </span>
                  ) : (
                    <span className="text-[12px] text-admin-muted font-bold">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    {p.contactEmail && (
                      <p className="text-[12px] font-bold text-admin-muted flex items-center gap-1">
                        <Mail size={10} /> {p.contactEmail}
                      </p>
                    )}
                    {p.contactPhone && (
                      <p className="text-[12px] font-bold text-admin-muted flex items-center gap-1">
                        <Phone size={10} /> {p.contactPhone}
                      </p>
                    )}
                    {!p.contactEmail && !p.contactPhone && (
                      <span className="text-[12px] text-admin-muted font-bold">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(p)}
                    disabled={togglingId === p._id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all border ${
                      p.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-admin-bg text-admin-muted border-admin-border hover:bg-admin-border'
                    }`}
                  >
                    {togglingId === p._id ? (
                      <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : p.isActive ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <XCircle size={11} />
                    )}
                    {p.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg border border-admin-border hover:bg-admin-accent hover:text-white hover:border-admin-accent transition-all text-admin-muted"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      disabled={deletingId === p._id}
                      className="p-1.5 rounded-lg border border-admin-border hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all text-admin-muted disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === p._id
                        ? <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        : <Trash2 size={13} />
                      }
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helper tip */}
      {partners.length > 0 && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-admin-card border border-admin-border text-[12px] font-bold text-admin-muted">
          <AlertCircle size={14} className="shrink-0 mt-0.5 text-blue-400" />
          <p>
            Only <span className="text-white">Active</span> partners appear in the dispatch modal when shipping an order.
            Use the toggle button to activate or deactivate a carrier without deleting it.
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <PartnerModal
          partner={editTarget}
          onClose={closeModal}
          onSaved={fetchPartners}
        />
      )}
    </div>
  );
};

export default ShippingView;
