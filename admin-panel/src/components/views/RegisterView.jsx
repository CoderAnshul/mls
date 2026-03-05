import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';
import { useNavigate } from 'react-router-dom';

const RegisterView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.auth.register(name, email, password);
            if (data.token) {
                toast.success('Root Account Created! Redirecting...');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error(data.message || 'Identity verification failed');
            }
        } catch (error) {
            toast.error('Connection interrupted. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] p-6 font-admin">
            <div className="absolute inset-0 bg-gradient-to-br from-admin-accent/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-admin-card/40 backdrop-blur-3xl border border-admin-border rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-admin-accent/10 blur-3xl rounded-full pointer-events-none group-hover:bg-admin-accent/20 transition-colors duration-700" />
                    
                    <button 
                        onClick={() => navigate('/login')}
                        className="mb-8 flex items-center gap-2 text-admin-muted hover:text-white transition-colors group/back font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                        Back to login
                    </button>

                    <div className="mb-10 relative">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-admin-accent/10 border border-admin-accent/20 rounded-2xl mb-6 shadow-glow">
                             <img src="/brand_logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">Create Root Access</h1>
                        <p className="text-admin-muted font-medium">Initialize your administrator account</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted ml-1">Full Identity</label>
                                <div className="relative group/field">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-admin-muted group-focus-within/field:text-admin-accent transition-colors">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-admin-bg/50 border border-admin-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-admin-muted/30 focus:border-admin-accent outline-none transition-all focus:ring-4 focus:ring-admin-accent/10 font-bold text-sm"
                                        placeholder="EX: Anshul Sharma"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted ml-1">System Email</label>
                                <div className="relative group/field">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-admin-muted group-focus-within/field:text-admin-accent transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-admin-bg/50 border border-admin-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-admin-muted/30 focus:border-admin-accent outline-none transition-all focus:ring-4 focus:ring-admin-accent/10 font-bold text-sm"
                                        placeholder="admin@aab-web.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted ml-1">Secure Password Phrase</label>
                            <div className="relative group/field">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-admin-muted group-focus-within/field:text-admin-accent transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-admin-bg/50 border border-admin-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-admin-muted/30 focus:border-admin-accent outline-none transition-all focus:ring-4 focus:ring-admin-accent/10 font-bold text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-[10px] text-admin-muted/60 font-bold mt-2 ml-1">MINIMUM 8 CHARACTERS &bull; ENCRYPTED VIA BCRYPT-256</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-admin-accent hover:text-white disabled:opacity-50 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl group/btn"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    PROVISION ACCOUNT
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-admin-border text-center">
                         <p className="text-xs text-admin-muted font-bold">
                            By provisioning, you agree to the <span className="text-admin-accent cursor-pointer">Security Protocols</span> and <span className="text-admin-accent cursor-pointer">Terms of Service</span>.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
