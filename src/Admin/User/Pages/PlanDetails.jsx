import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import {
    Loader2,
    AlertCircle,
    CheckCircle2,
    Cookie,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import PlanDetailsHeader from '@/components/PlanDetails/PlanDetailsHeader';
import PlanDetailsLoginSection from '@/components/PlanDetails/PlanDetailsLoginSection';
import PlanDetailsCookiesSection from '@/components/PlanDetails/PlanDetailsCookiesSection';
import PlanDetailsTutorial from '@/components/PlanDetails/PlanDetailsTutorial';
import CookieTutorialVideo from '@/components/PlanDetails/CookieTutorialVideo';

const PlanDetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [order, setOrder] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [cookieCredentials, setCookieCredentials] = useState([]);

    const [showPasswords, setShowPasswords] = useState({});
    const [globalPasswordVisible, setGlobalPasswordVisible] = useState(false);

    const [showTutorial, setShowTutorial] = useState(false);
    const [activeTutorialTab, setActiveTutorialTab] = useState(0);
    const [activeCategory, setActiveCategory] = useState('login');
    const [activeCategory2, setActiveCategory2] = useState('cookies');
    const [tutorialVideos, setTutorialVideos] = useState({
        login: {},
        cookies: {},
    });

    const [showSection, setShowSection] = useState(0);
    const [copyingCookieId, setCopyingCookieId] = useState(null);
    const [countdown, setCountdown] = useState(0);

    const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

    // --- ডাটা লোড করার মেইন ফাংশন ---
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                ordersRes,
                subsRes,
                platformsRes,
                visibilityRes,
                loginVideoRes,
                cookiesVideoRes,
                cookiePlatformsRes
            ] = await Promise.all([
                api.get('/order'),
                api.get('/subscription'),
                api.get('/platform'),
                api.get('/copy-btn'),
                api.get('/video'),
                api.get('/cookies-video'),
                api.get('/add_cockies_platform'),
            ]);

            const foundOrder = (ordersRes?.data || []).find((o) => String(o._id?.$oid || o._id) === String(id));
            if (!foundOrder) throw new Error('Order not found');

            const foundSub = (subsRes?.data || []).find((s) => String(s._id?.$oid || s._id) === String(foundOrder.planId));
            if (!foundSub) throw new Error('Subscription plan not found');

            const matchedPlatforms = (platformsRes?.data || []).filter((p) =>
                (foundSub.selectedPlan || []).includes(String(p._id?.$oid || p._id))
            );

            const matchedCookies = (cookiePlatformsRes?.data || []).filter((c) =>
                (foundSub.selectedCookiePlatforms || []).includes(String(c._id?.$oid || c._id))
            );

            setOrder(foundOrder);
            setSubscription(foundSub);
            setPlatforms(matchedPlatforms);
            setCookieCredentials(matchedCookies);
            setGlobalPasswordVisible(visibilityRes?.data?.copy_btn_visibility || false);
            setTutorialVideos({
                login: loginVideoRes?.data?.[0] || {},
                cookies: cookiesVideoRes?.data?.[0] || {},
            });
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load plan details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // --- কুকি প্লাটফর্ম রিফ্রেশ করার ফাংশন ---
    const refreshCookiePlatforms = useCallback(async () => {
        try {
            const res = await api.get('/add_cockies_platform');
            if (subscription) {
                const matchedCookies = (res.data || []).filter((c) =>
                    (subscription.selectedCookiePlatforms || []).includes(String(c._id?.$oid || c._id))
                );
                setCookieCredentials(matchedCookies);
            }
        } catch (err) {
            console.error('Failed to refresh cookie platforms:', err);
        }
    }, [subscription]);

    // --- এক্সটেনশন থেকে মেসেজ রিসিভ করার লজিক ---
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_BASE_URL || 'https://api.notexhub.com';

        // এক্সটেনশনকে কনফিগ পাঠানো
        window.postMessage({ type: 'MASTER_TOOLS_SET_CONFIG', payload: { apiUrl } }, '*');

        const handleMessage = (event) => {
            const { type, payload, success, error: msgError } = event.data || {};
            if (type && type.includes('MASTER_TOOLS_')) {
                console.log("[PlanDetails] Received raw message:", event.data);
            }

            if (type === 'MASTER_TOOLS_EXTENSION_PRESENT') {
                setIsExtensionInstalled(true);
            }



            // যদি এক্সটেনশন সিগন্যাল দেয় যে ট্যাব ক্লোজ হয়েছে বা স্লট রিলিজ হয়েছে
            if (type === 'MASTER_TOOLS_SLOT_REFRESH_REQUIRED' || type === 'SLOT_REFRESH_REQUIRED') {
                console.log("Refreshing ONLY cookie platforms because a slot was released...");
                // Notice: refreshCookiePlatforms is already called inside PlanDetailsCookiesSection
                // So we don't necessarily even need to call it here. But calling it silently is fine.
                // loadData(); // removed to prevent full page spinner
            }

            if (type === 'MASTER_TOOLS_PLATFORM_ACCESS_RESULT') {
                if (success && payload) {
                    window.postMessage({
                        type: 'MASTER_TOOLS_START_HEARTBEAT',
                        payload: { ...payload, tabId: event.data.tabId }
                    }, '*');
                } else if (!success) {
                    toast.error(`Access failed: ${msgError || 'Unknown error'}`);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        window.postMessage({ type: 'MASTER_TOOLS_CHECK_EXTENSION' }, '*');

        return () => window.removeEventListener('message', handleMessage);
    }, [refreshCookiePlatforms]);

    // --- অটোমেটিক পোলিং (Backup হিসেবে) ---
    useEffect(() => {
        if (!subscription) return;
        const poll = setInterval(() => {
            refreshCookiePlatforms();
        }, 8000); // ৮ সেকেন্ড পর পর চেক করবে (সেফটি হিসেবে)
        return () => clearInterval(poll);
    }, [subscription, refreshCookiePlatforms]);

    // --- অন্যান্য হ্যান্ডলারস ---
    const handleSectionChange = (section) => {
        setShowSection(section);
        if (section === 1) refreshCookiePlatforms();
    };

    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied!`, { icon: <CheckCircle2 className="text-green-500" /> });
        } catch { toast.error('Failed to copy'); }
    };

    const handleCopyCookie = useCallback(async (value, cookieId) => {
        if (copyingCookieId) return;
        setCopyingCookieId(cookieId);
        setCountdown(120);
        try {
            await navigator.clipboard.writeText(value);
            toast.success('Cookie value copied!');
        } catch { toast.error('Failed to copy'); }
        setTimeout(() => setCopyingCookieId(null), 120000);
    }, [copyingCookieId]);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => setCountdown((prev) => Math.max(0, prev - 1)), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : '';
    };

    const getActiveVideos = () => {
        const category = showSection === 0
            ? (activeCategory === 'login' ? tutorialVideos.login : {})
            : (activeCategory2 === 'cookies' ? tutorialVideos.cookies : {});

        return {
            desktop: getYouTubeEmbedUrl(showSection === 0 ? category.windowsVideoLink : category.windowsCookiesVideoLink),
            mobile: getYouTubeEmbedUrl(showSection === 0 ? category.mobileVideoLink : category.mobileCookiesVideoLink)
        };
    };

    if (loading) return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <Loader2 className="h-14 w-14 animate-spin text-blue-600" />
        </div>
    );

    if (error || !order || !subscription) return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
            <div className="bg-red-50 p-10 rounded-2xl">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />
                <p className="text-red-700">{error || 'Data not found'}</p>
            </div>
        </div>
    );

    const { desktop: desktopVideoUrl, mobile: mobileVideoUrl } = getActiveVideos();

    return (
        <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-xl shadow-sm border p-1.5 grid grid-cols-2 gap-2">
                    <button onClick={() => handleSectionChange(0)}
                        className={`py-3 flex justify-center items-center gap-2 rounded-lg font-medium transition-all ${showSection === 0 ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-rose-50'}`}>
                        Login Credentials
                    </button>
                    <button onClick={() => handleSectionChange(1)}
                        className={`py-3 rounded-lg flex justify-center items-center gap-2 font-medium transition-all ${showSection === 1 ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-rose-50'}`}>
                        <Cookie size={20} /> Cookies Credentials
                    </button>
                </div>
            </div>

            {showSection === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <PlanDetailsTutorial showTutorial={showTutorial} setShowTutorial={setShowTutorial} desktopVideoUrl={desktopVideoUrl} mobileVideoUrl={mobileVideoUrl} activeTutorialTab={activeTutorialTab} setActiveTutorialTab={setActiveTutorialTab} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                    <PlanDetailsHeader order={order} subscription={subscription} id={id} />
                    <PlanDetailsLoginSection platforms={platforms} globalPasswordVisible={globalPasswordVisible} showPasswords={showPasswords} togglePassword={(pid) => setShowPasswords(p => ({ ...p, [pid]: !p[pid] }))} copyToClipboard={copyToClipboard} />
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <CookieTutorialVideo showTutorial={showTutorial} setShowTutorial={setShowTutorial} desktopVideoUrl={desktopVideoUrl} mobileVideoUrl={mobileVideoUrl} activeTutorialTab={activeTutorialTab} setActiveTutorialTab={setActiveTutorialTab} activeCategory2={activeCategory2} setActiveCategory2={setActiveCategory2} />
                    {cookieCredentials.length > 0 ? (
                        <PlanDetailsCookiesSection cookieCredentials={cookieCredentials} copyingCookieId={copyingCookieId} countdown={countdown} handleCopyCookie={handleCopyCookie} isExtensionInstalled={isExtensionInstalled} refreshCookiePlatforms={refreshCookiePlatforms} />
                    ) : (
                        <div className="w-full mt-8 bg-white rounded-3xl p-20 border border-slate-100 flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-rose-500 mb-4" />
                            <p className="text-slate-500">Loading platforms...</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default PlanDetails;