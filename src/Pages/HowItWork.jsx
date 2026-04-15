import React from 'react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 110,
            damping: 15,
        },
    },
};

const HowItWork = () => {
    const steps = ['Browse Plan', 'Choose Plan', 'Complete Purchase', 'Access Content'];

    return (
        <div className="bg-background w-full rounded-t-4xl -mt-6 z-20 py-16 md:py-24 relative overflow-hidden">
            {/* Background blur effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-4xl md:text-5xl font-bold text-[#080808] logoFont tracking-tight mb-12 md:mb-20"
                >
                    How It <span className="premium-gradient-text">Works</span>
                </motion.h2>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16"
                >
                    {/* Floating connecting line for desktop */}
                    <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-lime-400/40 to-transparent rounded-full shrink-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="relative z-10 flex flex-col items-center text-center group w-full max-w-[200px] md:max-w-none"
                            whileHover={{ y: -8, scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <div className="relative">
                                {/* Pulse effect for the active step feel */}
                                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="
                                    w-20 h-20 md:w-24 md:h-24 
                                    rounded-full 
                                    bg-gradient-to-br from-lime-400 via-primary to-green-600
                                    flex items-center justify-center 
                                    text-[#080808] text-3xl md:text-3xl font-black 
                                    shadow-[0_0_20px_rgba(132,204,22,0.4)]
                                    group-hover:shadow-[0_0_40px_rgba(132,204,22,0.6)]
                                    border-[3px] border-white
                                    transition-all duration-300
                                ">
                                    0{index + 1}
                                </div>
                            </div>

                            {/* Mobile connecting line */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden w-[2px] h-12 my-6 bg-gradient-to-b from-primary/50 to-transparent rounded-full opacity-40" />
                            )}

                            <p className="
                                mt-6 md:mt-8 
                                text-lg md:text-xl font-bold 
                                text-gray-600 group-hover:text-[#080808] 
                                transition-colors duration-300
                                tracking-wide
                                logoFont
                            ">
                                {step}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWork;