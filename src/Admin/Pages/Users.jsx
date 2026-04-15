import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users as UsersIcon,
    Search,
    Loader2,
    Download,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/api/axios';

// Sub-components
import UserCard from '../Components/UserCard';
import UserDetailModal from '../Components/UserDetailModal';

const Users = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [orders, setOrders] = useState([]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const [usersRes, ordersRes] = await Promise.all([
                api.get('/users'),
                api.get('/order')
            ]);

            if (usersRes.data) {
                setUsers(usersRes.data);
                setFilteredUsers(usersRes.data);
            }
            if (ordersRes.data) {
                setOrders(ordersRes.data);
            }
        } catch (error) {
            toast.error('Failed to load users');
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
        toast.success('Users refreshed!');
    };

    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    useEffect(() => {
        loadUsers();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        hover: {
            y: -4,
            scale: 1.02,
            transition: {
                duration: 0.2
            }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.2
            }
        }
    };

    const handleViewUser = async (user) => {
        setSelectedUser(user);
        const filterOrders = orders.filter(o => o?.userEmail === user?.email);
        setSelectedOrders(filterOrders);
        setShowModal(true);
    };

 const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
        setLoading(true);

        const res = await api.delete(`/users/${userId}`);
        if (res.data.deletedCount > 0) {
            toast.success("User deleted successfully");
            await loadUsers();
        } else {
            toast.error("User not found");
        }

    } catch (error) {
        toast.error("Failed to delete user");
        console.error("Delete error:", error);
    } finally {
        setLoading(false);
    }
};
    const handleExport = () => {
        const csvContent = [
            ['Name', 'Email'],
            ...filteredUsers.map(user => [user?.name || '', user?.email || ''])
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        toast.success('Users exported!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
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
                        <Loader2 className="w-16 h-16 text-primary" />
                    </motion.div>
                    <p className="text-[#080808] font-bold text-lg tracking-tight">Loading users...</p>
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
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                             <div className="flex items-center gap-2 mb-4">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Node Registry</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                                Entity <span className="text-green-600">Assets</span>
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4 font-mono italic">
                                Monitoring <span className="text-green-600">{filteredUsers?.length}</span> Active Identified Protocols in Current Grid
                            </p>
                        </div>
 
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-[#080808] hover:text-white transition-all duration-500 shadow-xl shadow-black/5"
                            >
                                <motion.div
                                    animate={refreshing ? { rotate: 360 } : {}}
                                    transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
                                >
                                    <RefreshCw className="w-6 h-6 text-green-600" />
                                </motion.div>
                            </motion.button>
 
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExport}
                                className="px-8 py-4 bg-[#080808] text-primary font-black rounded-2xl shadow-2xl shadow-black/20 hover:bg-white hover:text-[#080808] hover:border hover:border-[#080808] transition-all duration-500 uppercase tracking-[0.2em] text-[11px] flex items-center gap-3"
                            >
                                <Download className="w-5 h-5" />
                                <span className="hidden sm:inline">Export CSV</span>
                            </motion.button>
                        </div>
                    </div>
 
                    <div className="mt-10 relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-primary transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="INITIALIZE SEARCH BY ENTITY IDENTIFIER OR PROTOCOL EMAIL..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 rounded-[2rem] border-2 border-gray-100 focus:border-[#080808] focus:ring-0 transition-all duration-500 outline-none bg-white/80 backdrop-blur-md shadow-2xl shadow-black/5 text-[11px] font-black uppercase tracking-[0.2em] text-[#080808] placeholder:text-gray-300"
                        />
                    </div>
                </header>
 
                {filteredUsers.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100"
                    >
                        <AlertCircle className="w-20 h-20 text-gray-200 mx-auto mb-8" />
                        <h3 className="text-xl font-black text-[#080808] uppercase tracking-widest mb-4">No Entities Detected</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                            {searchTerm ? 'ADJUST PROTOCOL FILTERS / SOURCE NOT FOUND' : 'GRID EMPTY / NO DATA POINTS REGISTERED'}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                variants={cardVariants}
                                handleViewUser={handleViewUser}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
 
            <UserDetailModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={selectedUser}
                orders={selectedOrders}
                handleDeleteUser={handleDeleteUser}
                variants={modalVariants}
            />
        </div>
    );
};

export default Users;
