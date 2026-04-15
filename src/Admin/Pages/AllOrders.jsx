import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { motion } from 'framer-motion';
import {
    Loader2,
    Search,
    XCircle,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                const res = await api.get('/order');
                const data = res.data || [];
                setOrders(data);
                setFilteredOrders(data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load your orders');
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredOrders(orders);
            return;
        }

        const term = searchTerm.toLowerCase();
        const results = orders.filter((order) =>
            order.planName?.toLowerCase().includes(term) ||
            order.transactionId?.toLowerCase().includes(term) ||
            order.status?.toLowerCase().includes(term) ||
            String(order.amount || '').includes(term)
        );

        setFilteredOrders(results);
    }, [searchTerm, orders]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'approved') {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        if (s === 'pending') {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
        if (s === 'rejected') {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-8 relative overflow-hidden">
            {/* Background Decor */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
 
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                             <div className="flex items-center gap-2 mb-4">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Transaction Hub</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                                Operational <span className="text-green-600">Ledger</span>
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4 font-mono italic">
                                Auditing <span className="text-green-600">{filteredOrders?.length}</span> Secured Log Entries in the Current Sector
                            </p>
                        </div>
 
                        <div className="relative w-full lg:w-96 group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-300" size={20} />
                            <input
                                type="text"
                                placeholder="PROBE LOGS BY PLAN, TRXID, STATUS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-12 py-5 rounded-2xl border-2 border-gray-100 focus:border-[#080808] focus:ring-0 transition-all duration-500 outline-none bg-white shadow-2xl shadow-black/5 text-[11px] font-black uppercase tracking-[0.2em] text-[#080808] placeholder:text-gray-300"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <XCircle size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>
 
                {filteredOrders?.length === 0 ? (
                    <div className="bg-gray-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                        <AlertCircle className="w-20 h-20 text-gray-200 mx-auto mb-8" />
                        <h3 className="text-xl font-black text-[#080808] uppercase tracking-widest mb-4">Registry Null</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                            {searchTerm ? 'SEARCH VECTOR RETURNED ZERO MATCHES' : 'LEDGER DATABASE IS CURRENTLY DEVOID OF ENTRIES'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/10 overflow-hidden">
                        <div className="bg-[#080808] px-8 py-6 flex items-center justify-between border-b border-primary/20 text-white">
                             <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                 <span className="text-[11px] font-black uppercase tracking-[0.3em]">Real-time Transaction Stream</span>
                             </div>
                             <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-2 rounded-xl">
                                {filteredOrders.length} SECURED LOGS
                             </span>
                        </div>
                        
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        {['Product Protocol', 'Yield Vector', 'Timestamp', 'Process State', 'Hash Identifier'].map((header) => (
                                            <th key={header} className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order?._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="group hover:bg-gray-50/50 transition-all duration-300"
                                        >
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-[11px] font-black text-[#080808] uppercase tracking-tight group-hover:text-green-600 transition-colors">
                                                    {order?.planName || '—'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-xs font-black text-[#080808]">
                                                    ৳{Number(order?.amount || 0).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {formatDate(order?.orderDate)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                        (order?.status || '').toLowerCase() === 'approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                        (order?.status || '').toLowerCase() === 'pending' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-rose-500'
                                                    }`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                        (order?.status || '').toLowerCase() === 'approved' ? 'text-green-600' :
                                                        (order?.status || '').toLowerCase() === 'pending' ? 'text-amber-600' : 'text-rose-500'
                                                    }`}>
                                                        {order?.status || 'UNKNOWN'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-[10px] font-black text-gray-300 font-mono uppercase tracking-widest hover:text-[#080808] transition-colors cursor-help" title={order.transactionId}>
                                                    {order?.transactionId?.slice(0, 14) || '—'}
                                                    {(order?.transactionId?.length || 0) > 14 ? '...' : ''}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
 
                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Grid Synchronization Active</span>
                             </div>
                             <p className="text-[9px] font-black text-[#080808] uppercase tracking-[0.2em] opacity-40 italic">Industrial Core Alpha v2.0</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none z-[-1]" 
                 style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
        </div>
    );
};

export default AllOrders;
