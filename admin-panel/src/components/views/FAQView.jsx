import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../utils/api';

const FAQView = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        setLoading(true);
        try {
            const data = await api.faqs.getAll();
            setFaqs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.faqs.create(formData);
            setIsAdding(false);
            setFormData({ question: '', answer: '', category: 'General' });
            loadFaqs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
             <div className="flex items-center justify-between border-b border-admin-border pb-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Customer Support Knowledge</h2>
                    <p className="text-[13px] text-admin-muted uppercase tracking-widest font-bold mt-1">Manage global FAQ registry and support logic</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-admin-accent px-3 py-1.5 rounded-lg text-[13px] font-black uppercase text-white shadow-lg shadow-admin-accent/20">
                    <Plus size={14} /> {isAdding ? 'Close Builder' : 'New Knowledge'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-admin-card border border-admin-border rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[9px] font-black text-admin-muted uppercase">Question</label>
                            <input 
                                type="text" 
                                value={formData.question} 
                                onChange={(e) => setFormData({...formData, question: e.target.value})}
                                className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-bold" 
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-[9px] font-black text-admin-muted uppercase">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs font-bold appearance-none outline-none"
                            >
                                <option>General</option>
                                <option>Shipping</option>
                                <option>Returns</option>
                                <option>Sizing</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-admin-muted uppercase">Answer</label>
                        <textarea 
                            rows={3} 
                            value={formData.answer}
                            onChange={(e) => setFormData({...formData, answer: e.target.value})}
                            className="w-full bg-admin-bg border border-admin-border px-3 py-2 rounded-lg text-xs" 
                        />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-admin-accent text-white text-[10px] font-black uppercase">Save to Registry</button>
                    </div>
                </div>
            )}

            <div className="bg-admin-card border border-admin-border rounded-xl p-6 space-y-4">
                {loading ? (
                    <div className="py-10 text-center text-admin-muted font-black uppercase tracking-widest">Parsing Registry...</div>
                ) : faqs.length > 0 ? (
                    faqs.map((f) => (
                        <div key={f._id} className="border border-admin-border rounded-xl p-4 flex items-center justify-between group hover:border-admin-accent/50">
                            <div className="flex gap-4 items-center">
                                <div className="w-8 h-8 rounded-lg bg-admin-bg border border-admin-border flex items-center justify-center text-admin-accent">
                                    <HelpCircle size={14} />
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-black">{f.question}</h4>
                                    <p className="text-[12px] text-admin-muted line-clamp-1">{f.answer}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 rounded-lg border border-admin-border hover:bg-admin-bg"><Edit size={12} /></button>
                                <button className="p-1.5 rounded-lg border border-admin-border hover:text-rose-400"><Trash2 size={12} /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center text-admin-muted font-black uppercase tracking-widest">Empty Registry</div>
                )}
            </div>
        </div>
    );
};

export default FAQView;
