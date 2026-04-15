import api from '@/api/axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useCouponsData from '@/Admin/Hooks/useCouponsData';
import CheckoutUserInfo from '@/components/Checkout/CheckoutUserInfo';
import CheckoutPlanSummary from '@/components/Checkout/CheckoutPlanSummary';
import CheckoutCouponSection from '@/components/Checkout/CheckoutCouponSection';
import CheckoutPaymentMethod from '@/components/Checkout/CheckoutPaymentMethod';
import CheckoutPaymentInstructions from '@/components/Checkout/CheckoutPaymentInstructions';
import CheckoutPaymentForm from '@/components/Checkout/CheckoutPaymentForm';
import { Smartphone } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const CheckOut = () => {
    const { planId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { couponLoading, couponData } = useCouponsData();
    const navigate = useNavigate();

    const [uiLoading, setUiLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const [setting, setSetting] = useState({});
    const [plan, setPlan] = useState({});

    const [activeMethod, setActiveMethod] = useState('bkash');
    const [senderNumber, setSenderNumber] = useState('');
    const [trxId, setTrxId] = useState('');

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [settingRes, planRes] = await Promise.all([
                    api.get('/settings'),
                    api.get('/subscription'),
                ]);

                const settings = settingRes.data || {};
                setSetting(settings);
                const plans = Array.isArray(planRes.data) ? planRes.data : [];
                const foundPlan = plans.find((p) => p._id === planId);
                if (foundPlan) {
                    setPlan(foundPlan);
                    setFinalAmount(foundPlan.price || 0);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load plan information');
            } finally {
                setUiLoading(false);
            }
        };
        loadData();
    }, [planId]);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        if (couponLoading) {
            toast.error('Coupons are still loading, please wait...');
            return;
        }

        const enteredCode = couponCode.trim().toUpperCase();
        const validCoupons = Array.isArray(couponData) ? couponData : [];
        const coupon = validCoupons.find(c => (c.code || "").trim().toUpperCase() === enteredCode);

        if (!coupon) {
            toast.error('Invalid or expired coupon code', { duration: 4000 });
            return;
        }

        // Compare subscription names case-insensitively and trimmed
        const planName = (plan?.subscriptionName || "").trim().toLowerCase();
        const couponPlanName = (coupon?.subscriptionName || "").trim().toLowerCase();

        console.log("[Coupon] Validating:", { enteredCode, planName, couponPlanName });

        if (couponPlanName !== "all" && couponPlanName !== "" && couponPlanName !== planName) {
            console.warn("[Coupon] Plan mismatch");
            toast.error('This coupon is not valid for this plan', { duration: 4000 });
            return;
        }

        const discountVal = Math.min(Number(coupon.discount || 0), plan.price || 0);
        setDiscountAmount(discountVal);
        setFinalAmount((plan.price || 0) - discountVal);
        setAppliedCoupon(coupon.code);
        toast.success(`Coupon applied! ৳${discountVal} discount`);
    };

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(`${label} copied!`))
            .catch(() => toast.error('Failed to copy'));
    };

    const handleOrder = async () => {
        if (!senderNumber.trim() || !trxId.trim()) {
            toast.error(`Please enter your ${activeMethod} number and Transaction ID`);
            return;
        }
        setBtnLoading(true);
        try {
            const orderData = {
                userEmail: user?.email,
                userName: user?.name,
                planId: plan?._id,
                planName: plan?.subscriptionName,
                amount: finalAmount,
                originalAmount: plan?.price,
                discountAmount: discountAmount,
                couponCode: appliedCoupon || null,
                validityDays: plan?.validityDays,
                paymentMethod: activeMethod,
                senderNumber: senderNumber,
                transactionId: trxId,
                orderDate: new Date(),
            };

            await api.post('/order', orderData);
            toast.success('Order placed successfully! 🎉', { duration: 4000 });
            navigate('/order-success');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setBtnLoading(false);
        }
    };

    if (uiLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="p-6 rounded-full bg-white/70 backdrop-blur-sm shadow-xl"
                >
                    <Loader2 className="w-12 h-12 text-emerald-600" />
                </motion.div>
            </div>
        );
    }

    if (!plan?._id) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const paymentMethods = [
        { id: 'bkash', name: 'bKash', number: setting?.bkash, icon: Smartphone },
        { id: 'nagad', name: 'Nagad', number: setting?.nagad, icon: Smartphone },
        { id: 'rocket', name: 'Rocket', number: setting?.rocket, icon: Smartphone },
        { id: 'upay', name: 'Upay', number: setting?.upay, icon: Smartphone },
    ].filter(m => m.number && m.number.trim() !== '');

    const activePayment = paymentMethods.find(m => m.id === activeMethod) || paymentMethods[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 text-gray-800"
                >
                    Complete Your Subscription
                </motion.h1>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
                >
                    <div className="space-y-5 sm:space-y-6 order-2 lg:order-1">
                        <CheckoutUserInfo user={user} />
                        <CheckoutPlanSummary
                            plan={plan}
                            discountAmount={discountAmount}
                            finalAmount={finalAmount}
                        />
                        <CheckoutCouponSection
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            handleApplyCoupon={handleApplyCoupon}
                            appliedCoupon={appliedCoupon}
                            couponLoading={couponLoading}
                            discountAmount={discountAmount}
                        />
                    </div>

                    <div className="order-1 lg:order-2 lg:sticky lg:top-6 h-fit">
                        <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 p-5 sm:p-6 md:p-8">
                            <CheckoutPaymentMethod
                                paymentMethods={paymentMethods}
                                activeMethod={activeMethod}
                                setActiveMethod={setActiveMethod}
                                setSenderNumber={setSenderNumber}
                            />

                            <CheckoutPaymentInstructions
                                finalAmount={finalAmount}
                                activePayment={activePayment}
                                handleCopy={handleCopy}
                            />

                            <CheckoutPaymentForm
                                activePayment={activePayment}
                                senderNumber={senderNumber}
                                setSenderNumber={setSenderNumber}
                                trxId={trxId}
                                setTrxId={setTrxId}
                                handleOrder={handleOrder}
                                btnLoading={btnLoading}
                            />

                            <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
                                Plan will be activated within a few minutes after successful payment verification.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckOut;
