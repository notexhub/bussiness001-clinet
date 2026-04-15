import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
    Menu,
    X,
    Home,
    LogIn,
    UserPlus,
    Crown,
    User,
    LayoutDashboard,
} from "lucide-react";
import useSettingsData from "@/Admin/Hooks/useSettingsData";

const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Plans", path: "/plans", icon: Crown },
];

const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut", when: "afterChildren" } },
    open: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98], when: "beforeChildren", staggerChildren: 0.07 } },
};

const itemVariants = {
    closed: { y: -8, opacity: 0 },
    open: { y: 0, opacity: 1 },
};

export default function Navbar() {
    const dispatch = useDispatch();
    const { user, loading: authLoading } = useSelector((state) => state.auth);
    const { settingsLoading, settingsData } = useSettingsData();
    const [isOpen, setIsOpen] = useState(false);

    const isAuthenticated = !!user;
    const isAuthenticating = authLoading && !user;

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const handleLogout = () => dispatch(logout());

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-full bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm transition-all duration-300">
            <div className="mx-auto px-5 h-16 sm:h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group transition-all duration-300 transform hover:scale-105">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary rounded-xl flex items-center justify-center text-[#0a0a0a] shadow-lg shadow-primary/30">
                       <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <motion.div className="text-xl sm:text-2xl logoFont font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        <span>NotexHub</span>
                    </motion.div>
                </Link>

                <nav className="hidden md:flex items-center gap-2 lg:gap-4 bg-gray-100/50 px-4 py-1.5 rounded-full border border-gray-200">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `group relative px-4 py-2 text-sm font-bold transition-colors hover:text-black ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(132,204,22,0.5)]" : "text-gray-500"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticating ? (
                        <>
                            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />
                            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />
                        </>
                    ) : isAuthenticated ? (
                        <>
                            <Button variant="ghost" className="gap-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full font-bold" onClick={handleLogout}>
                                <LogIn className="h-4 w-4" /> Logout
                            </Button>
                            <Button className="gap-2 bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20 rounded-full" asChild>
                                <Link to="/dashboard"><User className="h-4 w-4" /> Dashboard</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full font-bold" asChild>
                                <Link to="/signin"><LogIn className="h-4 w-4" /> Sign In</Link>
                            </Button>
                            <Button className="gap-2 bg-primary hover:bg-primary/90 text-black font-bold shadow-lg shadow-primary/20 rounded-full border border-primary" asChild>
                                <Link to="/signup"><UserPlus className="h-4 w-4" /> Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                <Button variant="ghost" size="icon" className="md:hidden text-black" onClick={toggleMenu} aria-label="Toggle navigation menu" aria-expanded={isOpen}>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={isOpen ? "x" : "menu"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </motion.div>
                    </AnimatePresence>
                </Button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div variants={mobileMenuVariants} initial="closed" animate="open" exit="closed" className="md:hidden overflow-hidden border-t border-gray-200 bg-white/95 backdrop-blur-2xl rounded-b-3xl absolute top-full left-0 right-0 max-h-[80vh] overflow-y-auto">
                        <div className="px-5 py-6 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <motion.div key={item.path} variants={itemVariants}>
                                    <NavLink to={item.path} onClick={toggleMenu} className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-base font-bold transition-all ${isActive ? "bg-primary text-black" : "text-gray-600 hover:bg-gray-100 hover:text-black"}`}>
                                        <item.icon className="h-5 w-5" /> {item.name}
                                    </NavLink>
                                </motion.div>
                            ))}

                            <motion.div variants={itemVariants} className="pt-4 mt-2 border-t border-gray-200 flex flex-col gap-3">
                                {isAuthenticating ? (
                                    <>
                                        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-2xl" />
                                        <div className="h-12 w-full bg-gray-200 animate-pulse rounded-2xl" />
                                    </>
                                ) : isAuthenticated ? (
                                    <>
                                        <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-2xl" asChild onClick={toggleMenu}>
                                            <Link to="/dashboard"><User className="h-5 w-5" /> Dashboard</Link>
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start gap-3 border-gray-200 text-black hover:bg-gray-100 h-12 rounded-2xl font-bold" onClick={() => { handleLogout(); toggleMenu(); }}>
                                            <LogIn className="h-5 w-5" /> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" className="w-full justify-start gap-3 border-gray-200 text-black hover:bg-gray-100 h-12 rounded-2xl font-bold" asChild onClick={toggleMenu}>
                                            <Link to="/signin"><LogIn className="h-5 w-5" /> Sign In</Link>
                                        </Button>
                                        <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-2xl shadow-lg shadow-primary/20" asChild onClick={toggleMenu}>
                                            <Link to="/signup"><UserPlus className="h-5 w-5" /> Get Started</Link>
                                        </Button>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
