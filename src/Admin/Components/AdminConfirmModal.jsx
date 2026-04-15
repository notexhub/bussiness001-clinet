import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const AdminConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        primary: 'bg-primary hover:bg-[#bbf045] text-[#080808] shadow-[0_4px_15px_rgba(132,204,22,0.3)]',
        danger: 'bg-[#080808] hover:bg-red-600 text-white shadow-xl shadow-black/10 hover:shadow-red-500/20',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200',
    };

    const headerStyles = {
        primary: 'bg-[#080808]',
        danger: 'bg-red-600',
        success: 'bg-green-600',
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-[#080808]/40 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`px-8 py-6 border-b ${headerStyles[variant] || headerStyles.primary} flex items-center gap-4 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <AlertCircle className="h-7 w-7 text-primary relative z-10" />
                        <h3 className="text-xl font-black text-white tracking-tight logoFont relative z-10 uppercase tracking-widest">{title}</h3>
                    </div>

                    <div className="p-8">
                        <p className="text-gray-500 font-bold leading-relaxed italic text-lg tracking-tight">"{message}"</p>
                    </div>

                    <div className="px-8 py-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 hover:bg-white hover:text-[#080808] hover:border-[#080808] transition-all font-black uppercase tracking-widest text-xs"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${variantStyles[variant] || variantStyles.primary}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminConfirmModal;
