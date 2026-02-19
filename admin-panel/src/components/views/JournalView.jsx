import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import ImageUpload from './ImageUpload';
import { BookOpen, Plus, Trash2, Edit, CheckCircle2, Search, Eye } from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const JournalView = () => {
    const toast = useToast();
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', heroImage: '', isPublished: true });
    const [editorContent, setEditorContent] = useState({ time: Date.now(), blocks: [], version: '2.28.2' });
    const [editingSlug, setEditingSlug] = useState(null);
    const [heroImageFile, setHeroImageFile] = useState(null);

    useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        setLoading(true);
        try {
            const data = await api.journals.getAll();
            setJournals(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load journals archive");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let heroImageUrl = formData.heroImage;
            if (heroImageFile) {
                const uploadRes = await api.journals.uploadImage(heroImageFile);
                heroImageUrl = uploadRes.url;
            }
            console.log('Saving editorContent:', editorContent);
            const payload = {
                ...formData,
                heroImage: heroImageUrl,
                content: editorContent,
            };
            if (editingSlug) {
                await api.journals.update(editingSlug, payload);
                toast.success("Journal record updated successfully");
            } else {
                await api.journals.create(payload);
                toast.success("New journal added successfully");
            }
            setIsEditing(false);
            setEditingSlug(null);
            setHeroImageFile(null);
            setFormData({ title: '', slug: '', excerpt: '', heroImage: '', isPublished: true });
            setEditorContent({ time: Date.now(), blocks: [], version: '2.28.2' });
            loadJournals();
        } catch (err) {
            console.error(err);
            toast.error("Protocol failed: Check all mandatory fields");
        }
    };

    const handleEdit = (journal) => {
        setIsEditing(true);
        setEditingSlug(journal.slug);
        setFormData({
            title: journal.title,
            slug: journal.slug,
            excerpt: journal.excerpt,
            heroImage: journal.heroImage,
            isPublished: journal.isPublished,
        });
        setEditorContent(journal.content || { time: Date.now(), blocks: [], version: '2.28.2' });
        setHeroImageFile(null);
    };

    const handleDelete = async (slug) => {
        if (window.confirm('Are you sure you want to delete this journal?')) {
            try {
                await api.journals.delete(slug);
                toast.success("Journal record deleted successfully");
                loadJournals();
            } catch (err) {
                toast.error("Deletion protocol failed");
            }
        }
    };

    if (isEditing) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between border-b border-admin-border pb-4">
                    <h2 className="text-xl font-black uppercase tracking-tight">{editingSlug ? 'Edit Journal' : 'New Journal Entry'}</h2>
                    <div className="flex gap-2">
                        <button onClick={() => { setIsEditing(false); setEditingSlug(null); setHeroImageFile(null); }} className="px-4 py-2 rounded-lg border border-admin-border text-[10px] font-black uppercase">Cancel</button>
                        <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-admin-accent text-white text-[10px] font-black uppercase shadow-lg shadow-admin-accent/20">{editingSlug ? 'Update' : 'Publish Post'}</button>
                    </div>
                </div>

                <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-admin-muted uppercase">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    const update = { title };
                                    if (!editingSlug) {
                                        update.slug = title.toLowerCase()
                                            .replace(/[^a-z0-9]+/g, '-')
                                            .replace(/(^-|-$)/g, '');
                                    }
                                    setFormData({ ...formData, ...update });
                                }}
                                className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-admin-muted uppercase">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-bold"
                                disabled={!!editingSlug}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-admin-muted uppercase">Hero Image</label>
                        <ImageUpload
                            value={heroImageFile ? URL.createObjectURL(heroImageFile) : formData.heroImage}
                            onChange={setHeroImageFile}
                        />
                        {formData.heroImage && !heroImageFile && (
                            <img src={formData.heroImage} alt="Current Hero" className="h-16 mt-2 rounded-lg border border-admin-border" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-admin-muted uppercase">Excerpt</label>
                        <textarea
                            rows={3}
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-admin-muted uppercase">Published</label>
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="mr-2"
                        />
                        <span className="text-xs">Is Published</span>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-admin-muted uppercase">Content</label>
                        <div className="bg-admin-bg border border-admin-border rounded-lg min-h-[400px]">
                            <Editor
                                data={editorContent}
                                onChange={(data) => setEditorContent(data)}
                                holder="journal-content-editor"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-admin-border pb-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Journal Management</h2>
                    <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Editorial content and fashion narratives</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-admin-accent px-3 py-1.5 rounded-lg text-[13px] font-black uppercase text-white shadow-lg shadow-admin-accent/20">
                    <Plus size={14} /> New Entry
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center uppercase tracking-widest text-admin-muted font-black">Scanning Archives...</div>
                ) : journals.length > 0 ? (
                    journals.map((j) => (
                        <div key={j._id} className="bg-admin-card border border-admin-border rounded-2xl overflow-hidden group hover:border-admin-accent transition-all">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={j.heroImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={j.title} />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={`${window.location.origin.replace('5173', '5174')}/journal/${j.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-black/50 p-2 rounded-lg backdrop-blur-sm hover:text-cyan-400 transition-colors"
                                    >
                                        <Eye size={14} />
                                    </a>
                                    <button className="bg-black/50 p-2 rounded-lg backdrop-blur-sm hover:text-admin-accent transition-colors" onClick={() => handleEdit(j)}><Edit size={14} /></button>
                                    <button className="bg-black/50 p-2 rounded-lg backdrop-blur-sm hover:text-rose-500 transition-colors" onClick={() => handleDelete(j.slug)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-admin-accent uppercase tracking-widest">PUBLISHED</span>
                                    <span className="text-[10px] font-bold text-admin-muted">{new Date(j.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-[14px] font-black truncate">{j.title}</h3>
                                <p className="text-[12px] text-admin-muted line-clamp-2 leading-relaxed">{j.excerpt}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center uppercase tracking-widest text-admin-muted font-black">No Editorial Record Found</div>
                )}
            </div>
        </div>
    );
};

export default JournalView;
