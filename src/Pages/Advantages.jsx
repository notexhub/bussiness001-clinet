import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    Zap,
    Clock,
    Tag,
    Smile,
    Headphones,
} from 'lucide-react';

const advantages = [
    {
        icon: Rocket,
        title: 'Fast Delivery',
        description: 'Content delivered in record time without compromising quality.',
    },
    {
        icon: Zap,
        title: 'Instant Access',
        description: 'Get started immediately — no long setup or waiting periods.',
    },
    {
        icon: Clock,
        title: '100% Uptime Guarantee',
        description: 'Reliable service you can count on, every single day.',
    },
    {
        icon: Tag,
        title: 'Affordable Pricing',
        description: 'Competitive plans that deliver maximum value.',
    },
    {
        icon: Smile,
        title: 'User-Friendly Interface',
        description: 'Intuitive design that’s easy to use for everyone.',
    },
    {
        icon: Headphones,
        title: 'Instant Support',
        description: 'Real help when you need it — fast and friendly.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const Advantages = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
             {/* Decorative radial gradients */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-400/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-[#080808] tracking-tight logoFont">
                        Why Choose <span className="premium-gradient-text">NotexHub</span>
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We deliver exceptional value through speed, reliability, and superior user experience.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                >
                    {advantages.map((adv, index) => {
                        const Icon = adv.icon;
                        const isHovered = hoveredIndex === index;

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="group h-full"
                            >
                                <div
                                    className={`
                                        h-full p-8 md:p-10 rounded-3xl border transition-all duration-500 
                                        premium-glass-card flex flex-col items-start bg-white
                                        ${isHovered
                                            ? 'border-primary/50 bg-white -translate-y-3 shadow-[0_10px_35px_rgba(132,204,22,0.15)]'
                                            : 'border-gray-200 hover:border-gray-300 shadow-sm'}
                                    `}
                                >
                                    <div
                                        className={`
                                            inline-flex items-center justify-center w-16 h-16 
                                            rounded-2xl mb-8 transition-all duration-500
                                            ${isHovered
                                                ? 'bg-primary text-[#080808] scale-110 shadow-[0_0_20px_rgba(132,204,22,0.5)]'
                                                : 'bg-green-50 text-green-700'}
                                        `}
                                    >
                                        <Icon size={32} strokeWidth={2} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-[#080808] mb-4 logoFont">
                                        {adv.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed text-base font-medium">
                                        {adv.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Advantages;