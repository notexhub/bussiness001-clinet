import React from 'react';
import { CreditCard } from 'lucide-react';

const CheckoutPlanSummary = ({ plan, discountAmount, finalAmount }) => {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="p-2.5 sm:p-3 bg-amber-100 rounded-xl">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Plan Summary</h3>
            </div>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="flex justify-between font-medium">
                    <span>{plan.subscriptionName}</span>
                    <span>৳{plan.price?.toLocaleString() || '0'}</span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                )}

                <div className="pt-3 sm:pt-4 border-t border-gray-200 flex justify-between items-center text-base sm:text-xl font-bold text-emerald-700">
                    <span>Total to Pay</span>
                    <span>৳{finalAmount.toLocaleString()}</span>
                </div>

                <div className="text-xs sm:text-sm text-gray-600">
                    Valid for {plan.validityDays} days
                </div>
            </div>
        </div>
    );
};

export default CheckoutPlanSummary;
