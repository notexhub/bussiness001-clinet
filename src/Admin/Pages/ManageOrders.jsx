import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    Search,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Sub-components
import OrderTable from '../Components/OrderTable';
import OrderDetailModal from '../Components/OrderDetailModal';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/order');
            const data = res.data || [];
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredOrders(orders);
            return;
        }

        const term = searchTerm.toLowerCase();
        const results = orders.filter(
            (o) =>
                o.userEmail?.toLowerCase().includes(term) ||
                o.userName?.toLowerCase().includes(term) ||
                o.planName?.toLowerCase().includes(term) ||
                o.transactionId?.toLowerCase().includes(term) ||
                o.senderNumber?.toLowerCase().includes(term)
        );

        setFilteredOrders(results);
    }, [searchTerm, orders]);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/order/${id}`, { status });
            toast.success(`Order updated to ${status}`);
            loadOrders();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Delete this order permanently?')) return;

        try {
            await api.delete(`/order/${id}`);
            toast.success('Order deleted successfully');
            loadOrders();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete order');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusStyles = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'approved') return 'bg-green-50 text-green-600 border-green-100';
        if (s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
        if (s === 'rejected') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-gray-50 text-gray-500 border-gray-100';
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronizing Registry...</p>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                        Operational <span className="text-green-600">Queue</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">Active Registry Management & Protocol Authorization</p>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH ENTITY OR PROTOCOL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-xl shadow-black/5 placeholder:text-gray-300"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <XCircle size={18} />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {filteredOrders.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-2xl shadow-black/5"
                    >
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <AlertCircle className="w-12 h-12 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-[#080808] uppercase tracking-tight mb-3">
                            Registry Empty
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] max-w-xs mx-auto">
                            {searchTerm ? `No entities match the query "${searchTerm}"` : 'No operational protocols registered in the current sector'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                         <div className="absolute -top-6 right-8 pointer-events-none">
                             <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.5em] blur-[1px]">AUTHORIZED ACCESS ONLY</div>
                         </div>
                        <OrderTable
                            orders={orders}
                            filteredOrders={filteredOrders}
                            formatDate={formatDate}
                            getStatusStyles={getStatusStyles}
                            handleViewDetails={handleViewDetails}
                            updateStatus={updateStatus}
                            deleteOrder={deleteOrder}
                            loadOrders={loadOrders}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <OrderDetailModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                order={selectedOrder}
                formatDate={formatDate}
                getStatusStyles={getStatusStyles}
                updateStatus={updateStatus}
                deleteOrder={deleteOrder}
            />
        </div>
    );
};

export default ManageOrders;
