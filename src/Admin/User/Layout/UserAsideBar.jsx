import React, { useState } from 'react';
import {
    LayoutDashboard, User, History, LogOut,
    ChevronLeft, ChevronRight, Menu,
    Home,
    Link2,
    Stamp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

const UserAsideBar = () => {
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: History, label: 'Order History', href: '/dashboard/order_history' },
        { icon: Link2, label: 'Quick Links', href: '/dashboard/quick_links' },
        { icon: Stamp, label: 'Visit Plans', href: '/plans' },
        { icon: Home, label: 'Home', href: '/' },
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-md text-gray-700"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                <Menu size={24} />
            </button>

            <aside
                className={`
          fixed inset-y-0 left-0 z-40 transform transition-all duration-300
          lg:static lg:transform-none
          ${isCollapsed ? 'lg:w-24' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          bg-white text-gray-600 border-r border-gray-200 shadow-sm flex flex-col h-screen
        `}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between h-24">
                    {!isCollapsed && <h1 className="text-2xl font-black text-[#080808] tracking-tight logoFont">My<span className="text-green-600">Account</span></h1>}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} className="mx-auto" /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2">
                        {menuItems.map((item, i) => {
                            const isActive = window.location.pathname === item.href;
                            return (
                                <li key={i}>
                                    <Link
                                        to={item.href}
                                        className={`
                        flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300
                        ${isActive 
                            ? 'bg-primary text-[#080808] shadow-[0_4px_20px_rgba(132,204,22,0.25)]' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#080808]'}
                        ${isCollapsed ? 'justify-center px-0' : ''}
                      `}
                                    >
                                        <item.icon size={22} className={isActive ? "text-[#080808]" : "text-gray-400"} />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <Link
                        to="/signin"
                        onClick={handleLogout}
                        className={`
              flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl font-bold
              hover:bg-red-50 text-red-500 transition-colors
              ${isCollapsed ? 'justify-center px-0' : ''}
            `}
                    >
                        <LogOut size={22} />
                        {!isCollapsed && <span className='cursor-pointer'>Logout</span>}
                    </Link>
                </div>
            </aside>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default UserAsideBar;
