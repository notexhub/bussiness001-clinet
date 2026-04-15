import useSettingsData from '@/Admin/Hooks/useSettingsData';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    const { settingsLoading, settingsData } = useSettingsData();
    const { user, loading } = useSelector((state) => state.auth);

    return (
        <div className="w-full bg-background relative overflow-hidden min-h-[90vh] flex items-center justify-center pt-24 pb-12">
            {/* Background animated gradients - Ultra Premium Softness */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-lime-400/20 blur-[140px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-lime-300/10 blur-[140px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>
            
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

            <div className="w-11/12 max-w-5xl mx-auto text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-black tracking-[0.2em] text-[#080808] uppercase bg-lime-400/20 rounded-full border border-lime-400/30 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Enterprise Subscription Management
                    </span>
                    <h1 className="text-5xl md:text-[5.5rem] font-black leading-[1.05] md:leading-[1.05] tracking-tighter mb-8 text-[#080808]">
                        The ultimate <br /> 
                        <span className="premium-gradient-text logoFont italic pr-4">
                            Digital Command
                        </span> <br />
                        center
                    </h1>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-600 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed mb-12"
                >
                    Seamlessly manage, explore, and elevate your digital workspace with NotexHub's premium resources and automated tools.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-6"
                >
                    <Link to="/plans" className="glow-on-hover group relative px-10 py-5 bg-primary text-[#080808] font-black uppercase tracking-wide text-sm rounded-2xl shadow-[0_0_40px_rgba(132,204,22,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(132,204,22,0.5)]">
                        <span className="relative z-10 block">Explore Our Plans</span>
                    </Link>

                    {!loading && !user && (
                        <Link to="/signup" className="group relative px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-wide text-[#080808] bg-white backdrop-blur-xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-gray-50 active:scale-95 group">
                            <span className="relative z-10 transition-colors group-hover:text-primary">Join NotexHub</span>
                        </Link>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
