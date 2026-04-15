import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '@/store/slices/authSlice';
import AdminAsideBar from './AdminAsideBar';
import {
    LogOut,
    ChevronDown
} from 'lucide-react';

const AdminLayout = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const resultAction = await dispatch(adminLogout());
        if (adminLogout.fulfilled.match(resultAction)) {
            setShowUserMenu(false);
            navigate('/admin_signin');
        }
    };

    return (
        <div className="flex h-screen w-full bg-background font-sans">
            <AdminAsideBar />

            <div className="flex flex-1 flex-col overflow-hidden bg-gray-50/50">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-end">
                            <div className="hidden md:block flex-1 max-w-xl" />

                            <div className="flex items-center gap-3">
                                <button
                                    aria-label="Notifications"
                                    className="relative p-2 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                                >
                                    <span className="absolute top-1 right-2 h-3 w-3 bg-primary animate-ping rounded-full" />
                                    <span className="absolute top-1 right-2 h-3 w-3 bg-primary rounded-full" />
                                </button>

                                <div
                                    onClick={handleLogout}
                                    className="
                                            flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50
                                            rounded-xl px-3 py-1.5 font-bold transition-all
                                        "
                                >
                                    <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                                </div>

                                <div className="relative ml-2 pl-4 border-l border-gray-200">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="
                                            flex items-center gap-3
                                            rounded-xl p-1.5
                                            hover:bg-gray-50 transition-all
                                        "
                                    >
                                        <div className="h-10 w-10 text-lg rounded-full bg-primary/20 text-green-700 font-bold flex justify-center items-center shadow-inner">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>

                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-bold text-[#080808]">{user?.name || 'Administrator'}</p>
                                            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest">{user?.role || 'Admin'}</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-screen-2xl bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
