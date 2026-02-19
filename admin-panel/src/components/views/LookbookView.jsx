import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const LookbookView = () => {
    const toast = useToast();
    const [lookbooks, setLookbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', images: [], isActive: true });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadLookbooks();
    }, []);

    const loadLookbooks = async () => {
        setLoading(true);
        try {
            const data = await api.lookbooks.getAll();
            setLookbooks(data);
        } catch (err) {
            toast.error("Failed to load lookbooks");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = files.map(file => api.journals.uploadImage(file));
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(res => res.url);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newUrls]
            }));
            toast.success(`${files.length} images uploaded`);
        } catch (err) {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || formData.images.length === 0) {
            toast.error("Title and at least one image are required");
            return;
        }

        try {
            if (editingId) {
                await api.lookbooks.update(editingId, formData);
                toast.success("Lookbook updated");
            } else {
                await api.lookbooks.create(formData);
                toast.success("Lookbook created");
            }
            setIsEditing(false);
            setEditingId(null);
            setFormData({ title: '', images: [], isActive: true });
            loadLookbooks();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleEdit = (lb) => {
        setFormData({ title: lb.title, images: lb.images, isActive: lb.isActive });
        setEditingId(lb._id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this lookbook?")) {
            try {
                await api.lookbooks.delete(id);
                toast.success("Lookbook deleted");
                loadLookbooks();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    if (isEditing) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between border-b border-admin-border pb-4">
                    <h2 className="text-xl font-black uppercase tracking-tight">
                        {editingId ? 'Edit Lookbook' : 'New Lookbook'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setIsEditing(false); setEditingId(null); }}
                            className="px-4 py-2 rounded-lg border border-admin-border text-[10px] font-black uppercase"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded-lg bg-admin-accent text-white text-[10px] font-black uppercase shadow-lg shadow-admin-accent/20"
                        >
                            {editingId ? 'Update' : 'Save Lookbook'}
                        </button>
                    </div>
                </div>

                <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-admin-muted uppercase tracking-widest">Lookbook Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Summer Collection 2024"
                            className="w-full bg-admin-bg border border-admin-border px-4 py-3 rounded-xl text-sm font-bold focus:border-admin-accent outline-none self-start"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-admin-muted uppercase tracking-widest">Gallery Images</label>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {formData.images.map((url, idx) => (
                                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-admin-border">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            <label className="aspect-[3/4] border-2 border-dashed border-admin-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-admin-accent hover:bg-admin-accent/5 transition-all group">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-admin-accent" />
                                ) : (
                                    <>
                                        <Plus className="text-admin-muted group-hover:text-admin-accent mb-2" />
                                        <span className="text-[10px] font-black text-admin-muted uppercase">Add Images</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-admin-bg/50 p-4 rounded-xl border border-admin-border w-fit">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-admin-border text-admin-accent focus:ring-0"
                        />
                        <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider cursor-pointer">Published & Visible</label>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-admin-border pb-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Lookbook Archive</h2>
                    <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Manage visual collections and campaigns</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-admin-accent px-4 py-2 rounded-xl text-[13px] font-black uppercase text-white shadow-lg shadow-admin-accent/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={16} /> New Lookbook
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center uppercase tracking-widest text-admin-muted font-black animate-pulse">Initializing Canvas...</div>
                ) : lookbooks.length > 0 ? (
                    lookbooks.map((lb) => (
                        <div key={lb._id} className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden group hover:border-admin-accent transition-all">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                {lb.images.length > 0 ? (
                                    <img src={lb.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={lb.title} />
                                ) : (
                                    <div className="w-full h-full bg-admin-bg flex items-center justify-center">
                                        <ImageIcon className="text-admin-muted" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(lb)}
                                        className="bg-black/50 p-2 rounded-lg backdrop-blur-sm text-white hover:text-admin-accent transition-colors"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lb._id)}
                                        className="bg-black/50 p-2 rounded-lg backdrop-blur-sm text-white hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        {lb.isActive ? (
                                            <span className="flex items-center gap-1 text-[8px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                <CheckCircle2 size={8} /> LIVE
                                            </span>
                                        ) : (
                                            <span className="text-[8px] font-black bg-white/10 text-white/40 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                DRAFT
                                            </span>
                                        )}
                                        <span className="text-[8px] font-black bg-black/40 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                                            {lb.images.length} IMAGES
                                        </span>
                                    </div>
                                    <h3 className="text-white font-black uppercase text-sm tracking-tight truncate">{lb.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-admin-card/50 border border-dashed border-admin-border rounded-3xl text-center">
                        <ImageIcon size={48} className="mx-auto text-admin-muted/20 mb-4" />
                        <p className="uppercase tracking-widest text-admin-muted font-black text-sm">No Lookbooks Found</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-admin-accent hover:underline"
                        >
                            Create your first collection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LookbookView;
