import React, { useEffect, useState, useMemo } from 'react';
import api from '@/api/axios';
import {
    TrendingUp,
    DollarSign,
    Tag,
    ShoppingCart,
    Users,
    Percent,
    Filter,
    X,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    RefreshCw,
    Loader2
} from 'lucide-react';
import useCouponsData from '../Hooks/useCouponsData';

const CouponSells = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const { couponLoading, couponData } = useCouponsData();
    const [selectedCoupon, setSelectedCoupon] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/order');
            const filterData = (res.data || []).filter((item) => item.couponCode);
            setData(filterData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        let result = data;

        if (selectedCoupon !== 'all') {
            result = result.filter(item => item.couponCode === selectedCoupon);
        }

        if (selectedStatus !== 'all') {
            result = result.filter(item => item.status === selectedStatus);
        }

        return result;
    }, [data, selectedCoupon, selectedStatus]);

    const uniqueCouponCodes = useMemo(() => {
        return [...new Set(data.map(item => item.couponCode))].sort();
    }, [data]);

    const uniqueStatuses = useMemo(() => {
        return [...new Set(data.map(item => item.status))].sort();
    }, [data]);

    const stats = useMemo(() => {
        const totalOrders = filteredData.length;
        const totalRevenue = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalDiscount = filteredData.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
        const uniqueUsers = new Set(filteredData.map(item => item.userEmail)).size;
        const uniqueCoupons = new Set(filteredData.map(item => item.couponCode)).size;
        const avgDiscount = totalOrders > 0 ? (totalDiscount / totalOrders) : 0;
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
        const discountPercentage = totalRevenue > 0 ? ((totalDiscount / (totalRevenue + totalDiscount)) * 100) : 0;

        const couponCount = filteredData.reduce((acc, item) => {
            acc[item.couponCode] = (acc[item.couponCode] || 0) + 1;
            return acc;
        }, {});
        const mostUsedCoupon = Object.entries(couponCount).sort((a, b) => b[1] - a[1])[0];

        return {
            totalOrders,
            totalRevenue,
            totalDiscount,
            uniqueUsers,
            uniqueCoupons,
            avgDiscount,
            avgOrderValue,
            discountPercentage,
            mostUsedCoupon: mostUsedCoupon ? { code: mostUsedCoupon[0], count: mostUsedCoupon[1] } : null
        };
    }, [filteredData]);

    const statusStats = useMemo(() => {
        const statsByStatus = {};

        uniqueStatuses.forEach(status => {
            const statusOrders = filteredData.filter(item => item.status === status);
            const count = statusOrders.length;
            const revenue = statusOrders.reduce((sum, item) => sum + (item.amount || 0), 0);
            const discount = statusOrders.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
            const percentage = filteredData.length > 0 ? ((count / filteredData.length) * 100) : 0;

            statsByStatus[status] = {
                count,
                revenue,
                discount,
                percentage
            };
        });

        return statsByStatus;
    }, [filteredData, uniqueStatuses]);

    const getCouponDetails = (code) => {
        return couponData?.find(c => c.code === code);
    };

    const handleClearFilters = () => {
        setSelectedCoupon('all');
        setSelectedStatus('all');
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "primary" }) => (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-black/5 group hover:border-black transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#080808] transition-colors duration-500">
                    <Icon className="w-6 h-6 text-[#080808] group-hover:text-primary transition-colors duration-500" />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                </div>
            </div>
            <div>
                <p className="text-3xl font-black text-[#080808] tracking-tighter uppercase">{value}</p>
                {subtitle && <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1 opacity-80">{subtitle}</p>}
            </div>
        </div>
    );

    const StatusStatCard = ({ status, data, icon: Icon, color }) => {
        const statusData = data[status] || { count: 0, revenue: 0, discount: 0, percentage: 0 };

        return (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-[#080808] transition-all duration-500">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -translate-y-12 translate-x-12 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#080808] rounded-xl shadow-lg shadow-black/20">
                            <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="text-[11px] font-black text-[#080808] uppercase tracking-widest">{status}</h4>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-primary/10 text-[#080808]">
                        {statusData.percentage.toFixed(1)}%
                    </span>
                </div>

                <div className="space-y-4 relative z-10">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payload</p>
                        <p className="text-3xl font-black text-[#080808] tracking-tight">{statusData.count}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Gross Yield</p>
                            <p className="text-xs font-black text-[#080808]">৳{statusData.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Adjustment</p>
                            <p className="text-xs font-black text-green-600">-৳{statusData.discount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getStatusIcon = (status) => {
        const s = status.toLowerCase();
        if (s === 'approved' || s === 'completed') return CheckCircle;
        if (s === 'pending') return Clock;
        return XCircle;
    };

    const getStatusColor = (status) => {
        const s = status.toLowerCase();
        if (s === 'approved' || s === 'completed') return 'green';
        if (s === 'pending') return 'amber';
        return 'rose';
    };

    const activeFilters = selectedCoupon !== 'all' || selectedStatus !== 'all';

    return (
        <div className="bg-white rounded-[2.5rem] p-1 relative overflow-hidden">
            <div className="p-6 sm:p-10">
                <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Analytics Module</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-[#080808] logoFont tracking-tighter uppercase leading-none">
                            Yield <span className="text-green-600">Reports</span>
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4 text-balance">Comprehensive Analysis of Discount Vectors & Protocol Performance</p>
                    </div>

                    <div className="flex items-center gap-3">
                         <button 
                            onClick={loadData}
                            className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-[#080808] hover:text-white transition-all duration-500 shadow-xl shadow-black/5"
                         >
                            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                         </button>
                    </div>
                </header>

                {loading || couponLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Decrypting Ledger...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="bg-gray-50 rounded-[2rem] p-24 text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-black/5">
                            <Tag className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">No token protocols registered in the current sector.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Filters Panel */}
                        <div className="bg-[#080808] rounded-[2rem] p-8 border border-white/5 shadow-2xl shadow-black/20">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <Filter className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Protocol Filter</h3>
                                </div>
                                {activeFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-black bg-white/5 text-primary rounded-xl hover:bg-white hover:text-[#080808] transition-all duration-500 uppercase tracking-widest"
                                    >
                                        <X className="w-4 h-4" />
                                        Flush Filters
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                                        Token Identifier
                                    </label>
                                    <select
                                        value={selectedCoupon}
                                        onChange={(e) => setSelectedCoupon(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option className="bg-[#080808]" value="all">Global Matrix ({data.length})</option>
                                        {uniqueCouponCodes.map(code => {
                                            const count = data.filter(item => item.couponCode === code).length;
                                            return (
                                                <option className="bg-[#080808]" key={code} value={code}>
                                                    {code} | [{count} NODES]
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                                        Status Vector
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option className="bg-[#080808]" value="all">All Operational States</option>
                                        {uniqueStatuses.map(status => {
                                            const count = data.filter(item => item.status === status).length;
                                            return (
                                                <option className="bg-[#080808]" key={status} value={status}>
                                                    {status.toUpperCase()} | [{count} NODES]
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {selectedCoupon !== 'all' && (
                                    <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5 flex flex-col justify-center">
                                         <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Protocol Metadata</p>
                                        {getCouponDetails(selectedCoupon) ? (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xl font-black text-white tracking-tighter">{selectedCoupon}</p>
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Config: {getCouponDetails(selectedCoupon).discount}% REBATE</p>
                                                </div>
                                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                                    <Tag className="w-6 h-6 text-[#080808]" />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Metadata Encrypted</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={ShoppingCart}
                                title="Protocol Load"
                                value={stats.totalOrders}
                                subtitle={`${activeFilters ? 'Sector Analysis' : 'Total Matrix'}`}
                            />
                            <StatCard
                                icon={DollarSign}
                                title="Net Yield"
                                value={`৳${stats.totalRevenue.toLocaleString()}`}
                                subtitle={`Avg Pulse: ৳${stats.avgOrderValue.toFixed(0)}`}
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Total Adjustment"
                                value={`৳${stats.totalDiscount.toLocaleString()}`}
                                subtitle={`Avg Rebate: ৳${stats.avgDiscount.toFixed(0)}`}
                            />
                            <StatCard
                                icon={Percent}
                                title="Efficiency"
                                value={`${stats.discountPercentage.toFixed(1)}%`}
                                subtitle="Yield Optimization"
                            />
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {uniqueStatuses.map(status => (
                                <StatusStatCard
                                    key={status}
                                    status={status}
                                    data={statusStats}
                                    icon={getStatusIcon(status)}
                                    color={getStatusColor(status)}
                                />
                            ))}
                        </div>

                        {/* Detailed Log Table */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-black/10 overflow-hidden">
                            <div className="bg-[#080808] px-8 py-6 flex items-center justify-between border-b border-primary/20">
                                <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Layers className="text-primary w-5 h-5" />
                                     </div>
                                     <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Operational Registry</h3>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-0.5">Real-time Node Monitoring</p>
                                     </div>
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-2 rounded-xl">
                                    {filteredData.length} ACTIVE NODES
                                </span>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            {['Entity Identifier', 'Core Module', 'Payload', 'Protocol', 'Adjustment', 'State', 'Registry Date'].map((header) => (
                                                <th key={header} className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-8 py-20 text-center">
                                                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Zero data points in current vector</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item) => (
                                                <tr key={item._id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="text-[11px] font-black text-[#080808] uppercase tracking-tight">{item.userName}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter opacity-70 italic">{item.userEmail}</div>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <span className="text-[10px] font-black text-[#080808] bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                                            {item.planName}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="text-xs font-black text-[#080808]">৳{item.amount?.toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-green-100/50 group-hover:bg-[#080808] group-hover:text-primary group-hover:border-primary/20 transition-all duration-500">
                                                            {item.couponCode}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                                        <div className="text-xs font-black text-green-600 tracking-tight">-৳{item.discountAmount?.toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                                (item.status || '').toLowerCase() === 'approved' || (item.status || '').toLowerCase() === 'completed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                                (item.status || '').toLowerCase() === 'pending' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-red-500'
                                                            }`}></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                                (item.status || '').toLowerCase() === 'approved' || (item.status || '').toLowerCase() === 'completed' ? 'text-green-600' :
                                                                (item.status || '').toLowerCase() === 'pending' ? 'text-amber-600' : 'text-rose-500'
                                                            }`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 whitespace-nowrap">
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            {new Date(item.orderDate).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
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

export default CouponSells;
