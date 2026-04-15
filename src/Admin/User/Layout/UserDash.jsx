import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    ShoppingBag,
    Package,
    Clock,
    User as UserIcon,
    CreditCard,
    Wallet,
    AlertCircle,
    RefreshCw,
    Heart
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '@/api/axios';
import { Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, title, value, color, }) => (
    <div className="bg-white p-2 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-sm sm:text-2xl font-bold mt-1 text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

const FlipCard = ({ value, label, urgency = 'normal' }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setIsFlipping(true);
            const t = setTimeout(() => {
                setDisplayValue(value);
                setIsFlipping(false);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [value, displayValue]);

    const schemes = {
        normal: { bg: 'from-emerald-500 to-emerald-600', text: 'text-emerald-50', label: 'text-emerald-700' },
        warning: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-50', label: 'text-amber-700' },
        critical: { bg: 'from-red-500 to-rose-600', text: 'text-red-50', label: 'text-red-700' },
        expired: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-100', label: 'text-gray-700' }
    };

    const s = schemes[urgency] || schemes.normal;

    return (
        <div className="flex flex-col w-full md:w-fit items-center gap-1.5">
            <div className="relative">
                <div
                    className={`
            w-12 h-16 sm:w-20 sm:h-24 rounded-xl bg-gradient-to-br ${s.bg}
            shadow-xl overflow-hidden transform-gpu
            ${isFlipping ? 'animate-flip' : ''}
          `}
                    style={{ perspective: '1000px' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-xl sm:text-4xl font-extrabold text-white/95">
                        {displayValue}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                </div>
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wide ${s.label}`}>
                {label}
            </span>
        </div>
    );
};

const Countdown = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
    const [status, setStatus] = useState('normal');

    useEffect(() => {
        if (!expiryDate) {
            setStatus('expired');
            return;
        }

        const target = new Date(expiryDate).getTime();
        if (isNaN(target)) {
            setStatus('expired');
            return;
        }

        const tick = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                setStatus('expired');
                setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
                return;
            }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            setTimeLeft({
                d: d.toString().padStart(2, '0'),
                h: h.toString().padStart(2, '0'),
                m: m.toString().padStart(2, '0'),
                s: s.toString().padStart(2, '0')
            });

            if (diff < 3600000) setStatus('critical');
            else if (diff < 86400000 || d <= 3) setStatus('warning');
            else setStatus('normal');
        };

        tick();
        const i = setInterval(tick, 1000);
        return () => clearInterval(i);
    }, [expiryDate]);

    if (status === 'expired') {
        return (
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-red-200/50">
                <AlertCircle className="text-white animate-pulse" size={20} />
                <span className="text-white font-bold tracking-wide">EXPIRED</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 md:gap-3 w-full sm:gap-4 px-5 py-4 rounded-2xl bg-white/70 backdrop-blur border border-gray-200/80 shadow-sm">
            {Number(timeLeft.d) > 0 && (
                <>
                    <FlipCard value={timeLeft.d} label="DAYS" urgency={status} />
                    <span className="text-3xl font-light text-gray-300">:</span>
                </>
            )}
            <FlipCard value={timeLeft.h} label="HOURS" urgency={status} />
            <span className="text-3xl font-light text-gray-300">:</span>
            <FlipCard value={timeLeft.m} label="MIN" urgency={status} />
            <span className="text-3xl font-light text-gray-300">:</span>
            <FlipCard value={timeLeft.s} label="SEC" urgency={status} />
        </div>
    );
};

const getValidTillDate = (days, approvedDate) => {
    if (!days || !approvedDate) return null;
    try {
        const d = new Date(approvedDate);
        if (isNaN(d.getTime())) return null;
        const end = new Date(d);
        end.setDate(d.getDate() + Number(days));
        return end.toISOString();
    } catch {
        return null;
    }
};

export default function UserDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminMsg, setAdminMsg] = useState('');
    const [allPlatforms, setAllPlatforms] = useState([]);
    const [allSubs, setAllSubs] = useState([]);

    const refreshPlatforms = useCallback(async () => {
        try {
            const { data } = await api.get('/add_cockies_platform');
            setAllPlatforms(data || []);
        } catch (err) {
            console.error("Failed to refresh platforms:", err);
        }
    }, []);

    const loadData = useCallback(async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            const [{ data: orderData }, { data: platformData }, { data: subData }] = await Promise.all([
                api.get('/order'),
                api.get('/add_cockies_platform'),
                api.get('/subscription')
            ]);

            const mine = orderData
                .filter(o => o?.userEmail?.toLowerCase() === user.email.toLowerCase())
                .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));

            setOrders(mine);
            setAllPlatforms(platformData || []);
            setAllSubs(subData || []);
        } catch (err) {
            setError("Couldn't load your dashboard data. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        loadData();

        const handleMessage = (event) => {
            if (event.data?.type === 'MASTER_TOOLS_SLOT_REFRESH_REQUIRED') {
                console.log("[React] Dashboard slot refresh required.");
                setTimeout(() => {
                    console.log("[React] Refreshing slots...");
                    refreshPlatforms();
                }, 1500);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [loadData, refreshPlatforms]);

    useEffect(() => {
        const poll = setInterval(refreshPlatforms, 5000);
        return () => clearInterval(poll);
    }, [refreshPlatforms]);

    useEffect(() => {
        api.get('/message')
            .then(r => {
                if (r.data?.message) setAdminMsg(r.data.message);
            })
            .catch(() => { });
    }, []);

    const activeSubs = useMemo(
        () => orders.filter(o => o.status?.toLowerCase() === 'approved'),
        [orders]
    );

    if (loading) {
        return (
            <div className="min-h-[70vh] grid place-items-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] grid place-items-center p-6">
                <div className="text-center max-w-md">
                    <AlertCircle size={56} className="mx-auto text-rose-500 mb-6" />
                    <p className="text-xl font-semibold text-gray-800 mb-3">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 animate-fade-in">
                <h1 className="text-3xl font-extrabold text-[#080808]">
                    Welcome back, <span className="text-green-600">{user?.name?.split(' ')?.[0] || 'User'}</span>
                </h1>
                <p className="text-gray-500 font-medium mt-1.5 tracking-wide">Manage your plans & orders</p>

                {adminMsg && activeSubs?.length > 0 && (
                    <div className="mt-5 p-4 rounded-xl bg-green-50/80 border border-green-200 text-sm shadow-sm">
                        <p className="font-bold text-green-800 mb-1 flex items-center gap-2"><AlertCircle size={16} /> Message from Admin:</p>
                        <p className="text-green-900 whitespace-pre-line leading-relaxed font-medium">{adminMsg}</p>
                    </div>
                )}
            </div>

            <section className="bg-white rounded-2xl sm:shadow sm:border sm:border-gray-100 overflow-hidden">
                <div className="md:px-6 md:py-5 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        Active Plans
                    </h2>
                </div>

                <div className="md:p-6">
                    {activeSubs.length === 0 ? (
                        <div className="py-20 text-center">
                            <Package size={64} className="mx-auto text-gray-300 mb-6" strokeWidth={1.4} />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No active subscription</h3>
                            <p className="text-gray-500 mb-6">Choose a plan to unlock premium features</p>
                            <Link
                                to="/plans"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition"
                            >
                                View Plans
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeSubs.map(plan => {
                                const expiry = getValidTillDate(plan.validityDays, plan?.updateDate || plan?.approvedAt || plan?.orderDate);
                                const isExpired = expiry && new Date(expiry) < new Date();

                                return (
                                    <div
                                        key={plan._id}
                                        className={`
                      p-6 rounded-xl border-2 transition-all duration-300
                      ${isExpired
                                                ? 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200'
                                                : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-emerald-300 hover:shadow-md'}
                    `}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {plan.planName || 'Subscription'}
                                                </h3>
                                                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                                                    <span className="flex items-center gap-2">
                                                        <Clock size={16} className="text-emerald-600" />
                                                        {plan.validityDays} days
                                                    </span>
                                                    {plan?.updateDate && (
                                                        <span>
                                                            Started:{' '}
                                                            {new Date(plan.updateDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    )}
                                                </div>

                                                {!isExpired && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {(() => {
                                                            const planSub = allSubs.find(s => (s._id?.$oid || s._id) === plan.planId);
                                                            if (!planSub) return null;

                                                            const loginPlats = (planSub.selectedPlan || []).map(pId =>
                                                                allPlatforms.find(p => (p._id?.$oid || p._id) === pId)
                                                            ).filter(Boolean);

                                                            const cookiePlats = (planSub.selectedCookiePlatforms || []).map(cpId =>
                                                                allPlatforms.find(p => (p._id?.$oid || p._id) === cpId)
                                                            ).filter(Boolean);

                                                            return (
                                                                <>
                                                                    {loginPlats.concat(cookiePlats).slice(0, 6).map(p => {
                                                                        const isCookie = (planSub.selectedCookiePlatforms || []).includes(p._id?.$oid || p._id);
                                                                        const available = isCookie ? Math.max(0, (p.p_slot || 3) - (p.activeSlots || 0)) : null;

                                                                        return (
                                                                            <div key={p._id} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-1.5">
                                                                                <span className={`w-1.5 h-1.5 rounded-full ${isCookie ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></span>
                                                                                <span className="text-gray-700 truncate max-w-[80px]">{p.platformName || p.p_name}</span>
                                                                                {isCookie && <span className="text-emerald-700">{available} Left</span>}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span
                                                    className={`
                             inline-flex px-5 py-1.5 rounded-full text-sm font-semibold
                             ${isExpired
                                                            ? 'bg-rose-100 text-rose-700'
                                                            : 'bg-emerald-100 text-emerald-700'}
                           `}
                                                >
                                                    {isExpired ? 'Expired' : 'Active'}
                                                </span>

                                                {!isExpired && (
                                                    <Link
                                                        to={`/dashboard/myplan_details/${plan._id}`}
                                                        className="px-6 py-2 bg-black text-white rounded-full font-medium shadow-sm transition"
                                                    >
                                                        Access Now
                                                    </Link>
                                                )}

                                                {isExpired && (
                                                    <Link
                                                        to="/plans"
                                                        className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-medium shadow-sm transition flex items-center gap-2"
                                                    >
                                                        <RefreshCw size={16} />
                                                        Renew Plan
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-center">
                                            <Countdown expiryDate={expiry} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                <StatCard icon={ShoppingBag} title="Total Orders" value={orders?.length || 0} color="bg-primary" />
                <StatCard
                    icon={Package}
                    title="Pending"
                    value={orders?.filter(o => o?.status?.toLowerCase() === 'pending')?.length || 0}
                    color="bg-green-600"
                />
                <StatCard
                    icon={Clock}
                    title="Last Order"
                    value={orders?.[0]?.orderDate ? new Date(orders[0].orderDate).toLocaleDateString() : '—'}
                    color="bg-emerald-700"
                />
                <StatCard icon={Heart} title="Active Plans" value={activeSubs?.length || 0} color="bg-[#080808]" />
            </div>

            <section className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <div className="py-16 text-center text-gray-500">No orders yet.</div>
                    ) : (
                        orders.slice(0, 7).map(order => (
                            <div key={order._id} className="p-5 hover:bg-gray-50/60 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-900">{order.planName || 'Order'}</p>
                                        <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <CreditCard size={15} /> ৳{Number(order.amount || 0).toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Wallet size={15} /> {order.paymentMethod || '?'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`
                         px-3 py-1 rounded-full text-xs font-medium
                         ${order.status?.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-600'}
                       `}
                                        >
                                            {order.status || 'Unknown'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <style>{`
        @keyframes flip {
          0%, 100% { transform: rotateX(0deg); }
          50%      { transform: rotateX(90deg); }
        }
        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }
      `}</style>
        </div>
    );
}
