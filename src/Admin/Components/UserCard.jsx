import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Eye } from 'lucide-react';

const UserCard = ({ user, variants, handleViewUser }) => {
    return (
        <motion.div
            variants={variants}
            whileHover="hover"
            className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-black/5 hover:border-[#080808] transition-all duration-500 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -translate-y-12 translate-x-12 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>

            <div className="flex items-start justify-between mb-8 relative z-10">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl bg-[#080808] text-primary flex items-center justify-center font-black text-2xl shadow-2xl shadow-black/20"
                >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </motion.div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewUser(user)}
                        className="w-12 h-12 rounded-2xl bg-gray-50 text-[#080808] hover:bg-primary transition-all duration-500 flex items-center justify-center border border-gray-100"
                    >
                        <Eye className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 h-0.5 bg-primary rounded-full"></span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Digital Identity</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#080808] tracking-tighter uppercase leading-tight truncate">
                        {user?.name || 'Unknown Protocol'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="p-1 bg-primary/10 rounded-lg">
                             <Mail className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 lowercase tracking-tight truncate opacity-80">{user?.email || 'NOTREGISTERED.DOM'}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Secure</span>
                    </div>
                    <Shield className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>

            {/* Subtle Gradient Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
};

export default UserCard;
