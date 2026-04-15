import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, CreditCard, Trash2 } from 'lucide-react';

const UserDetailModal = ({
    isOpen,
    onClose,
    user,
    orders,
    handleDeleteUser,
    variants
}) => {
    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 z-50 px-4"
            >
                <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-0 pointer-events-none"></div>

                    {/* Header */}
                    <div className="bg-[#080808] p-8 sm:p-12 relative overflow-hidden shrink-0">
                        <div className="flex items-center gap-6 sm:gap-8 relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary text-[#080808] flex items-center justify-center text-4xl sm:text-5xl font-black shadow-2xl shadow-primary/20"
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || "?"}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-0.5 bg-primary rounded-full"></span>
                                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em]">Protocol Identifier</span>
                                </div>
                                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none logoFont truncate">
                                    {user?.name || 'Unknown'}
                                </h2>
                                <p className="text-gray-500 font-bold text-[11px] sm:text-xs mt-3 uppercase tracking-widest truncate opacity-70 italic font-mono">
                                    Hash: {user?.email || 'NOTREGISTERED.DOM'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-10 custom-scrollbar relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="w-4 h-4 text-primary" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal Designation</p>
                                </div>
                                <p className="text-xl font-black text-[#080808] uppercase tracking-tight bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 italic">
                                    {user?.name || 'N/A'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comm Link</p>
                                </div>
                                <p className="text-sm font-black text-[#080808] lowercase tracking-tight bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 truncate">
                                    {user?.email || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#080808] rounded-xl">
                                        <CreditCard className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-[#080808] uppercase tracking-[0.2em] logoFont">
                                        Transmission History
                                    </h3>
                                </div>
                                {orders?.length > 0 && (
                                    <span className="text-[10px] font-black bg-primary/10 text-[#080808] px-4 py-1.5 rounded-full uppercase tracking-widest">
                                        {orders?.length} LOGS FOUND
                                    </span>
                                )}
                            </div>

                            {orders?.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const orderDate = new Date(order?.orderDate || Date.now());
                                        const validUntil = new Date(orderDate);
                                        validUntil.setDate(orderDate.getDate() + (order?.validityDays || 0));

                                        return (
                                            <div
                                                key={order?._id}
                                                className="p-6 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-black/5 group hover:border-[#080808] transition-all duration-500 relative overflow-hidden"
                                            >
                                                <div className="flex items-center justify-between relative z-10 gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Module Protocol</p>
                                                        </div>
                                                        <p className="text-xl font-black text-[#080808] uppercase tracking-tighter truncate group-hover:text-green-600 transition-colors">
                                                            {order?.planName || 'Standard Plan'}
                                                        </p>
                                                        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4">
                                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                INIT: <span className="text-[#080808]">{orderDate.toLocaleDateString("en-GB")}</span>
                                                            </div>
                                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                EXP: <span className="text-green-600">{validUntil.toLocaleDateString("en-GB")}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3">
                                                         <span
                                                            className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border
                                                            ${(order?.status || '').toLowerCase() === "approved" || (order?.status || '').toLowerCase() === "active" || (order?.status || '').toLowerCase() === "completed"
                                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                                        : (order?.status || '').toLowerCase() === "pending"
                                                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                                                    }`}
                                                        >
                                                            {order?.status || 'Unknown'}
                                                        </span>
                                                        <p className="text-sm font-black text-[#080808]">৳{order?.amount?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-16 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Zero data points in transmission registry</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 sm:p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 py-5 px-8 bg-white border border-gray-200 text-[#080808] font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#080808] hover:text-white"
                        >
                            Dismiss Interface
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                handleDeleteUser(user?._id);
                                onClose();
                            }}
                            className="flex-1 py-5 px-8 bg-[#080808] text-rose-500 font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white shadow-2xl shadow-black/20"
                        >
                            <Trash2 className="w-5 h-5 text-primary" />
                            Terminate Entity
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserDetailModal;
