import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Ahmed',
        role: 'Founder, TechBit',
        rating: 5,
        text: "Best decision we made this year. The product exceeded our expectations and the support team is incredibly responsive.",
    },
    {
        name: 'Rahim Khan',
        role: 'CTO, GrowEasy',
        rating: 5,
        text: "Switched from Competitor X and never looked back. Performance, price, and developer experience — all top tier.",
    },
    {
        name: 'Ayesha Begum',
        role: 'Marketing Lead, ShopZ',
        rating: 4,
        text: "Very solid solution overall. Would love to see more customization options in the dashboard in the future.",
    },
    {
        name: 'David Hossain',
        role: 'Freelance Designer',
        rating: 5,
        text: "Saved me at least 15 hours a week. Worth every penny.",
    },
    {
        name: 'Nadia Islam',
        role: 'Product Manager, NovaSoft',
        rating: 5,
        text: "The analytics alone justified the subscription. Clean UI + powerful features = ❤️",
    },
];

export default function TestimonialCarousel() {
    const [width, setWidth] = useState(0);

    return (
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-[#080808] logoFont">
                        What Our <span className="premium-gradient-text">Customers</span> Say
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Real stories from people who use our product every day
                    </p>
                </div>

                {/* Carousel */}
                <motion.div
                    className="overflow-hidden relative"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: -width, right: 0 }}
                        className="flex gap-6 cursor-grab"
                        ref={(el) => el && setWidth(el.scrollWidth - el.offsetWidth)}
                    >
                        {testimonials.map((item, i) => (
                            <motion.div
                                key={i}
                                className="min-w-[300px] sm:min-w-[320px] md:min-w-[350px] lg:min-w-[380px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-[0_10px_30px_rgba(132,204,22,0.15)] hover:border-lime-500/30 transition-all duration-300 p-6 flex flex-col"
                                whileHover={{ y: -6 }}
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star
                                            key={idx}
                                            size={20}
                                            className={
                                                idx < item.rating
                                                    ? 'fill-primary text-primary'
                                                    : 'text-gray-200'
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="flex-1 text-gray-600 leading-relaxed mb-4 text-[15.5px]">
                                    "{item.text}"
                                </blockquote>

                                {/* Author */}
                                <div>
                                    <p className="font-bold text-[#080808]">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-green-600 mt-0.5">
                                        {item.role}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
