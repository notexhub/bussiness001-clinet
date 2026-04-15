import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ListPlus,
    Settings,
    Sparkles,
    Layers,
    Video
} from 'lucide-react';
import AddNewPlatform from '../Component/AddNewPlatform';
import ManagePlatform from '../Component/ManagePlatform';
import AddNewSubscription from './AddNewSubscription';
import ManageSubscription from './ManageSubscription';
import ManageSubs_Category from './ManageSubs_Category';
import EditCategory from './EditCategory';
import AddNewCoupon from '../Component/AddNewCoupon';
import ManageCoupons from '../Component/ManageCoupons';
import AddVideoForm from '../Component/AddVideoForm';
import ManageCredantialVideo from '../Component/ManageCredantialVideo';
import ManageManageCookieVideo from '../Component/ManageManageCookieVideo';
import ManageManageLoginVideo from '../Component/ManageManageLoginVideo';
import AddCockies from '../Component/AddCockies';
import ManageCockies from '../Component/ManageCockies';
import ManageCookiesVideo from '../Component/ManageCockiesVideo';


const ManagementAll = () => {
    const allTabs = [
        { name: "Registry Ops", icon: ListPlus },
        { name: "System Control", icon: Settings },
        { name: "Vector Injection", icon: ListPlus },
        { name: "Secure Cache", icon: Settings },
        { name: "Module Forge", icon: ListPlus },
        { name: "Fleet Control", icon: Settings },
        { name: "Sector Config", icon: ListPlus },
        { name: "Grid Mapping", icon: Settings },
        { name: "Token Mint", icon: ListPlus },
        { name: "Audit Station", icon: Settings },
        { name: "Auth Feed", icon: Video },
        { name: "Signal Monitor", icon: Video },
        { name: "Cache Stream", icon: Video },
        { name: "Stream Audit", icon: Video },
    ];

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-8 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Core Infrastructure</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                                Management <span className="text-green-600">Terminal</span>
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4">Unified Control Interface for Subscription Vectors & Modules</p>
                        </div>
                        
                        <div className="hidden lg:flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="text-right">
                                 <p className="text-[10px] font-black text-[#080808] uppercase tracking-widest">System Status</p>
                                 <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Operational</p>
                             </div>
                             <div className="w-10 h-10 bg-[#080808] rounded-xl flex items-center justify-center">
                                 <Sparkles className="text-primary w-5 h-5" />
                             </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
                    {allTabs.map((tab, index) => {
                        const isActive = activeTab === index;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-500 group ${
                                    isActive 
                                    ? 'bg-[#080808] border-primary shadow-2xl shadow-black/20 scale-[1.02]' 
                                    : 'bg-white border-gray-100 hover:border-[#080808] shadow-sm'
                                }`}
                            >
                                <div className={`mb-3 p-3 rounded-xl transition-colors duration-500 ${
                                    isActive ? 'bg-primary/10' : 'bg-gray-50 group-hover:bg-[#080808]/5'
                                }`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-[#080808]'}`} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight transition-colors duration-500 ${
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#080808]'
                                }`}>
                                    {tab.name}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTabGlow"
                                        className="absolute -inset-1 bg-primary/5 blur-xl -z-10 rounded-3xl"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="relative group">
                    {/* Visual Decor */}
                    <div className="absolute -top-6 left-8 px-4 py-1 bg-[#080808] rounded-t-xl text-[8px] font-black text-primary uppercase tracking-[0.4em] z-10 border-x border-t border-primary/20">
                        Operational Environment
                    </div>
                    
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/5 p-6 sm:p-10 relative z-20 overflow-hidden min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {activeTab === 0 && <AddNewPlatform />}
                                {activeTab === 1 && <ManagePlatform />}
                                {activeTab === 2 && <AddCockies />}
                                {activeTab === 3 && <ManageCockies />}
                                {activeTab === 4 && <AddNewSubscription />}
                                {activeTab === 5 && <ManageSubscription />}
                                {activeTab === 6 && <ManageSubs_Category />}
                                {activeTab === 7 && <EditCategory />}
                                {activeTab === 8 && <AddNewCoupon />}
                                {activeTab === 9 && <ManageCoupons />}
                                {activeTab === 10 && <AddVideoForm title="Add Login Video" endpoint="/video" typeLabel="Login" />}
                                {activeTab === 11 && <ManageCredantialVideo />}
                                {activeTab === 12 && <AddVideoForm title="Add Cookies Video" endpoint="/cookies-video" typeLabel="Cookies" />}
                                {activeTab === 13 && <ManageCookiesVideo />}
                            </motion.div>
                        </AnimatePresence>

                        {/* Background Texture */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-[-1]" 
                             style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                    </div>
                    
                    {/* Shadow Accent */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-primary/5 blur-3xl rounded-full -z-10"></div>
                </div>
            </div>

            {/* Quick Support / Sparkles Button */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#080808] hover:bg-primary group rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 transition-all duration-500 z-50">
                <Sparkles className="text-primary group-hover:text-[#080808] w-6 h-6 transition-colors duration-500" />
            </button>
        </div>
    );
};

export default ManagementAll;
