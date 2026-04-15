import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/api/axios';

// Helper to normalize MongoDB ID
const getID = (id) => (id?.$oid ? id.$oid : id);

const SlotCounter = ({ available, total }) => {
    const [displayVal, setDisplayVal] = useState(available);
    const [direction, setDirection] = useState(0);
    const prevRef = useRef(available);

    useEffect(() => {
        if (available !== prevRef.current) {
            setDirection(available > prevRef.current ? 1 : -1);
            const t = setTimeout(() => {
                setDisplayVal(available);
                prevRef.current = available;
            }, 50);
            return () => clearTimeout(t);
        }
    }, [available]);

    const ratio = total > 0 ? available / total : 0;
    const barColor = ratio > 0.6 ? '#22c55e' : ratio > 0.3 ? '#f59e0b' : ratio > 0 ? '#ef4444' : '#6b7280';
    const labelColor = ratio > 0.6 ? 'text-green-600' : ratio > 0.3 ? 'text-amber-600' : ratio > 0 ? 'text-red-500' : 'text-gray-400';

    const variants = {
        enter: (dir) => ({ y: dir > 0 ? -20 : 20, opacity: 0 }),
        center: { y: 0, opacity: 1 },
        exit: (dir) => ({ y: dir > 0 ? 20 : -20, opacity: 0 }),
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-bold">
                <div className="relative overflow-hidden h-6 w-6 flex items-center justify-center">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.span
                            key={displayVal}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className={`absolute font-extrabold text-base ${labelColor}`}
                        >
                            {displayVal}
                        </motion.span>
                    </AnimatePresence>
                </div>
                <span className="text-gray-400 font-normal">/</span>
                <span className="text-gray-500">{total}</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden min-w-15">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                    animate={{ width: `${ratio * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap ${labelColor}`}>
                {available === 0 ? 'Full' : `${available} Left`}
            </span>
        </div>
    );
};

