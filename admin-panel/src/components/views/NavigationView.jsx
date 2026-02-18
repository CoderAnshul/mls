import React, { useState, useEffect } from 'react';
import { Compass, Plus, Trash2, Edit, ChevronDown, Layers, Image as ImageIcon, X, Save, Upload } from 'lucide-react';
import { api } from '../../utils/api';

const NavigationView = () => {
    const [navItems, setNavItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        href: '', 
        order: 0, 
        sections: [], 
        features: [] 
    });

    useEffect(() => {
        loadNavigation();
    }, []);

    const loadNavigation = async () => {
        setLoading(true);
        try {
            const data = await api.navigation.getAll();
            setNavItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setActiveItem(item);
            setFormData({
                title: item.title || '',
                href: item.href || '',
                order: item.order || 0,
                sections: item.sections || [],
                features: item.features || []
            });
        } else {
            setActiveItem(null);
            setFormData({ title: '', href: '', order: navItems.length + 1, sections: [], features: [] });
        }
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeItem) {
                await api.navigation.update(activeItem._id, formData);
            } else {
                await api.navigation.create(formData);
            }
            setIsEditing(false);
            loadNavigation();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this navigation item?')) {
            try {
                await api.navigation.delete(id);
                loadNavigation();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleImageUpload = async (e, index, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { url } = await api.navigation.uploadImage(file);
            if (type === 'feature') {
                const newFeatures = [...formData.features];
                newFeatures[index].image = url;
                setFormData({ ...formData, features: newFeatures });
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const addSection = () => {
        setFormData({
            ...formData,
            sections: [...formData.sections, { heading: '', links: [{ label: '', href: '' }] }]
        });
    };

    const addLink = (sectionIndex) => {
        const newSections = [...formData.sections];
        newSections[sectionIndex].links.push({ label: '', href: '' });
        setFormData({ ...formData, sections: newSections });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, { title: '', image: '', link: '' }]
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-admin-border pb-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Navigation Architecture</h2>
                    <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Configure site entry points and mega menu hierarchies</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-admin-accent px-4 py-2 rounded-xl text-[13px] font-black uppercase text-white shadow-lg shadow-admin-accent/20 transition-all active:scale-95"
                >
                    <Plus size={16} /> New Link
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center uppercase tracking-widest text-admin-muted font-black">Mapping Site Graph...</div>
                ) : navItems.length > 0 ? (
                    navItems.map((item) => (
                        <div key={item._id} className="bg-admin-card border border-admin-border rounded-2xl p-6 group hover:border-admin-accent/50 transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-admin-bg border border-admin-border flex items-center justify-center text-admin-accent">
                                        <Compass size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight text-white">{item.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[12px] text-admin-muted font-mono font-bold">{item.href}</p>
                                            <span className="text-[10px] bg-admin-bg px-2 py-0.5 rounded border border-admin-border text-admin-muted font-bold">POS: {item.order}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 rounded-lg border border-admin-border hover:bg-admin-bg text-admin-muted hover:text-white transition-colors"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 rounded-lg border border-admin-border hover:bg-rose-500/10 hover:text-rose-500 text-admin-muted transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {item.sections.map((section, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h4 className="text-[10px] font-black text-admin-muted uppercase tracking-widest border-b border-admin-border pb-2 flex items-center gap-2">
                                            <Layers size={10} /> {section.heading}
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {section.links.map((link, lIdx) => (
                                                <li key={lIdx} className="text-[12px] font-bold text-neutral-400 hover:text-admin-accent transition-colors">• {link.label}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {item.features && item.features.length > 0 && (
                                    <div className="col-span-full mt-4">
                                        <h4 className="text-[10px] font-black text-admin-muted uppercase tracking-widest border-b border-admin-border pb-2 flex items-center gap-2 mb-4">
                                            <ImageIcon size={10} /> Featured Content (Mega Menu)
                                        </h4>
                                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                            {item.features.map((feature, fIdx) => (
                                                <div key={fIdx} className="min-w-[150px] w-[200px] space-y-2">
                                                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-admin-border relative group/img bg-admin-bg">
                                                        {feature.image ? (
                                                            <img src={feature.image} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-admin-muted">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-white uppercase truncate">{feature.title || 'Untitled'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center uppercase tracking-widest text-admin-muted font-black bg-admin-card rounded-2xl border border-dashed border-admin-border">No Navigation Map Found</div>
                )}
            </div>

            {/* Editor Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                    <div className="relative bg-admin-bg border border-admin-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 scrollbar-hide">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-admin-accent/10 flex items-center justify-center text-admin-accent">
                                    <Compass size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-white">{activeItem ? 'Edit Link' : 'New Navigation Link'}</h2>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full hover:bg-admin-card flex items-center justify-center text-admin-muted hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-admin-muted tracking-widest">Title</label>
                                    <input 
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-admin-card border border-admin-border rounded-xl px-4 py-3 text-white focus:border-admin-accent outline-none" 
                                        placeholder="e.g. MENS" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-admin-muted tracking-widest">URL / Slug</label>
                                    <input 
                                        required
                                        value={formData.href}
                                        onChange={e => setFormData({...formData, href: e.target.value})}
                                        className="w-full bg-admin-card border border-admin-border rounded-xl px-4 py-3 text-white focus:border-admin-accent outline-none font-mono" 
                                        placeholder="/collections/mens" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-admin-muted tracking-widest">Order</label>
                                    <input 
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
                                        className="w-full bg-admin-card border border-admin-border rounded-xl px-4 py-3 text-white focus:border-admin-accent outline-none" 
                                    />
                                </div>
                            </div>

                            {/* Sections */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-admin-border pb-2">
                                    <h3 className="text-[14px] font-black text-white uppercase tracking-tight">Navigation Sections</h3>
                                    <button type="button" onClick={addSection} className="text-[11px] font-black uppercase text-admin-accent hover:underline flex items-center gap-1">
                                        <Plus size={12} /> Add Section
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formData.sections.map((section, sIdx) => (
                                        <div key={sIdx} className="bg-admin-card/50 border border-admin-border rounded-2xl p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <input 
                                                    value={section.heading}
                                                    onChange={e => {
                                                        const newSections = [...formData.sections];
                                                        newSections[sIdx].heading = e.target.value;
                                                        setFormData({...formData, sections: newSections});
                                                    }}
                                                    className="bg-transparent border-none text-[13px] font-black text-white focus:ring-0 placeholder:text-admin-muted p-0 w-full uppercase"
                                                    placeholder="Section Heading..."
                                                />
                                                <button type="button" onClick={() => {
                                                    const newSections = formData.sections.filter((_, i) => i !== sIdx);
                                                    setFormData({...formData, sections: newSections});
                                                }} className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {section.links.map((link, lIdx) => (
                                                    <div key={lIdx} className="flex gap-2">
                                                        <input 
                                                            value={link.label}
                                                            onChange={e => {
                                                                const newSections = [...formData.sections];
                                                                newSections[sIdx].links[lIdx].label = e.target.value;
                                                                setFormData({...formData, sections: newSections});
                                                            }}
                                                            placeholder="Label"
                                                            className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-3 py-1.5 text-[12px] text-white focus:border-admin-accent outline-none"
                                                        />
                                                        <input 
                                                            value={link.href}
                                                            onChange={e => {
                                                                const newSections = [...formData.sections];
                                                                newSections[sIdx].links[lIdx].href = e.target.value;
                                                                setFormData({...formData, sections: newSections});
                                                            }}
                                                            placeholder="URL"
                                                            className="flex-1 bg-admin-bg border border-admin-border rounded-lg px-3 py-1.5 text-[12px] text-white focus:border-admin-accent outline-none font-mono"
                                                        />
                                                        <button type="button" onClick={() => {
                                                            const newSections = [...formData.sections];
                                                            newSections[sIdx].links = section.links.filter((_, i) => i !== lIdx);
                                                            setFormData({...formData, sections: newSections});
                                                        }} className="text-admin-muted hover:text-rose-500">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => addLink(sIdx)} className="w-full py-2 border border-dashed border-admin-border rounded-lg text-[11px] font-bold text-admin-muted hover:text-white hover:border-admin-muted transition-all uppercase tracking-widest">
                                                    + Add Link
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Featured (Mega Menu) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-admin-border pb-2">
                                    <h3 className="text-[14px] font-black text-white uppercase tracking-tight">Mega Menu Features</h3>
                                    <button type="button" onClick={addFeature} className="text-[11px] font-black uppercase text-admin-accent hover:underline flex items-center gap-1">
                                        <Plus size={12} /> Add Feature
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {formData.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="bg-admin-card/50 border border-admin-border rounded-2xl p-4 space-y-4">
                                            <div className="aspect-[16/9] bg-admin-bg border border-admin-border rounded-xl overflow-hidden relative group">
                                                {feature.image ? (
                                                    <img src={feature.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-admin-muted">
                                                        <ImageIcon size={32} />
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                                    <Upload className="text-white mb-2" />
                                                    <span className="text-white text-[11px] font-black uppercase">Upload Image</span>
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, fIdx, 'feature')}
                                                    />
                                                </label>
                                            </div>
                                            <div className="space-y-2">
                                                <input 
                                                    value={feature.title}
                                                    onChange={e => {
                                                        const newFeatures = [...formData.features];
                                                        newFeatures[fIdx].title = e.target.value;
                                                        setFormData({...formData, features: newFeatures});
                                                    }}
                                                    placeholder="Feature Title..."
                                                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[12px] text-white focus:border-admin-accent outline-none"
                                                />
                                                <input 
                                                    value={feature.link}
                                                    onChange={e => {
                                                        const newFeatures = [...formData.features];
                                                        newFeatures[fIdx].link = e.target.value;
                                                        setFormData({...formData, features: newFeatures});
                                                    }}
                                                    placeholder="Target URL..."
                                                    className="w-full bg-admin-bg border border-admin-border rounded-lg px-3 py-2 text-[12px] text-white focus:border-admin-accent outline-none font-mono"
                                                />
                                            </div>
                                            <button type="button" onClick={() => {
                                                const newFeatures = formData.features.filter((_, i) => i !== fIdx);
                                                setFormData({...formData, features: newFeatures});
                                            }} className="w-full py-1 text-[11px] font-black uppercase text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                                                Remove Feature
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-admin-border flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 rounded-xl text-[13px] font-black uppercase text-admin-muted hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="bg-admin-accent px-8 py-2.5 rounded-xl text-[13px] font-black uppercase text-white shadow-lg shadow-admin-accent/20 flex items-center gap-2 hover:translate-y-[-2px] transition-all active:scale-95"
                                >
                                    <Save size={18} />
                                    Save Navigation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavigationView;
