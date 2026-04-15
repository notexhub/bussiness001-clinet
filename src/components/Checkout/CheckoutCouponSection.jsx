import React from 'react';
import { CreditCard } from 'lucide-react';

const CheckoutCouponSection = ({
    couponCode,
    setCouponCode,
    handleApplyCoupon,
    appliedCoupon,
    couponLoading,
    discountAmount
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Have a coupon?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm sm:text-base"
                />
                <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || appliedCoupon || couponLoading}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all min-h-[48px]
                    ${appliedCoupon
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}
                    disabled:opacity-60`}
                >
                    {appliedCoupon ? 'Applied' : 'Apply'}
                </button>
            </div>
            {appliedCoupon && (
                <p className="mt-3 text-sm text-green-700">
                    Coupon {appliedCoupon} applied • Saved ৳{discountAmount.toLocaleString()}
                </p>
            )}
        </div>
    );
};

export default CheckoutCouponSection;
