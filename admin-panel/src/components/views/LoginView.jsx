import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';
import { useNavigate } from 'react-router-dom';

const LoginView = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.auth.login(email, password);
            if (data.token) {
                localStorage.setItem('user', JSON.stringify(data));
                setAuth(data);
                addToast('Welcome back, Admin!', 'success');
                navigate('/');
            } else {
                addToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            addToast('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] p-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-admin-accent/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="bg-admin-card/40 backdrop-blur-2xl border border-admin-border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-admin-accent/20 blur-3xl -mr-16 -mt-16 group-hover:bg-admin-accent/30 transition-all duration-700" />
                    
                    <div className="mb-10 text-center relative">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-admin-accent/10 border border-admin-accent/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                            <img src="/brand_logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Admin Portal</h1>
                        <p className="text-admin-muted font-medium">Enter your credentials to access the matrix</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-admin-muted ml-1">Email Address</label>
                            <div className="relative group/field">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-admin-muted group-focus-within/field:text-admin-accent transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-admin-bg/50 border border-admin-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-admin-muted/50 focus:border-admin-accent outline-none transition-all focus:ring-4 focus:ring-admin-accent/10 font-medium"
                                    placeholder="admin@aab-web.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-admin-muted ml-1">Secure Password</label>
                            <div className="relative group/field">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-admin-muted group-focus-within/field:text-admin-accent transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-admin-bg/50 border border-admin-border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-admin-muted/50 focus:border-admin-accent outline-none transition-all focus:ring-4 focus:ring-admin-accent/10 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-admin-accent hover:bg-admin-accent/90 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-admin-accent/20 group/btn"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    AUTHORIZE ACCESS
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <button 
                            onClick={() => navigate('/register')}
                            className="text-admin-muted hover:text-admin-accent text-sm font-bold transition-colors"
                        >
                            Need a root account? <span className="underline underline-offset-4">Register here</span>
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-admin-muted/40 text-[10px] font-bold tracking-[0.2em] uppercase">
                    &copy; 2026 MLS Enterprise Systems &bull; All Rights Reserved
                </p>
            </div>
        </div>
    );
};

export default LoginView;
