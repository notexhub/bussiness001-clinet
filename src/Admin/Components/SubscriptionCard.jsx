import React from 'react';
import { motion } from 'framer-motion';
import { Star, Edit, Save, X, Trash2, Loader2, DollarSign, CalendarDays, Tag, Globe } from 'lucide-react';
import SubscriptionEditForm from './SubscriptionEditForm';

const SubscriptionCard = ({
    sub,
    isEditing,
    isDeleting,
    editForm,
    setEditForm,
    handleEditStart,
    handleEditCancel,
    showConfirmation,
    formatPrice,
    getCategoryName,
    getPlatformName,
    platforms,
    cookiePlatforms,
    categoryData,
    categoryLoading,
    platformsLoading,
    togglePlatform,
    toggleCookiePlatform
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 ${isEditing ? 'border-primary ring-4 ring-primary/10 shadow-xl' : 'border-gray-100 hover:shadow-xl hover:border-primary/50'
                }`}
        >
            <div className={`md:px-6 py-5 border-b flex items-center justify-between gap-3 ${isEditing ? 'bg-primary/5' : 'bg-gray-50/50'}`}>
                <div className="flex items-center gap-3 min-w-0">
                    {sub?.isMostPopular && !isEditing && (
                        <div className="flex items-center gap-1.5 bg-primary text-[#080808] text-[10px] font-black px-3 py-1.5 rounded-full shrink-0 shadow-sm uppercase tracking-widest">
                            <Star size={12} className="fill-[#080808]" />
                            Featured
                        </div>
                    )}
                    <h3 className="font-black text-[#080808] truncate logoFont text-lg">
                        {isEditing ? editForm?.subscriptionName : sub?.subscriptionName}
                    </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => showConfirmation('save', sub?._id, 'Confirm architecture update?')}
                                disabled={isDeleting}
                                className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-green-100"
                                title="Finalize Changes"
                            >
                                <Save size={20} />
                            </button>
                            <button
                                onClick={handleEditCancel}
                                className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                                title="Discard"
                            >
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleEditStart(sub)}
                                disabled={isDeleting}
                                className="p-2.5 text-[#080808] hover:bg-primary rounded-xl transition-all shadow-sm border border-gray-100"
                                title="Modify"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() =>
                                    showConfirmation(
                                        'delete',
                                        sub?._id,
                                        'WARNING: This will permanently remove the subscription architecture. Proceed?'
                                    )
                                }
                                disabled={isDeleting}
                                className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shadow-sm"
                                title="Terminate"
                            >
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <SubscriptionEditForm
                    editForm={editForm}
                    setEditForm={setEditForm}
                    categoryData={categoryData}
                    categoryLoading={categoryLoading}
                    platforms={platforms}
                    platformsLoading={platformsLoading}
                    cookiePlatforms={cookiePlatforms}
                    togglePlatform={togglePlatform}
                    toggleCookiePlatform={toggleCookiePlatform}
                />
            ) : (
                <div className="p-6 space-y-6 text-sm relative">
                    <div className="grid grid-cols-2 gap-6 pb-6 border-b border-dashed border-gray-100">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <DollarSign size={14} className="text-primary" />
                                <span>Unit Price</span>
                            </div>
                            <div className="font-black text-[#080808] text-2xl tracking-tighter">
                                ৳{formatPrice(sub?.price)}
                            </div>
                        </div>

                        <div className="space-y-1 text-right">
                            <div className="flex items-center justify-end gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <CalendarDays size={14} className="text-primary" />
                                <span>Cycle</span>
                            </div>
                            <div className="font-black text-[#080808] text-2xl tracking-tighter">
                                {sub?.validityDays}<span className="text-sm font-bold ml-1 text-gray-400">DAYS</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <Tag size={14} className="text-primary" />
                            <span>Classification</span>
                        </div>
                        <div className="font-bold text-[#080808] text-base">
                            {getCategoryName(sub?.category?._id || sub?.category)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Summary</div>
                        <p className="text-gray-500 font-medium leading-relaxed italic">
                            "{sub?.subscriptionDescription || 'No description provided for this architecture.'}"
                        </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Infrastructure</div>
                        <div className="flex flex-wrap gap-2">
                            {sub?.selectedPlan?.length > 0 ? (
                                sub.selectedPlan.map((id, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-[#080808] text-[10px] font-black rounded-full border border-gray-100 group hover:border-primary/50 transition-colors"
                                    >
                                        <Globe size={12} className="text-primary" />
                                        {getPlatformName(id, platforms)}
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-400 font-bold italic text-xs">Zero platforms associated.</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cookie Integration</div>
                        <div className="flex flex-wrap gap-2">
                            {sub?.selectedCookiePlatforms?.length > 0 ? (
                                sub.selectedCookiePlatforms.map((id, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50/50 text-green-700 text-[10px] font-black rounded-full border border-green-100 hover:border-primary transition-colors"
                                    >
                                        <Globe size={12} className="text-primary" />
                                        {getPlatformName(id, cookiePlatforms)}
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-400 font-bold italic text-xs">No specialized cookie platforms.</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SubscriptionCard;
