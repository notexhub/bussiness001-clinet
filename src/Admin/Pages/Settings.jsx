import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Loader2,
    Smartphone,
    Globe,
    MapPin,
    Phone,
    Mail,
    Clock,
    Settings as SettingsIcon,
    CheckCircle2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/api/axios';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [bkash, setBkash] = useState('');
    const [nagad, setNagad] = useState('');
    const [rocket, setRocket] = useState('');
    const [upay, setUpay] = useState('');

    const [webName, setWebName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [serviceTime, setServiceTime] = useState('');

    const [runningSettings, setRunningSettings] = useState({});

    const handleSettings = async () => {
        setSaving(true);
        try {
            const finalData = {
                bkash,
                nagad,
                rocket,
                upay,
                webName,
                address,
                phone,
                supportEmail,
                serviceTime,
                runningSettings
            };
            const res = await api.post('/settings', finalData);
            if (res.data.acknowledged) {
                toast.success('Settings updated successfully!', {
                    icon: '✨',
                    style: {
                        borderRadius: '12px',
                        background: '#10b981',
                        color: '#fff',
                    },
                });
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const loadRunningSettings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/settings');
            if (res.data) {
                setBkash(res.data.bkash || '');
                setNagad(res.data.nagad || '');
                setRocket(res.data.rocket || '');
                setUpay(res.data.upay || '');

                setWebName(res.data.webName || '');
                setAddress(res.data.address || '');
                setPhone(res.data.phone || '');
                setSupportEmail(res.data.supportEmail || '');
                setServiceTime(res.data.serviceTime || '');

                setRunningSettings(res.data.runningSettings || {});
            }
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRunningSettings();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const formFields = [
        {
            id: 'bkash',
            label: 'bKash Number',
            value: bkash,
            setValue: setBkash,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'nagad',
            label: 'Nagad Number',
            value: nagad,
            setValue: setNagad,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'rocket',
            label: 'Rocket Number',
            value: rocket,
            setValue: setRocket,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'upay',
            label: 'Upay Number',
            value: upay,
            setValue: setUpay,
            icon: Smartphone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'webName',
            label: 'Website Name',
            value: webName,
            setValue: setWebName,
            icon: Globe,
            placeholder: 'Enter website name',
            type: 'text'
        },
        {
            id: 'address',
            label: 'Business Address',
            value: address,
            setValue: setAddress,
            icon: MapPin,
            placeholder: 'Enter full address',
            type: 'text'
        },
        {
            id: 'phone',
            label: 'Contact Phone',
            value: phone,
            setValue: setPhone,
            icon: Phone,
            placeholder: '+880 1XXX-XXXXXX',
            type: 'tel'
        },
        {
            id: 'supportEmail',
            label: 'Support Email',
            value: supportEmail,
            setValue: setSupportEmail,
            icon: Mail,
            placeholder: 'support@example.com',
            type: 'email'
        },
        {
            id: 'serviceTime',
            label: 'Service Hours',
            value: serviceTime,
            setValue: setServiceTime,
            icon: Clock,
            placeholder: '9:00 AM - 6:00 PM',
            type: 'text'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-background rounded-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-4"
                    >
                        <Loader2 className="w-12 h-12 text-primary" />
                    </motion.div>
                    <p className="text-[#080808] font-bold text-lg tracking-tight">Loading settings...</p>
                </motion.div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Grid Configuration</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                                System <span className="text-green-600">Parameters</span>
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4 font-mono italic">Calibrating Platform Core & Financial Gateways</p>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="text-right">
                                 <p className="text-[10px] font-black text-[#080808] uppercase tracking-widest">Version Alpha</p>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">Build 2026.4.15</p>
                             </div>
                             <div className="w-10 h-10 bg-[#080808] rounded-xl flex items-center justify-center">
                                 <SettingsIcon className="text-primary w-5 h-5" />
                             </div>
                        </div>
                    </div>
                </header>

                <div className="space-y-10">
                    {/* Financial Protocol Section */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/5 p-8 sm:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 px-6 py-2 bg-[#080808] rounded-bl-3xl text-[9px] font-black text-primary uppercase tracking-[0.3em] z-10">
                            Financial Protocol
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-4">
                            {formFields.slice(0, 4).map((field) => {
                                const Icon = field.icon;
                                return (
                                    <div key={field.id} className="space-y-3 group/input">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 text-green-600" />
                                            <label htmlFor={field.id} className="text-[10px] font-black text-[#080808] uppercase tracking-widest">
                                                {field.label}
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id={field.id}
                                                type={field.type}
                                                value={field.value}
                                                onChange={(e) => field.setValue(e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-gray-300"
                                            />
                                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-focus-within/input:w-full transition-all duration-500 rounded-full"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Global Matrix Section */}
                    <div className="bg-[#080808] rounded-[2.5rem] p-8 sm:p-12 border border-white/5 shadow-2xl shadow-black/20 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 px-6 py-2 bg-primary rounded-bl-3xl text-[9px] font-black text-[#080808] uppercase tracking-[0.3em] z-10">
                            Global Matrix
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                            {formFields.slice(4).map((field) => {
                                const Icon = field.icon;
                                return (
                                    <div key={field.id} className="space-y-3 group/input">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 text-primary" />
                                            <label htmlFor={field.id} className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                                                {field.label}
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id={field.id}
                                                type={field.type}
                                                value={field.value}
                                                onChange={(e) => field.setValue(e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-white placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#080808] uppercase tracking-widest">Ready for Sync</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 italic">Confirm all parameters before core injection</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSettings}
                            disabled={saving}
                            className="w-full sm:w-auto px-10 py-5 bg-[#080808] text-primary font-black rounded-2xl shadow-2xl shadow-black/20 hover:bg-white hover:text-[#080808] hover:border hover:border-[#080808] transition-all duration-500 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Core Injection
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Visual Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-[-1]" 
                 style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
        </div>
    );
};

export default Settings;
