import React from 'react';
import CouponSells from './CouponSells';
import CopyBtnVissibilty from './CopyBtnVissibilty';
import { motion } from 'framer-motion';

const Others = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    return (
        <div className="w-full relative">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10"></div>
            
            <div className="mb-8 bg-white/80 backdrop-blur-md p-2 rounded-[2rem] shadow-xl shadow-black/5 border border-gray-100 flex gap-2">
                <button
                    onClick={() => setActiveTab(0)}
                    className={`flex-1 py-4 px-8 rounded-2xl font-black transition-all duration-500 uppercase tracking-widest text-[10px] ${activeTab === 0
                        ? 'bg-[#080808] text-primary shadow-2xl shadow-black/20 scale-[1.02] border border-primary/20'
                        : 'text-gray-400 hover:text-[#080808] hover:bg-gray-50'
                        }`}
                >
                    Yield Analytics
                </button>
                <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 py-4 px-8 rounded-2xl font-black transition-all duration-500 uppercase tracking-widest text-[10px] ${activeTab === 1
                        ? 'bg-[#080808] text-primary shadow-2xl shadow-black/20 scale-[1.02] border border-primary/20'
                        : 'text-gray-400 hover:text-[#080808] hover:bg-gray-50'
                        }`}
                >
                    System Interface
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/5 overflow-hidden min-h-[60vh] relative">
                <div className="p-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 0 && (
                            <motion.div
                                key="coupons"
                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -30 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <CouponSells />
                            </motion.div>
                        )}
                        {activeTab === 1 && (
                            <motion.div
                                key="visibility"
                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -30 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <CopyBtnVissibilty />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
        </div>
    );
};

export default Others;