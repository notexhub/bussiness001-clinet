import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import {
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import api from '@/api/axios';
import useCategory from '../Hooks/useCategory';

// Sub-components
import SubscriptionCard from '../Components/SubscriptionCard';
import AdminConfirmModal from '../Components/AdminConfirmModal';

const ManageSubscription = () => {
    const { categoryLoading, categoryData = [] } = useCategory();

    const [subscriptions, setSubscriptions] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [cookiePlatforms, setCookiePlatforms] = useState([]);

    const [subsLoading, setSubsLoading] = useState(true);
    const [platformsLoading, setPlatformsLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deletingId, setDeletingId] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    const fetchSubscriptions = async () => {
        try {
            setSubsLoading(true);
            const res = await api.get('/subscription');
            setSubscriptions(res.data || []);
        } catch (err) {
            console.error('Failed to load subscriptions:', err);
            toast.error('Could not load subscription plans');
        } finally {
            setSubsLoading(false);
        }
    };

    const fetchPlatforms = async () => {
        try {
            setPlatformsLoading(true);
            const [platRes, cookieRes] = await Promise.all([
                api.get('/platform'),
                api.get('/add_cockies_platform'),
            ]);

            setPlatforms(platRes.data || []);
            setCookiePlatforms(cookieRes.data || []);
        } catch (err) {
            console.error('Failed to load platforms:', err);
            toast.error('Failed to load platforms / cookie platforms');
        } finally {
            setPlatformsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
        fetchPlatforms();
    }, []);

    const handleEditStart = (sub) => {
        setEditingId(sub._id);
        setEditForm({
            subscriptionName: sub.subscriptionName || '',
            validityDays: sub.validityDays || '',
            price: sub.price || '',
            isMostPopular: !!sub.isMostPopular,
            subscriptionDescription: sub.subscriptionDescription || '',
            selectedPlan: sub.selectedPlan ? [...sub.selectedPlan] : [],
            selectedCookiePlatforms: sub.selectedCookiePlatforms ? [...sub.selectedCookiePlatforms] : [],
            category: sub.category?._id || sub.category || '',
        });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const togglePlatform = (platformId) => {
        setEditForm((prev) => {
            const current = prev.selectedPlan || [];
            if (current.includes(platformId)) {
                return { ...prev, selectedPlan: current.filter((id) => id !== platformId) };
            }
            return { ...prev, selectedPlan: [...current, platformId] };
        });
    };

    const toggleCookiePlatform = (cookieId) => {
        setEditForm((prev) => {
            const current = prev.selectedCookiePlatforms || [];
            if (current.includes(cookieId)) {
                return { ...prev, selectedCookiePlatforms: current.filter((id) => id !== cookieId) };
            }
            return { ...prev, selectedCookiePlatforms: [...current, cookieId] };
        });
    };

    const showConfirmation = (action, id, message) => {
        setConfirmAction(action);
        setConfirmId(id);
        setConfirmMessage(message);
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (confirmAction === 'save') {
            await handleSave(confirmId);
        } else if (confirmAction === 'delete') {
            await handleDelete(confirmId);
        }
        setShowConfirmModal(false);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmId(null);
        setConfirmMessage('');
    };

    const handleSave = async (id) => {
        try {
            const payload = {
                subscriptionName: editForm.subscriptionName.trim(),
                validityDays: Number(editForm.validityDays),
                price: Number(editForm.price),
                isMostPopular: editForm.isMostPopular,
                subscriptionDescription: editForm.subscriptionDescription.trim(),
                selectedPlan: editForm.selectedPlan || [],
                selectedCookiePlatforms: editForm.selectedCookiePlatforms || [],
                category: editForm.category || null,
            };

            const res = await api.patch(`/subscription/${id}`, payload);

            if (res.data?.modifiedCount === 1 || res.data?.acknowledged) {
                toast.success('Subscription updated successfully');
                setEditingId(null);
                setEditForm({});
                await fetchSubscriptions();
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update plan');
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const res = await api.delete(`/subscription/${id}`);
            if (res.data?.deletedCount === 1 || res.data?.acknowledged) {
                toast.success('Subscription deleted successfully');
                await fetchSubscriptions();
            } else {
                throw new Error('Delete failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const formatPrice = (price) =>
        Number(price).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

    const getCategoryName = (catId) => {
        if (!catId) return '—';
        const cat = categoryData.find((c) => c._id === catId);
        return cat ? cat.name : 'Unknown';
    };

    const getPlatformName = (id, list = platforms) => {
        const found = list.find((p) => p._id === id);
        return found ? found.platformName || found.name || 'Unknown' : 'Unknown';
    };

    const isLoading = subsLoading || platformsLoading || categoryLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center rounded-3xl">
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Loader2 className="h-16 w-16 text-primary" />
                    </motion.div>
                    <p className="text-[#080808] font-black tracking-widest text-sm uppercase">
                        {subsLoading
                            ? 'Synchronizing Plans...'
                            : platformsLoading
                                ? 'Mapping Infrastructure...'
                                : 'Indexing Categories...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8 md:px-4 sm:px-6 lg:px-8 border border-gray-100 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080808] tracking-tight logoFont">
                            Manage<span className="text-green-600">Subscriptions</span>
                        </h1>
                        <p className="mt-2 text-gray-500 font-medium text-sm sm:text-base">
                            Architect and govern the subscription frameworks across the NotexHub biosphere.
                        </p>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#080808] bg-white px-6 py-3 rounded-2xl border-2 border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        Total Architectures: <span className="text-green-600 text-sm ml-1">{subscriptions?.length}</span>
                    </div>
                </div>

                {subscriptions?.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-20 text-center">
                        <AlertTriangle className="mx-auto h-20 w-20 text-primary mb-6 animate-bounce" />
                        <h3 className="text-3xl font-black text-[#080808] mb-4 logoFont">Framework Empty</h3>
                        <p className="text-gray-500 font-medium max-w-md mx-auto italic">
                            No subscription plans detected in the database. Deploy your first architecture from the <strong>Configuration</strong> panel.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {subscriptions.map((sub) => (
                            <SubscriptionCard
                                key={sub?._id}
                                sub={sub}
                                isEditing={editingId === sub?._id}
                                isDeleting={deletingId === sub?._id}
                                editForm={editForm}
                                setEditForm={setEditForm}
                                handleEditStart={handleEditStart}
                                handleEditCancel={handleEditCancel}
                                showConfirmation={showConfirmation}
                                formatPrice={formatPrice}
                                getCategoryName={getCategoryName}
                                getPlatformName={getPlatformName}
                                platforms={platforms}
                                cookiePlatforms={cookiePlatforms}
                                categoryData={categoryData}
                                categoryLoading={categoryLoading}
                                platformsLoading={platformsLoading}
                                togglePlatform={togglePlatform}
                                toggleCookiePlatform={toggleCookiePlatform}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AdminConfirmModal
                isOpen={showConfirmModal}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title="Protocol Confirmation"
                message={confirmMessage}
                confirmText={confirmAction === 'delete' ? 'Terminate Plan' : 'Apply Changes'}
                variant={confirmAction === 'delete' ? 'danger' : 'primary'}
            />
        </div>
    );
};

export default ManageSubscription;
