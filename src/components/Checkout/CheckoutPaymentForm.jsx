import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CheckoutPaymentForm = ({
    activePayment,
    senderNumber,
    setSenderNumber,
    trxId,
    setTrxId,
    handleOrder,
    btnLoading
}) => {
    return (
        <div className="space-y-5 sm:space-y-6">
            <div className="relative">
                <input
                    type="text"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/60 backdrop-blur-sm text-sm sm:text-base"
                    placeholder=" "
                />
                <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600 transition-all pointer-events-none">
                    Your {activePayment?.name} Number
                </label>
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white/60 backdrop-blur-sm text-sm sm:text-base"
                    placeholder=" "
                />
                <label className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600 transition-all pointer-events-none">
                    Transaction ID (TrxID)
                </label>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrder}
                disabled={btnLoading}
                className={`
                  mt-8 w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-3 shadow-lg min-h-[52px]
                  ${btnLoading
                        ? 'bg-emerald-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}
                  transition-all duration-300 text-base sm:text-lg
                `}
            >
                {btnLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Confirm & Activate Plan
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default CheckoutPaymentForm;
