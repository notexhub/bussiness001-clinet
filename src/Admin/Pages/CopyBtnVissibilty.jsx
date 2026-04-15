import React, { useEffect, useState } from "react";
import api from '@/api/axios';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

const CopyBtnVisibility = () => {
    const [loading, setLoading] = useState(false);
    const [runningData, setRunningData] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/copy-btn');
            if (res?.data) {
                setRunningData(res.data);
            }
        } catch (error) {
            console.error("Failed to load copy button visibility", error);
            setError("Failed to load current settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdateVisibility = async () => {
        if (!runningData) return;

        try {
            setUpdating(true);
            setError(null);
            await api.post('/copy-btn', {
                copy_btn_visibility: !runningData.copy_btn_visibility,
            });
            await loadData();

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to update visibility", error);
            setError("Failed to update visibility settings");
        } finally {
            setUpdating(false);
        }
    };

    const isVisible = runningData?.copy_btn_visibility;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100">
            <div className="bg-[#080808] px-8 py-6 border-b border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        {isVisible ? <Eye className="text-primary w-6 h-6" /> : <EyeOff className="text-gray-500 w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white logoFont tracking-tighter uppercase leading-none">
                            Interface <span className="text-green-600">Vector</span>
                        </h3>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">Global Visibility Control</p>
                    </div>
                </div>
                
                <div className={`px-5 py-2 rounded-full border ${isVisible
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">
                        {isVisible ? 'Operational' : 'Deactivated'}
                    </span>
                </div>
            </div>

            <div className="p-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Accessing Grid...</p>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto">
                        <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                            
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Current Sector Status</p>
                                    <div className="flex items-center gap-6">
                                        {isVisible ? (
                                            <>
                                                <div className="w-16 h-16 bg-[#080808] rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
                                                    <Eye className="w-8 h-8 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-4xl font-black text-[#080808] tracking-tighter">VISIBLE</p>
                                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Grid Overlay Enabled</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <EyeOff className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-4xl font-black text-gray-300 tracking-tighter">HIDDEN</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Stealth Protocol Active</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showSuccess && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-8 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                    <CheckCircle className="w-6 h-6 text-[#080808]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-[#080808] uppercase tracking-widest">Protocol Synchronized</p>
                                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest opacity-80 mt-0.5">
                                        Visual node {isVisible ? 'Broadcasting' : 'Encrypted'}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                                    <XCircle className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleUpdateVisibility}
                                disabled={updating || loading}
                                className={`flex-1 flex items-center justify-center gap-3 py-5 px-8 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 shadow-2xl ${isVisible
                                    ? 'bg-[#080808] text-white hover:bg-gray-900 shadow-black/10'
                                    : 'bg-primary text-[#080808] hover:bg-white shadow-primary/20 border border-primary/50'
                                    }`}
                            >
                                {updating ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isVisible ? (
                                            <>
                                                <EyeOff className="w-5 h-5" />
                                                <span>Terminate Visibility</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-5 h-5" />
                                                <span>Authorize Broadcast</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>

                            <button
                                onClick={loadData}
                                disabled={loading || updating}
                                className="w-full sm:w-20 h-16 bg-white border border-gray-100 text-[#080808] rounded-2xl flex items-center justify-center hover:bg-[#080808] hover:text-white transition-all duration-500 shadow-xl shadow-black/5"
                                title="Sync Grid"
                            >
                                <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="mt-12 p-8 bg-[#080808] rounded-[2rem] border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <AlertCircle size={14} /> System Directive
                            </p>
                            <ul className="text-[10px] font-bold text-white/50 space-y-3 leading-relaxed tracking-widest uppercase">
                                <li className="flex gap-3"><span className="text-primary opacity-50">•</span> Execution is global and persistent</li>
                                <li className="flex gap-3"><span className="text-primary opacity-50">•</span> Modifies visual rendering in user environment</li>
                                <li className="flex gap-3"><span className="text-primary opacity-50">•</span> Confirm registry sync after every command</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CopyBtnVisibility;
