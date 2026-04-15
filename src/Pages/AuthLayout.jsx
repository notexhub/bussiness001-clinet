// src/components/auth/AuthLayout.jsx
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle, Sparkles } from 'lucide-react';

export default function AuthLayout({
    children,
    title,
    subtitle,
    isSignUp = false,
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans relative overflow-hidden p-4 sm:p-8">
            {/* Ambient Black/Lime Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-lime-400/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl flex flex-col lg:flex-row bg-[#080808]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative z-10"
            >
                {/* Left Side: Brand and Features */}
                <div className="lg:w-[45%] p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-gradient-to-br from-white/5 to-transparent relative">
                    <div className="absolute inset-0 bg-primary/5 pattern-dots opacity-20" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/30 ring-1 ring-white/20">
                                <LayoutDashboard className="h-6 w-6 text-black" />
                            </div>
                            <span className="text-2xl font-black tracking-tight logoFont bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                NotexHub
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-lime-400 text-xs font-bold mb-6 tracking-wide uppercase">
                            <Sparkles size={12} />
                            <span>V2.0 is Live</span>
                        </div>

                        <h2 className="text-4xl font-black leading-[1.1] tracking-tight mb-4 text-white">
                            {isSignUp
                                ? "Accelerate your digital workflow."
                                : "Welcome back to your dashboard."}
                        </h2>
                        <p className="text-base text-gray-400 leading-relaxed font-medium">
                            {isSignUp
                                ? "Join our elite platform to effortlessly manage top-tier tools and resources."
                                : "Log in to instantly access your command center and premium resources."}
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-5 gap-x-4">
                        {[
                            "Bank-Grade Security",
                            "Real-Time Sync",
                            "Advanced Telemetry"
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                <CheckCircle size={18} className="text-primary drop-shadow-[0_0_8px_rgba(132,204,22,0.6)]" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 mt-12 text-gray-600 text-xs tracking-wide font-medium uppercase">
                        &copy; 2026 NotexHub Technologies
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="lg:w-[55%] bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                            <p className="mt-2 text-slate-500 font-medium text-sm">{subtitle}</p>
                        </div>
                        
                        {/* The inputs (children) drop in here without modification */}
                        <div className="bg-white">
                            {children}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}