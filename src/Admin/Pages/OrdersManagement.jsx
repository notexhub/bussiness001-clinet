import React, { useState } from 'react';
import AllOrders from './AllOrders';
import ManageOrders from './ManageOrders';

const OrdersManagement = () => {
    const [activeTab, setActiveTab] = useState(0);

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
                    System Registry
                </button>
                <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 py-4 px-8 rounded-2xl font-black transition-all duration-500 uppercase tracking-widest text-[10px] ${activeTab === 1
                        ? 'bg-[#080808] text-primary shadow-2xl shadow-black/20 scale-[1.02] border border-primary/20'
                        : 'text-gray-400 hover:text-[#080808] hover:bg-gray-50'
                        }`}
                >
                    Operational Queue
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/5 overflow-hidden min-h-[60vh] relative">
                <div className="p-1">
                    {activeTab === 0 ? (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <AllOrders />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <ManageOrders />
                        </div>
                    )}
                </div>
                
                {/* Visual Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
        </div>
    );
};

export default OrdersManagement;