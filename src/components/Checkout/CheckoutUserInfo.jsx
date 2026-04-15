import React from 'react';
import { User, Mail } from 'lucide-react';

const CheckoutUserInfo = ({ user }) => {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="p-2.5 sm:p-3 bg-emerald-100 rounded-xl">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Your Information</h3>
            </div>
            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{user?.name || 'Guest'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="break-all">{user?.email}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutUserInfo;