const PlanDetailsCookiesSection = ({
    cookieCredentials,
    isExtensionInstalled,
    refreshCookiePlatforms
}) => {
    // State to track if conflicting extensions are found
    const [hasBadExtensions, setHasBadExtensions] = useState(false);

    // localSlotOverrides manages optimistic UI state
    const [localSlotOverrides, setLocalSlotOverrides] = useState({});

    // Active Tabs state persisted in sessionStorage instead of localStorage so it automatically clears when the browser is fully closed and reopened!
    const [activeTabs, setActiveTabs] = useState(() => {
        try {
            const saved = sessionStorage.getItem('masterdesk_active_tabs');
            if (saved) return JSON.parse(saved);
        } catch (e) { console.warn(e); }
        return {};
    });

    // Save active tabs to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('masterdesk_active_tabs', JSON.stringify(activeTabs));
    }, [activeTabs]);

    // 1. Listen for slot release from extension & Check for bad extensions
    // Cooldown state persisted in localStorage (survives full browser restarts)
    const [cooldowns, setCooldowns] = useState(() => {
        try {
            const saved = localStorage.getItem('masterdesk_cooldowns');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn("Failed to load cooldowns", e);
        }
        return {};
    });

    // Save cooldowns to localStorage
    useEffect(() => {
        localStorage.setItem('masterdesk_cooldowns', JSON.stringify(cooldowns));
    }, [cooldowns]);

    // Timer logic to tick down cooldowns every second
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
            setCooldowns(prev => {
                let changed = false;
                const next = { ...prev };
                const currentTime = Date.now();

                for (const [key, expireTime] of Object.entries(next)) {
                    if (currentTime >= expireTime) {
                        delete next[key];
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handler = async (event) => {
            if (event.data?.type === 'MASTER_TOOLS_SLOT_REFRESH_REQUIRED' || event.data?.type === 'SLOT_REFRESH_REQUIRED') {
                console.log("[PlanDetails] Extension released a slot. Clearing overrides & active tab state...");
                const releasedSlotId = event.data.slotId;
                if (releasedSlotId) {
                    setActiveTabs(prev => {
                        const updated = { ...prev };
                        // Find the platformId associated with this slot before deleting
                        const platformId = updated[releasedSlotId];

                        // Set 5-minute cooldown for this platform
                        if (platformId) {
                            setCooldowns(prevCooldowns => ({
                                ...prevCooldowns,
                                [platformId]: Date.now() + 5 * 60 * 1000 // 5 minutes in ms
                            }));
                        }

                        delete updated[releasedSlotId];
                        return updated;
                    });
                }
                if (refreshCookiePlatforms) await refreshCookiePlatforms(); // Fetch fresh data from server
                setLocalSlotOverrides({}); // Reset local overrides after data arrives
            }
            if (event.data?.type === 'MASTER_TOOLS_BAD_EXTENSIONS_RESULT') {
                if (event.data.hasBadExtensions) {
                    setHasBadExtensions(true);
                } else {
                    setHasBadExtensions(false);
                }
            }
        };
        window.addEventListener('message', handler);

        // As soon as extension is confirmed installed, ask it to check for bad extensions
        if (isExtensionInstalled) {
            window.postMessage({ type: 'MASTER_TOOLS_CHECK_BAD_EXTENSIONS' }, '*');
        }

        return () => window.removeEventListener('message', handler);
    }, [refreshCookiePlatforms, isExtensionInstalled]);

    // Manual Cleanup and Exit
    const handleCleanupAndExit = () => {
        if (!isExtensionInstalled) {
            toast.error("Extension is not installed");
            return;
        }

        const confirmMsg = "Do you want to completely clear all cookies and close this session instantly?";
        if (window.confirm(confirmMsg)) {
            const cleanupToast = toast.loading('Wiping all cookies and closing tabs...');
            window.postMessage({ type: 'MASTER_TOOLS_CLEANUP_AND_EXIT' }, '*');
            
            // Wait a moment for extension to respond, then close
            setTimeout(() => {
                toast.success('Cleanup complete!', { id: cleanupToast });
                window.close(); // Attempt to close the dashboard tab
            }, 1000);
        }
    };

    // 2. Clear overrides when new data arrives from parent (Polling sync)
    useEffect(() => {
        if (cookieCredentials && cookieCredentials.length > 0) {
            setLocalSlotOverrides({});
        }
    }, [cookieCredentials]);

    const handleAccessPlatform = async (cookie) => {
        if (!isExtensionInstalled) {
            toast.error('Please install the Master Tools extension.');
            return;
        }

        const platformId = getID(cookie._id);
        const loadingToast = toast.loading('Acquiring slot...');

        // Step A: Optimistic Increment (UI updates instantly)
        setLocalSlotOverrides(prev => ({
            ...prev,
            [platformId]: (prev[platformId] ?? Number(cookie.activeSlots ?? 0)) + 1
        }));

        try {
            const res = await api.post('/slots', { platformId });
            const { cookies, domain, redirect, slotId, activeSlots, token } = res.data;

            // Step B: Sync with actual server activeSlots
            if (activeSlots !== undefined) {
                setLocalSlotOverrides(prev => ({ ...prev, [platformId]: Number(activeSlots) }));
            }

            if (token) sessionStorage.setItem('masterdesk_token', token);

            // Track active tab to disable the button
            setActiveTabs(prev => ({
                ...prev,
                [slotId]: platformId
            }));

            // Step C: Send to Extension
            const payload = {
                slotId,
                domain,
                cookies,
                redirectUrl: redirect,
                token: token || sessionStorage.getItem('masterdesk_token') || ''
            };

            window.postMessage({ type: 'MASTER_TOOLS_ACCESS_PLATFORM', payload }, '*');
            toast.success('Access granted!', { id: loadingToast });

        } catch (err) {
            // Rollback on error
            setLocalSlotOverrides(prev => ({
                ...prev,
                [platformId]: Math.max(0, (prev[platformId] || 1) - 1)
            }));
            const msg = err.response?.data?.error || 'Failed to acquire slot.';
            toast.error(msg, { id: loadingToast });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-5">
            <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                <div className="px-6 py-6  flex  justify-between border-b bg-rose-50/60">
                    <h2 className="text-2xl font-bold text-rose-800 flex items-center gap-3">
                        <Key className="text-rose-600" /> Cookies Credentials
                    </h2>
                    <div>
                        {!isExtensionInstalled && (
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href="/NotexHub.zip"
                                download
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded font-bold text-sm transition-all shadow-lg shadow-indigo-100"
                            >
                                <Download size={18} />
                                Dawonload Extension
                            </motion.a>
                        )}
                        {isExtensionInstalled && (
                            <motion.button
                                onClick={handleCleanupAndExit}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded font-bold text-sm transition-all shadow-lg shadow-rose-100 ml-4"
                            >
                                🧹 Clear Cookies & End Session
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Conflicting Extensions Warning Banner */}
                {hasBadExtensions && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-6 rounded-r">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {/* Error Icon */}
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-red-700">
                                    আপনার ব্রাউজারে কুকি/ডাউনলোডার এক্সটেনশন আছে, সেটি রিমুভ করুন! এক্সটেনশন রিমুভ না করা পর্যন্ত আপনি এক্সেস পাবেন না।
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6 space-y-5">
                    {cookieCredentials.map((cookie) => {
                        const cookieId = getID(cookie._id);
                        const total = Number(cookie.p_slot) || 0;

                        // Priority: Local Override > Server Data
                        const active = localSlotOverrides[cookieId] !== undefined
                            ? localSlotOverrides[cookieId]
                            : Number(cookie.activeSlots || 0);

                        const available = Math.max(0, total - active);
                        const isFull = available <= 0;

                        const isTabOpen = Object.values(activeTabs).includes(cookieId);
                        const cooldownExpiry = cooldowns[cookieId];
                        const isCooldown = cooldownExpiry && cooldownExpiry > now;

                        let buttonText = `Access ${cookie.p_name}`;
                        if (hasBadExtensions) buttonText = `🚫 Extensions Conflict`;
                        else if (isTabOpen) buttonText = `💻 Tab is Open`;
                        else if (isCooldown) {
                            const remainingSecs = Math.ceil((cooldownExpiry - now) / 1000);
                            const mins = Math.floor(remainingSecs / 60);
                            const secs = remainingSecs % 60;
                            buttonText = `⏳ Wait ${mins}m ${secs}s`;
                        }
                        else if (isFull) buttonText = '⏳ Wait for Slot';

                        return (
                            <div key={cookieId} className="p-5 bg-gray-50/70 border rounded-xl hover:border-rose-200 transition-colors">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">{cookie.p_name}</h3>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isFull ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                        {isFull ? '🔴 Full' : `🟢 ${available} Slots Left`}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <SlotCounter available={available} total={total} />
                                </div>

                                <button
                                    onClick={() => handleAccessPlatform(cookie)}
                                    disabled={!isExtensionInstalled || isFull || isTabOpen || hasBadExtensions || isCooldown}
                                    className={`w-full py-3 rounded-md font-semibold text-white flex items-center justify-center gap-2 ${(isFull || isTabOpen || isCooldown || !isExtensionInstalled || hasBadExtensions) ? 'bg-gray-300 opacity-70 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default PlanDetailsCookiesSection;