import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    CreditCard,
    Tag,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Activity,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    RefreshCw
} from 'lucide-react';

const AdminDash = () => {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [totalOrders, setTotalOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [totalUser, setTotalUser] = useState([]);
    const [totalSubscription, setTotalSubscription] = useState([]);
    const [totalCoupon, setTotalCoupon] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [orderRes, userRes, subscriptionRes, couponRes] = await Promise.all([
                api.get('/order'),
                api.get('/users'),
                api.get('/subscription'),
                api.get('/coupon'),
            ]);

            if (orderRes.data) {
                setTotalOrders(orderRes.data.length);
                setPendingOrders(orderRes.data.filter(order => order.status === 'pending'));
                setApprovedOrders(orderRes.data.filter(order => order.status === 'completed'));
                setRejectedOrders(orderRes.data.filter(order => order.status === 'failed' || order.status === 'cancelled'));
            }
            if (userRes.data) {
                setTotalUser(userRes.data);
            }
            if (subscriptionRes.data) {
                setTotalSubscription(subscriptionRes.data);
            }
            if (couponRes.data) {
                setTotalCoupon(couponRes.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const stats = [
        {
            title: 'Inventory Volume',
            value: totalOrders?.toLocaleString() || '0',
            icon: ShoppingCart,
            change: '+12.5%',
            trend: 'up',
            color: 'from-[#080808] to-gray-800',
            bgColor: 'bg-[#080808]/5',
            iconColor: 'text-[#080808]'
        },
        {
            title: 'Entity Database',
            value: totalUser?.length?.toLocaleString() || '0',
            icon: Users,
            change: '+8.2%',
            trend: 'up',
            color: 'from-primary to-green-600',
            bgColor: 'bg-primary/10',
            iconColor: 'text-green-600'
        },
        {
            title: 'Active Architectures',
            value: totalSubscription?.length?.toLocaleString() || '0',
            icon: CreditCard,
            change: '+23.1%',
            trend: 'up',
            color: 'from-green-500 to-primary',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Protocol Vouchers',
            value: totalCoupon?.length?.toLocaleString() || '0',
            icon: Tag,
            change: '-3.4%',
            trend: 'down',
            color: 'from-gray-700 to-[#080808]',
            bgColor: 'bg-gray-100',
            iconColor: 'text-gray-600'
        }
    ];

    const orderStats = [
        {
            title: 'Awaiting Action',
            value: pendingOrders?.length || 0,
            icon: Clock,
            color: 'from-amber-400 to-amber-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            percentage: totalOrders > 0 ? (((pendingOrders?.length || 0) / totalOrders) * 100).toFixed(1) : 0
        },
        {
            title: 'Authorized',
            value: approvedOrders?.length || 0,
            icon: CheckCircle,
            color: 'from-primary to-green-600',
            bgColor: 'bg-primary/10',
            iconColor: 'text-green-600',
            percentage: totalOrders > 0 ? (((approvedOrders?.length || 0) / totalOrders) * 100).toFixed(1) : 0
        },
        {
            title: 'Terminated',
            value: rejectedOrders?.length || 0,
            icon: XCircle,
            color: 'from-red-500 to-red-700',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-500',
            percentage: totalOrders > 0 ? (((rejectedOrders?.length || 0) / totalOrders) * 100).toFixed(1) : 0
        }
    ];

    return (
        <div className="min-h-screen bg-background border border-gray-100 rounded-[2.5rem] p-4 md:p-8 lg:p-12 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-0"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none -z-0"></div>

            <div className="mb-14 relative z-10 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#080808] logoFont mb-3 tracking-tighter uppercase">
                            System <span className="text-green-600">Overview</span>
                        </h1>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-gray-100 w-fit shadow-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#080808]">{today}</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="group flex items-center gap-3 px-8 py-4 bg-[#080808] text-white font-black rounded-2xl shadow-xl shadow-black/10 hover:shadow-primary/20 hover:text-primary transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs border border-transparent hover:border-primary/30"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-primary' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                        <span>Synchronize Data</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Activity className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Indexing Infrastructure...</p>
                </div>
            )}

            {!loading && (
                <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.title}
                                className="group relative bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden"
                                style={{
                                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`${stat.bgColor} p-4 rounded-2xl group-hover:bg-primary transition-colors duration-500 group-hover:scale-110`}>
                                            <stat.icon className={`w-6 h-6 ${stat.iconColor} group-hover:text-[#080808] transition-colors`} />
                                        </div>
                                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            } border border-transparent group-hover:border-current transition-all`}>
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="w-3 h-3" />
                                            ) : (
                                                <ArrowDownRight className="w-3 h-3" />
                                            )}
                                            <span>{stat.change}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 font-sans group-hover:text-primary transition-colors">{stat.title}</h3>
                                    <p className="text-4xl font-black text-[#080808] tracking-tighter group-hover:translate-x-1 transition-transform">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {orderStats.map((stat, index) => (
                            <div
                                key={stat.title}
                                className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                                style={{
                                    animation: `slideInUp 0.6s ease-out ${0.4 + index * 0.1}s both`
                                }}
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`${stat.bgColor} p-4 rounded-2xl group-hover:rotate-12 transition-transform`}>
                                            <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                                        </div>
                                        <span className={`text-xs font-black tracking-[0.2em] uppercase ${stat.iconColor} opacity-50 group-hover:opacity-100 transition-opacity`}>{stat.percentage}% SHARE</span>
                                    </div>

                                    <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 font-sans">{stat.title} Protocol</h3>
                                    <div className="flex items-end justify-between gap-4">
                                        <p className="text-5xl font-black text-[#080808] tracking-tighter">{stat.value.toLocaleString()}</p>
                                    </div>

                                    <div className="mt-8 h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <div
                                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                                            style={{ width: mounted ? `${stat.percentage}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        <div
                            className="bg-[#080808] rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group border border-primary/10"
                            style={{ animation: 'slideInUp 0.6s ease-out 0.7s both' }}
                        >
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 bg-primary rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-[#080808]" />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter logoFont">Global <span className="text-primary">Performance</span></h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Protocol Success Rate</span>
                                            <span className="text-2xl font-black text-primary tracking-tighter">92.7%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden p-[2px]">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1500 ease-in-out"
                                                style={{ width: mounted ? '92.7%' : '0%' }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">User Retention Hierarchy</span>
                                            <span className="text-2xl font-black text-primary tracking-tighter">85.3%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden p-[2px]">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1500 ease-in-out"
                                                style={{ width: mounted ? '85.3%' : '0%' }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Infrastructure Expansion</span>
                                            <span className="text-2xl font-black text-primary tracking-tighter">78.9%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden p-[2px]">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1500 ease-in-out"
                                                style={{ width: mounted ? '78.9%' : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
};

export default AdminDash;
