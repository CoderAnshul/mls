import React, { useState, useEffect } from 'react';
import { FileText, Save, RefreshCw, AlertCircle, Phone, Mail, List } from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';
import Editor from './Editor';

const SupportPagesView = () => {
    const toast = useToast();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState(null);
    const [content, setContent] = useState({ blocks: [] });
    const [metadata, setMetadata] = useState({});
    const [saving, setSaving] = useState(false);

    const defaultPages = [
        { title: 'Terms & Conditions', slug: 'terms-conditions' },
        { title: 'Privacy Policy', slug: 'privacy-policy' },
        { title: 'Contact Us', slug: 'contact-us' },
        { title: 'Shipping Information', slug: 'shipping-info' },
        { title: 'Delivery', slug: 'delivery' },
        { title: 'Returns & Exchanges', slug: 'returns-exchanges' }
    ];

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await api.pages.getAll();
            setPages(data);
            if (data.length > 0) {
                handleSelectPage(data.find(p => p.slug === 'terms-conditions') || data[0]);
            } else {
                handleSelectPage(defaultPages[0]);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load pages');
        } finally {
            setLoading(false);
        }
    };

    const formatContentToBlocks = (rawContent) => {
        if (!rawContent) return { blocks: [] };
        if (typeof rawContent === 'object' && rawContent.blocks) return rawContent;
        // If it's a string, wrap it in a paragraph block
        return {
            blocks: [
                {
                    type: 'paragraph',
                    data: { text: rawContent }
                }
            ]
        };
    };

    const handleSelectPage = async (pageStub) => {
        setSelectedPage(pageStub);
        setLoading(true);
        try {
            const fullPage = await api.pages.getOne(pageStub.slug);
            if (fullPage) {
                setContent(formatContentToBlocks(fullPage.content));
                setMetadata(fullPage.metadata || {});
            } else {
                setContent({ blocks: [] });
                setMetadata({});
            }
        } catch (err) {
            console.error(err);
            setContent({ blocks: [] });
            setMetadata({});
        } finally {
            setLoading(false);
        }
    };

    const handleMetadataChange = (key, value) => {
        setMetadata(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        if (!selectedPage) return;
        setSaving(true);
        try {
            await api.pages.updateOrCreate({
                title: selectedPage.title,
                slug: selectedPage.slug,
                content: content,
                metadata: metadata,
                isActive: true
            });
            toast.success(`${selectedPage.title} updated successfully`);
            loadPages();
        } catch (err) {
            console.error(err);
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const isContactPage = selectedPage?.slug === 'contact-us';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-admin-border pb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Support & Policy Pages</h2>
                    <p className="text-[13px] text-admin-muted uppercase tracking-[0.3em] font-bold mt-2">Manage legal documents and contact information</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving || !selectedPage}
                    className="flex items-center gap-2 bg-admin-accent px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-white shadow-xl shadow-admin-accent/20 hover:scale-105 transition-all disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    {saving ? 'Syncing...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Page List */}
                <div className="lg:col-span-1 space-y-2">
                    <h3 className="text-[10px] font-black text-admin-muted uppercase tracking-[0.2em] mb-4 ml-2">Available Pages</h3>
                    {defaultPages.map((page) => (
                        <button
                            key={page.slug}
                            onClick={() => handleSelectPage(page)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                selectedPage?.slug === page.slug
                                    ? 'bg-admin-accent/10 border border-admin-accent/30 text-admin-accent shadow-lg shadow-admin-accent/5'
                                    : 'bg-admin-card border border-admin-border text-admin-muted hover:border-admin-accent/50 hover:text-white'
                            }`}
                        >
                            <FileText size={16} />
                            <span className="text-[13px] font-extrabold tracking-tight">{page.title}</span>
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-3 space-y-8">
                    {loading ? (
                        <div className="h-[500px] bg-admin-card border border-admin-border rounded-3xl flex items-center justify-center animate-pulse">
                            <p className="text-admin-muted uppercase tracking-[0.3em] font-black text-[11px]">Loading Document Content...</p>
                        </div>
                    ) : (
                        <>
                            {isContactPage && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Contact Details Section */}
                                        <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Phone className="text-admin-accent" size={20} />
                                                <h4 className="text-[14px] font-black uppercase tracking-widest text-white">Contact Numbers</h4>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest pl-1">UK Phone</label>
                                                    <input 
                                                        type="text"
                                                        value={metadata.phone_uk || ''}
                                                        onChange={(e) => handleMetadataChange('phone_uk', e.target.value)}
                                                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none"
                                                        placeholder="+44 (0) 203 823 7768"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest pl-1">WhatsApp</label>
                                                    <input 
                                                        type="text"
                                                        value={metadata.phone_whatsapp || ''}
                                                        onChange={(e) => handleMetadataChange('phone_whatsapp', e.target.value)}
                                                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none"
                                                        placeholder="+44 (0) 203 823 7768"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest pl-1">International</label>
                                                    <input 
                                                        type="text"
                                                        value={metadata.phone_int || ''}
                                                        onChange={(e) => handleMetadataChange('phone_int', e.target.value)}
                                                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none"
                                                        placeholder="+44 (0) 203 823 7768"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Support Info Section */}
                                        <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Mail className="text-admin-accent" size={20} />
                                                <h4 className="text-[14px] font-black uppercase tracking-widest text-white">Support Emails & Hours</h4>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest pl-1">Primary Email</label>
                                                    <input 
                                                        type="text"
                                                        value={metadata.email || ''}
                                                        onChange={(e) => handleMetadataChange('email', e.target.value)}
                                                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none"
                                                        placeholder="admin@aabcollection.com"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest pl-1">Working Hours Note</label>
                                                    <input 
                                                        type="text"
                                                        value={metadata.hours_note || ''}
                                                        onChange={(e) => handleMetadataChange('hours_note', e.target.value)}
                                                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none"
                                                        placeholder="(Monday - Friday, 10am - 3pm)"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-admin-muted uppercase tracking-widest pl-1">Response Time Note</label>
                                                    <input 
                                                        type="text"
                                                        value={metadata.response_note || ''}
                                                        onChange={(e) => handleMetadataChange('response_note', e.target.value)}
                                                        className="w-full bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none"
                                                        placeholder="We aim to respond within 24 hours..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subjects Management */}
                                    <div className="bg-admin-card border border-admin-border rounded-3xl p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <List className="text-admin-accent" size={20} />
                                            <h4 className="text-[14px] font-black uppercase tracking-widest text-white">Form Subjects (Comma separated)</h4>
                                        </div>
                                        <textarea 
                                            value={metadata.subjects || ''}
                                            onChange={(e) => handleMetadataChange('subjects', e.target.value)}
                                            className="w-full h-24 bg-admin-bg border border-admin-border rounded-xl px-4 py-3 text-sm text-white focus:border-admin-accent transition-colors outline-none resize-none"
                                            placeholder="General Inquiry, Order Support, Returns, Wholesale"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Main Content Area (Rich Text) */}
                            <div className="bg-admin-card border border-admin-border rounded-3xl overflow-hidden shadow-2xl">
                                <div className="bg-admin-bg/50 border-b border-admin-border px-8 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-admin-accent animate-pulse" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white">
                                            {isContactPage ? 'Page Description / Additional Info' : `Editing: ${selectedPage?.title}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-admin-muted font-bold uppercase tracking-wider">
                                        <AlertCircle size={12} />
                                        Rich Text Editor
                                    </div>
                                </div>
                                <div className="p-8 bg-transparent min-h-[400px]">
                                    <Editor 
                                        key={selectedPage?.slug}
                                        data={content} 
                                        onChange={setContent}
                                        holder={`editor-${selectedPage?.slug}`}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    
                    <div className="p-6 bg-admin-accent/5 border border-admin-accent/20 rounded-2xl flex items-start gap-4">
                        <div className="p-2 bg-admin-accent/10 rounded-lg text-admin-accent shrink-0">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-white mb-1">Editing Guide</h4>
                            <p className="text-[11px] text-admin-muted leading-relaxed font-bold">
                                {isContactPage 
                                    ? "For the Contact page, use the fields above for specific details. Use this main content area for any additional text or descriptions you want to show."
                                    : "You can use standard HTML tags like <h1>, <p>, <ul> to format your content. The frontend will render it exactly as provided."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPagesView;
