import api from '@/api/axios';
import {
    Loader,
    CheckCircle2,
    Crown,
    Clock,
    ArrowRight
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }),
    hover: {
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { delay: 0.4, type: "spring", stiffness: 200 }
    }
};

const Plans = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [allPlans, setAllPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [platformMap, setPlatformMap] = useState({});
    const navigate = useNavigate();
    const gotoCheckOut = (planId) => navigate(`/checkout/${planId}`);

    const loadData = async () => {
        try {
            const [categoryRes, planRes, platformRes, cookiePlatRes] = await Promise.all([
                api.get('/category'),
                api.get('/subscription'),
                api.get('/platform'),
                api.get('/add_cockies_platform')
            ]);
            const categories = Array.isArray(categoryRes.data) ? categoryRes.data : [];
            setAllCategory(categories);

            const plans = Array.isArray(planRes.data) ? planRes.data : [];
            setAllPlans(plans);

            if (categories.length > 0 && plans.length > 0) {
                setFilteredPlans(plans.filter(p => p.category === categories[0]._id));
                setSelectedCategory(categories[0]._id);
            }

            const map = {};

            const platforms = Array.isArray(platformRes.data) ? platformRes.data : [];
            platforms.forEach(p => {
                map[p._id?.$oid || p._id] = p.platformName;
            });

            const cookiePlatforms = Array.isArray(cookiePlatRes.data) ? cookiePlatRes.data : [];
            cookiePlatforms.forEach(cp => {
                map[cp._id?.$oid || cp._id] = cp.p_name;
            });

            setPlatformMap(map);

        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setFilteredPlans(allPlans.filter(plan => plan.category === category));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-background">
                <Loader className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full py-20 md:py-32 bg-background relative overflow-hidden min-h-screen">
             {/* Decorative background elements - Ultra Premium Softness */}
             <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
             <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-lime-400/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#080808] tracking-tight logoFont mb-4">
                        Choose Your <span className="premium-gradient-text">Perfect Plan</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find the subscription that fits your needs — upgrade or switch anytime with NotexHub.
                    </p>
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-6 mb-16">
                    <div className="flex gap-3 items-center flex-wrap justify-center p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        {allCategory.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleSelectCategory(cat._id)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedCategory === cat._id
                                    ? "bg-primary text-[#080808] shadow-lg shadow-primary/20 scale-105 font-bold uppercase tracking-wider"
                                    : "text-gray-500 hover:text-black hover:bg-gray-50 uppercase tracking-wider"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="wait">
                        {filteredPlans.length === 0 ? (
                            <motion.p
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full text-center text-xl text-gray-500 py-16"
                            >
                                No plans found in this category.
                            </motion.p>
                        ) : (
                            filteredPlans.map((plan, index) => (
                                <motion.div
                                    key={plan._id}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    whileHover="hover"
                                    className={`
                                        relative rounded-3xl overflow-hidden border premium-glass-card bg-white
                                        ${plan.isMostPopular
                                            ? 'border-primary/50 shadow-[0_0_40px_rgba(132,204,22,0.15)] bg-white/80'
                                            : 'border-gray-200 shadow-xl bg-white'}
                                        transition-all duration-500 flex flex-col
                                    `}
                                >
                                    {plan.isMostPopular && (
                                        <div className="absolute top-0 inset-x-0 h-[6px] bg-gradient-to-r from-lime-300 via-primary to-green-600" />
                                    )}

                                    <div className="p-8 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-[#080808] mb-1">
                                                    {plan.subscriptionName}
                                                </h3>
                                                {plan.isMostPopular && (
                                                     <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase tracking-wider">
                                                        <Crown size={14} />
                                                        <span>Recommended</span>
                                                     </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <div className="flex items-baseline">
                                                <span className="text-4xl font-extrabold text-[#080808]">
                                                    ৳{plan.price}
                                                </span>
                                                <span className="text-lg text-gray-500 ml-2">/{plan.validityDays} Days</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8 flex-grow">
                                            <p className="text-gray-500 text-sm italic border-b border-gray-200 pb-3">
                                                {plan.subscriptionDescription || "Perfect plan to get started"}
                                            </p>
                                            
                                            <ul className="space-y-3">
                                                {plan.selectedPlan?.filter(id => platformMap[id?.$oid || id]).map((featureId, idx) => (
                                                    <li key={`plat-${idx}`} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                                                        <div className="p-1 rounded-full bg-primary/20 text-green-700">
                                                            <CheckCircle2 size={14} />
                                                        </div>
                                                        <span>{platformMap[featureId?.$oid || featureId]}</span>
                                                    </li>
                                                ))}

                                                {plan.selectedCookiePlatforms?.filter(id => platformMap[id?.$oid || id]).map((cookieId, idx) => (
                                                    <li key={`cookie-${idx}`} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                                                        <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                                                            <CheckCircle2 size={14} />
                                                        </div>
                                                        <span>{platformMap[cookieId?.$oid || cookieId]}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <motion.button
                                            onClick={() => gotoCheckOut(plan._id)}
                                            className={`
                                                w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wide
                                                flex items-center justify-center gap-2
                                                transition-all duration-300 border
                                                ${plan.isMostPopular
                                                    ? 'bg-primary border-primary text-[#080808] shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)]'
                                                    : 'bg-white text-[#080808] border-gray-300 hover:bg-gray-50 hover:text-green-700'}
                                            `}
                                        >
                                            Get Started
                                            <ArrowRight size={18} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Plans;
