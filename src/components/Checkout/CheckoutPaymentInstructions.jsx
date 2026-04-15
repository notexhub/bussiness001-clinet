import React from 'react';
import { Copy } from 'lucide-react';

const CheckoutPaymentInstructions = ({ finalAmount, activePayment, handleCopy }) => {
    return (
        <>
            <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Send <strong className="text-emerald-700 font-semibold">৳{finalAmount.toLocaleString()}</strong> to the following {activePayment?.name} number.
            </p>

            {activePayment?.number && (
                <div className="bg-emerald-50/70 rounded-xl p-4 sm:p-5 mb-6 border border-emerald-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Send to ({activePayment.name})</div>
                            <div className="text-lg sm:text-xl font-bold text-emerald-800 tracking-wide break-all">
                                {activePayment.number}
                            </div>
                        </div>
                        <button
                            onClick={() => handleCopy(activePayment.number, `${activePayment.name} number`)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all w-full sm:w-auto min-h-[44px]"
                        >
                            <Copy size={18} className="text-emerald-600" />
                            <span className="font-medium text-emerald-700">Copy</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckoutPaymentInstructions;
