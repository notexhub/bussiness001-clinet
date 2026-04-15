import useSettingsData from "@/Admin/Hooks/useSettingsData";
import api from '@/api/axios';
import { Toolbox } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";




const Footer = () => {
    const { settingsLoading, settingsData } = useSettingsData();

    const [links, setLinks] = useState({ whatsapp: '', telegram: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const footerLinks = [
        { label: "Home", path: "/" },
        { label: "Plans", path: "/plans" },
        { label: "Terms and Conditions", path: "/terms-and-conditions" },
        { label: "Privacy Policy", path: "/privacy-policy" },
    ];
    useEffect(() => {
        api.get('/quick-links')
            .then((res) => {
                const data = res.data || {};
                setLinks({
                    whatsapp: data.whatsapp || '',
                    telegram: data.telegram || '',
                    phone: data.phone || '',
                });
            })
            .catch((err) => console.error('Quick links fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <footer className="relative pt-16 pb-8 border-t border-gray-200 bg-background overflow-hidden mt-0">
            {/* Background effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Link
                                to="/"
                                className="flex items-center gap-2 group transition-transform hover:scale-105"
                            >
                                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-[#080808] shadow-[0_0_15px_rgba(132,204,22,0.3)]">
                                   <Toolbox className="h-4 w-4" />
                                </div>
                                <motion.div className="text-2xl logoFont font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                                    <span>NotexHub</span>
                                </motion.div>
                            </Link>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            Premium digital subscriptions that give you access to the best online resources and tools.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-[#080808]">Quick Links</h4>
                        <ul className="space-y-1 text-sm">
                            {footerLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <Link
                                        to={path}
                                        className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                 
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-[#080808]">Support</h4>
                        <ul className="space-y-1 text-sm">
                            <li className="">
                                {/* whatsapp support */}
                                <a
                                    href={`${links.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                                >
                                    Whatsapp Support group
                                </a>
                            </li>
                            <li className="">
                                {/* telegram support */}
                                <a
                                    href={`${links.telegram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                                >
                                    Telegram Support chanel
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-bold text-[#080808]">Contact</h4>
                        <p className="text-sm text-gray-600 font-medium">Email: {settingsData?.supportEmail}</p>
                        <p className="text-sm text-gray-600 font-medium">Phone: {settingsData?.phone}</p>
                        <p className="text-sm text-gray-600 font-medium">Service Time: <span className="text-green-600">{settingsData?.serviceTime}</span></p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm font-medium text-gray-500">
                    © {new Date().getFullYear()} {settingsData?.webName}.. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
