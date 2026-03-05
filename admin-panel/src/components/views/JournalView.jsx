import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import ImageUpload from './ImageUpload';
import { BookOpen, Plus, Trash2, Edit, Eye, Link, Type, Calendar, Image as ImageIcon, AlignLeft, ExternalLink, ToggleLeft, ToggleRight, Search, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';

const EMPTY_FORM = {
    title: '',
    slug: '',
    excerpt: '',
    introText: '',
    heroImage: '',
    ctaText: 'View Collection',
    ctaLink: '/collections/all',
    ctaImage: '',
    footerImage: '',
    date: new Date().toISOString().split('T')[0],
    isPublished: true
};

const JournalView = () => {
    const toast = useToast();
    const [journals, setJournals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editorContent, setEditorContent] = useState({ time: Date.now(), blocks: [], version: '2.28.2' });
    const [editingSlug, setEditingSlug] = useState(null);
    const [activeSection, setActiveSection] = useState('meta'); 

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

    const handleCancel = () => {
        setIsEditing(false);
        setEditingSlug(null);
        setFormData(EMPTY_FORM);
        setEditorContent({ time: Date.now(), blocks: [], version: '2.28.2' });
        setActiveSection('meta');
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.slug) {
            toast.error("Title and Slug are required fields");
            return;
        }
        try {
            const payload = {
                ...formData,
                content: editorContent,
            };
            if (editingSlug) {
                await api.journals.update(editingSlug, payload);
                toast.success("Journal updated successfully");
            } else {
                await api.journals.create(payload);
                toast.success("Journal published successfully");
            }
            handleCancel();
            loadJournals();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save journal — check all required fields");
        }
    };

    const handleEdit = (journal) => {
        setIsEditing(true);
        setEditingSlug(journal.slug);
        setFormData({
            title: journal.title || '',
            slug: journal.slug || '',
            excerpt: journal.excerpt || '',
            introText: journal.introText || '',
            heroImage: journal.heroImage || '',
            ctaText: journal.ctaText || 'View Collection',
            ctaLink: journal.ctaLink || '/collections/all',
            ctaImage: journal.ctaImage || '',
            footerImage: journal.footerImage || '',
            date: journal.date ? new Date(journal.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            isPublished: journal.isPublished !== false,
        });
        setEditorContent(journal.content || { time: Date.now(), blocks: [], version: '2.28.2' });
        setActiveSection('meta');
    };

    const handleDelete = async (slug) => {
        if (window.confirm('Delete this journal entry? This action cannot be undone.')) {
            try {
                await api.journals.delete(slug);
                toast.success("Journal deleted");
                loadJournals();
            } catch (err) {
                toast.error("Deletion failed");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    };

    const filteredJournals = journals.filter(j => 
        j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        j.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Field = ({ label, icon: Icon, children }) => (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-black text-admin-muted uppercase tracking-widest">
                {Icon && <Icon size={10} />} {label}
            </label>
            {children}
        </div>
    );

    const inputCls = "w-full bg-admin-bg border border-admin-border px-3 py-2.5 rounded-xl text-[13px] text-white placeholder:text-admin-muted/30 focus:border-admin-accent/60 focus:ring-1 focus:ring-admin-accent/20 outline-none transition-all duration-300";
    const textareaCls = `${inputCls} resize-none min-h-[80px]`;

    if (isEditing) {
        const sections = [
            { id: 'meta', label: 'Meta & Media', icon: ImageIcon },
            { id: 'content', label: 'Article Content', icon: Type },
            { id: 'cta', label: 'CTA & Settings', icon: ExternalLink },
        ];

        return (
            <div className="space-y-6 animate-in fade-in duration-500 pb-20">
                {/* Sticky Header */}
                <div className="sticky top-[64px] z-[40] -mx-4 px-4 py-4 bg-[#09090B]/80 backdrop-blur-md border-b border-admin-border flex items-center justify-between transition-all">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white">{editingSlug ? 'Editing Narrative' : 'New Narrative'}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-admin-accent animate-pulse" />
                            <p className="text-[10px] text-admin-muted uppercase tracking-widest font-black">Drafting in Progress</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleCancel} className="px-5 py-2 rounded-xl border border-admin-border text-[11px] font-black uppercase text-admin-muted hover:text-white hover:bg-admin-card transition-all">
                            Discard
                        </button>
                        <button onClick={handleSubmit} className="px-7 py-2 rounded-xl bg-admin-accent text-white text-[11px] font-black uppercase shadow-xl shadow-admin-accent/30 hover:translate-y-[-1px] active:scale-95 transition-all">
                            {editingSlug ? 'Save Changes' : 'Publish Story'}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-admin-card border border-admin-border rounded-2xl p-1.5 shadow-inner">
                    {sections.map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`flex items-center justify-center gap-2.5 flex-1 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-500 ${activeSection === sec.id ? 'bg-admin-accent text-white shadow-lg shadow-admin-accent/20 scale-[1.02]' : 'text-admin-muted hover:text-white hover:bg-admin-bg/50'}`}
                        >
                            <sec.icon size={14} className={activeSection === sec.id ? 'animate-bounce' : ''} /> {sec.label}
                        </button>
                    ))}
                </div>

                {/* Section: Meta & Media */}
                {activeSection === 'meta' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-6 shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Atmospheric Title" icon={Type}>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => {
                                                const title = e.target.value;
                                                const slugUpdate = !editingSlug ? { slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {};
                                                setFormData({ ...formData, title, ...slugUpdate });
                                            }}
                                            className={inputCls}
                                            placeholder="e.g. An Ode to Her"
                                        />
                                    </Field>
                                    <Field label="Access Path (Slug)" icon={Link}>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className={`${inputCls} font-mono text-admin-accent`}
                                            placeholder="an-ode-to-her"
                                            disabled={!!editingSlug}
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Chronicle Date" icon={Calendar}>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field label="Hero Visual" icon={ImageIcon}>
                                        <div className="space-y-3">
                                            <ImageUpload
                                                value={formData.heroImage}
                                                onChange={url => setFormData({ ...formData, heroImage: url })}
                                            />
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-6 shadow-xl">
                                <Field label="Narrative Intro (Gold Italic Detail)" icon={AlignLeft}>
                                    <textarea
                                        value={formData.introText}
                                        onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                                        className={`${textareaCls} border-dashed border-admin-accent/30 focus:border-admin-accent`}
                                        placeholder="The opening emotional hook shown in gold italic... Use <b> for bold."
                                    />
                                </Field>
                                <Field label="Archive Excerpt (Card Preview)" icon={AlignLeft}>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className={textareaCls}
                                        placeholder="Brief summary for the journal archive listing..."
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Live Preview Column */}
                        <div className="space-y-6">
                            <div className="sticky top-[160px]">
                                <p className="text-[10px] font-black text-admin-muted uppercase tracking-[0.2em] mb-3 ml-2">Visual Echo</p>
                                <div className="bg-admin-card border border-admin-border rounded-3xl overflow-hidden shadow-2xl group transition-all duration-500 hover:border-admin-accent/30">
                                    <div className="aspect-[16/10] relative overflow-hidden bg-admin-bg">
                                        {(formData.heroImage) ? (
                                            <img 
                                                src={formData.heroImage} 
                                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                                                alt="Preview" 
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <ImageIcon size={40} className="text-admin-muted/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                                                {formatDate(formData.date) || 'JUN 24'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h4 className="text-[15px] font-black leading-tight text-white group-hover:text-admin-accent transition-colors" dangerouslySetInnerHTML={{ __html: formData.title || 'Untitled Narrative' }} />
                                        <p className="text-[12px] text-admin-muted line-clamp-3 leading-relaxed font-medium">
                                            {formData.excerpt || 'Your story starts here... the excerpt will appear on the archive grid to invite readers into your narrative world.'}
                                        </p>
                                        <div className="pt-4 border-t border-admin-border flex items-center justify-between">
                                            <span className="text-[9px] font-black text-admin-muted uppercase tracking-widest">READ STORY</span>
                                            <div className="w-6 h-6 rounded-full border border-admin-border flex items-center justify-center group-hover:bg-admin-accent group-hover:border-admin-accent transition-all duration-300">
                                                <Eye size={12} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section: Article Content */}
                {activeSection === 'content' && (
                    <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-4 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-white">Editorial Engine</h3>
                                <p className="text-[11px] text-admin-muted font-bold uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen size={12} className="text-admin-accent" /> Use rich blocks to craft your narrative
                                </p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-admin-bg border border-admin-border text-[10px] font-bold text-admin-accent">
                                {editorContent?.blocks?.length || 0} Blocks Active
                            </div>
                        </div>
                        <div className="bg-admin-bg border border-admin-border rounded-2xl min-h-[500px] overflow-hidden focus-within:border-admin-accent/40 transition-all duration-500">
                            <Editor
                                data={editorContent}
                                onChange={(data) => setEditorContent(data)}
                                holder="journal-content-editor"
                            />
                        </div>
                    </div>
                )}

                {/* Section: CTA & Settings */}
                {activeSection === 'cta' && (
                    <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-8 shadow-xl">
                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <ExternalLink size={20} className="text-admin-accent" /> Call to Action
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Field label="Button Text" icon={Type}>
                                        <input
                                            type="text"
                                            value={formData.ctaText}
                                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                            className={inputCls}
                                            placeholder="View Collection"
                                        />
                                    </Field>
                                    <Field label="Target Route" icon={Link}>
                                        <input
                                            type="text"
                                            value={formData.ctaLink}
                                            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                            className={`${inputCls} font-mono text-admin-accent`}
                                            placeholder="/collections/all"
                                        />
                                    </Field>
                                </div>

                                {/* Image Uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-admin-border">
                                    <Field label="CTA Background Image (Mirror Photo)" icon={ImageIcon}>
                                        <ImageUpload
                                            value={formData.ctaImage}
                                            onChange={url => setFormData({ ...formData, ctaImage: url })}
                                        />
                                    </Field>
                                    <Field label="Footer Image (Full-Width Mood Visual)" icon={ImageIcon}>
                                        <ImageUpload
                                            value={formData.footerImage}
                                            onChange={url => setFormData({ ...formData, footerImage: url })}
                                        />
                                    </Field>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-admin-border space-y-6">
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <Sparkles size={18} className="text-admin-accent" /> Deployment
                                </h3>
                                
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                                    className={`w-full group relative overflow-hidden flex items-center justify-between px-8 py-6 rounded-2xl border transition-all duration-500 ${formData.isPublished ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-amber-500/30 bg-amber-500/5 text-amber-500'}`}
                                >
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-colors duration-500 ${formData.isPublished ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                                            {formData.isPublished ? <CheckCircle2 size={24} /> : <BookOpen size={24} />}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[14px] font-black uppercase tracking-widest">{formData.isPublished ? 'Live Status' : 'Draft Mode'}</p>
                                            <p className="text-[11px] opacity-60 font-medium">{formData.isPublished ? 'Your entry is visible to the public' : 'Only entry admins can view this story'}</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        {formData.isPublished ? <ToggleRight size={32} className="stroke-[1.5px]" /> : <ToggleLeft size={32} className="stroke-[1.5px] opacity-40" />}
                                    </div>
                                    {/* Subtle Hover Effect */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r ${formData.isPublished ? 'from-emerald-500/10 to-transparent' : 'from-amber-500/10 to-transparent'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Full Summary Review */}
                        <div className="bg-admin-bg border border-admin-border rounded-3xl p-8 space-y-4">
                            <p className="text-[10px] text-admin-muted uppercase tracking-[0.3em] font-black mb-4">Final Configuration Review</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-admin-muted font-bold uppercase">Chronicle</p>
                                    <p className="text-xs text-white font-black truncate">{formData.title || '—'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-admin-muted font-bold uppercase">Manifest Date</p>
                                    <p className="text-xs text-white font-black">{formData.date ? formatDate(formData.date) : '—'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-admin-muted font-bold uppercase">Linkage</p>
                                    <p className="text-xs text-admin-accent font-mono font-bold truncate">{formData.slug || '—'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-admin-muted font-bold uppercase">Visibility</p>
                                    <p className={`text-xs font-black uppercase tracking-widest ${formData.isPublished ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {formData.isPublished ? 'Live' : 'Hidden'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-admin-border pb-8">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter text-white">Journal</h2>
                    <p className="text-[13px] text-admin-muted uppercase tracking-[0.4em] font-black mt-2">Editorial Archives & narratives</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative group w-full sm:w-72">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted group-focus-within:text-admin-accent transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH ARCHIVES..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-admin-card/50 border border-admin-border pl-10 pr-4 py-2.5 rounded-2xl text-[11px] font-black tracking-widest uppercase placeholder:text-admin-muted/40 focus:border-admin-accent/50 focus:ring-4 focus:ring-admin-accent/5 outline-none transition-all duration-500"
                        />
                    </div>
                    <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-admin-accent px-6 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white shadow-2xl shadow-admin-accent/30 hover:translate-y-[-2px] hover:shadow-admin-accent/40 active:scale-95 transition-all duration-300">
                        <Plus size={18} /> New Narrative
                    </button>
                </div>
            </div>

            {/* Archives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-2 border-admin-accent/20 border-t-admin-accent rounded-full animate-spin" />
                        <p className="uppercase tracking-[0.4em] text-admin-muted font-black text-[10px] animate-pulse">Syncing Editorial Data</p>
                    </div>
                ) : filteredJournals.length > 0 ? (
                    filteredJournals.map((j) => (
                        <div key={j._id} className="bg-admin-card border border-admin-border rounded-3xl overflow-hidden group hover:border-admin-accent/40 hover:scale-[1.01] transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-admin-accent/5">
                            <div className="aspect-[16/10] relative overflow-hidden">
                                {j.heroImage ? (
                                    <img src={j.heroImage} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" alt={j.title} />
                                ) : (
                                    <div className="w-full h-full bg-admin-bg flex items-center justify-center text-admin-muted/20">
                                        <ImageIcon size={48} strokeWidth={1} />
                                    </div>
                                )}
                                {/* Status Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-60" />
                                
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${j.isPublished !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        {j.isPublished !== false ? 'LIVE' : 'DRAFT'}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <a
                                        href={`http://localhost:5174/journal/${j.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-black/80 p-2.5 rounded-xl backdrop-blur-md text-white hover:text-cyan-400 border border-white/5 transition-colors"
                                        title="Preview Story"
                                    >
                                        <Eye size={14} />
                                    </a>
                                    <button className="bg-black/80 p-2.5 rounded-xl backdrop-blur-md text-white hover:text-admin-accent border border-white/5 transition-colors" onClick={() => handleEdit(j)} title="Edit Story">
                                        <Edit size={14} />
                                    </button>
                                    <button className="bg-black/80 p-2.5 rounded-xl backdrop-blur-md text-white hover:text-rose-500 border border-white/5 transition-colors" onClick={() => handleDelete(j.slug)} title="Remove Story">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                
                                {j.ctaText && (
                                    <div className="absolute bottom-4 right-4 text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
                                        {j.ctaText}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-admin-muted tracking-[0.2em]">{formatDate(j.date)}</span>
                                    <Link className="text-admin-accent/40 group-hover:text-admin-accent transition-colors" size={12} />
                                </div>
                                <h3 className="text-lg font-black leading-tight text-white group-hover:text-admin-accent transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: j.title }} />
                                {j.excerpt && <p className="text-[12px] text-admin-muted line-clamp-2 leading-relaxed font-medium opacity-60">{j.excerpt}</p>}
                                <div className="flex items-center gap-3 pt-4 border-t border-admin-border/50 mt-4">
                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-admin-muted uppercase tracking-widest">
                                        <Layers size={10} /> {j.content?.blocks?.length || 0} BLOCKS
                                    </div>
                                    <div className="ml-auto flex -space-x-1">
                                        {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-admin-card bg-admin-bg/50" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-admin-card border-2 border-dashed border-admin-border rounded-[40px] space-y-6">
                        <div className="w-20 h-20 rounded-full bg-admin-bg flex items-center justify-center text-admin-muted/10">
                            <BookOpen size={40} />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="uppercase tracking-[0.5em] text-admin-muted font-black text-[11px]">No Narratives found</p>
                            <p className="text-[12px] text-admin-muted/40 max-w-xs mx-auto px-4 uppercase font-bold tracking-widest">The archives are currently silent. Clear your search or start a new story.</p>
                        </div>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="text-[10px] font-black uppercase tracking-widest text-admin-accent hover:underline decoration-2 underline-offset-4">
                                Clear Search Archive
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalView;
