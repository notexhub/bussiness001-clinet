import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, XCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';

const OrderDetailModal = ({
    isOpen,
    onClose,
    order,
    formatDate,
    getStatusStyles,
    updateStatus,
    deleteOrder
}) => {
    if (!isOpen || !order) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-3xl max-h-[95vh] overflow-y-auto relative no-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 flex items-center justify-between z-20 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#080808] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                                <Eye className="text-primary" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                                    Entity <span className="text-green-600">Report</span>
                                </h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">ID: #{order?._id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-[#080808]"
                        >
                            <XCircle size={28} />
                        </button>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Status Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#080808] p-8 rounded-3xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                             
                             <div className="relative z-10 space-y-3">
                                <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Operational Status</h3>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border ${getStatusStyles(
                                            order?.status
                                        )}`}
                                    >
                                        {order?.status || 'UNKNOWN'}
                                    </span>
                                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest">
                                        <Clock size={14} className="text-primary" />
                                        {formatDate(order?.orderDate)}
                                    </div>
                                </div>
                             </div>

                            <div className="relative z-10 flex flex-wrap gap-3">
                                {order?.status?.toLowerCase() !== 'approved' && (
                                    <button
                                        onClick={() => {
                                            updateStatus(order?._id, 'approved');
                                            onClose();
                                        }}
                                        className="px-6 py-3 bg-primary text-[#080808] hover:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/20 flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        Authorize
                                    </button>
                                )}

                                {order?.status?.toLowerCase() !== 'pending' && (
                                    <button
                                        onClick={() => {
                                            updateStatus(order?._id, 'pending');
                                            onClose();
                                        }}
                                        className="px-6 py-3 bg-white/10 text-white hover:bg-white hover:text-[#080808] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/10 flex items-center gap-2"
                                    >
                                        <Clock size={16} />
                                        In Queue
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        deleteOrder(order?._id);
                                        onClose();
                                    }}
                                    className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-red-500/20 flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Terminate
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm group hover:border-primary/20 transition-all">
                                <h3 className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-50 pb-4">
                                    Entity Information
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Entity Name</span>
                                        <span className="text-xl font-black text-[#080808] tracking-tight truncate">
                                            {order?.userName || '—'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Communication Channel</span>
                                        <span className="text-base font-bold text-gray-700 tracking-tight transition-colors group-hover:text-green-600">
                                            {order?.userEmail || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm group hover:border-primary/20 transition-all">
                                <h3 className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-50 pb-4">
                                    Protocol Analysis
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plan Specification</span>
                                        <span className="text-xl font-black text-[#080808] tracking-tight">
                                            {order?.planName || '—'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Financial Value</span>
                                        <span className="text-3xl font-black text-green-600 tracking-tighter">
                                            ৳{Number(order?.amount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
                                <h3 className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 border-b border-gray-50 pb-4">
                                    Security & Transaction Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Vector</span>
                                        <span className="px-4 py-2 bg-[#080808] text-white rounded-xl text-[10px] font-black uppercase tracking-widest w-fit">
                                            {order?.paymentMethod || '—'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Gateway Source</span>
                                        <span className="text-lg font-black text-[#080808] tracking-tighter">
                                            {order?.senderNumber || '—'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Protocol Hash</span>
                                        <code className="bg-gray-100 text-[#080808] px-4 py-2 rounded-xl font-mono text-[11px] font-bold border border-gray-200">
                                            {order?.transactionId || 'NOT_FOUND'}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {
                                order?.couponCode && (
                                    <div className="md:col-span-2 bg-[#080808] rounded-[2.5rem] p-10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                        
                                        <h3 className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">
                                            Loyalty Voucher Activation
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Voucher Code</span>
                                                <span className="text-2xl font-black text-primary tracking-tighter uppercase font-mono">
                                                    {order?.couponCode || '—'}
                                                </span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Applied Rebate</span>
                                                <span className="text-3xl font-black text-white tracking-tighter">
                                                    - ৳{order?.discountAmount || '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderDetailModal;
