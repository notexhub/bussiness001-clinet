import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import UserAsideBar from './UserAsideBar';
import {
    ChevronDown,
    User as UserIcon,
    Settings,
    LogOut,
} from 'lucide-react';

const UserLayout = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [showMenu, setShowMenu] = useState(false);

    const initials =
        user?.name
            ?.split(' ')
            ?.filter(Boolean)
            ?.map(n => n?.[0])
            ?.join('')
            ?.slice(0, 2)
            ?.toUpperCase() || 'U';

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen bg-background font-sans">
            <UserAsideBar />

            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between gap-4">
                            <div />

                            <div className="flex-1 max-w-md hidden md:block" />

                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="relative border-l border-gray-200 pl-4">
                                    <button
                                        onClick={() => setShowMenu(v => !v)}
                                        className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition"
                                    >
                                        <div className="h-10 w-10 text-lg rounded-full bg-primary/20 text-green-700 flex items-center justify-center font-bold shadow-inner">
                                            {initials}
                                        </div>

                                        <div className="hidden md:flex flex-col items-start px-2">
                                            <span className="font-bold text-[#080808] text-sm">
                                                {user?.name || 'User'}
                                            </span>
                                            <span className="text-xs font-semibold text-green-600 uppercase tracking-widest">
                                                Member
                                            </span>
                                        </div>
                                        <ChevronDown size={16} className="text-gray-500" />
                                    </button>

                                    {showMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowMenu(false)}
                                            />

                                            <div className="absolute right-0 top-full h-auto mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                <Link
                                                    to="/dashboard/profile"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
                                                >
                                                    <UserIcon size={18} />
                                                    Profile Settings
                                                </Link>
                                                <Link
                                                    to="/plans"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium"
                                                >
                                                    <Settings size={18} />
                                                    Browse Plans
                                                </Link>
                                                <div className="border-t border-gray-100" />
                                                 <Link
                                                    to="/signin" 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 font-bold"
                                                >
                                                    <LogOut size={18} />
                                                    Logout Out
                                                </Link>

                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-screen-2xl bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
