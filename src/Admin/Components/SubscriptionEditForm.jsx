import React from 'react';
import { DollarSign, CalendarDays, Tag, Check, Star } from 'lucide-react';

const SubscriptionEditForm = ({
    editForm,
    setEditForm,
    categoryData,
    categoryLoading,
    platforms,
    platformsLoading,
    cookiePlatforms,
    togglePlatform,
    toggleCookiePlatform
}) => {
    return (
        <div className="p-6 space-y-6 text-sm bg-white/50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                        <DollarSign size={14} />
                        <span>Unit Revenue</span>
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm?.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black text-[#080808] bg-white shadow-sm"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2 group">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                        <CalendarDays size={14} />
                        <span>Active Cycle</span>
                    </div>
                    <input
                        type="number"
                        min="1"
                        value={editForm?.validityDays}
                        onChange={(e) => setEditForm({ ...editForm, validityDays: e.target.value })}
                        className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black text-[#080808] bg-white shadow-sm"
                        placeholder="30"
                    />
                </div>
            </div>

            <div className="space-y-2 group">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                    <Tag size={14} />
                    <span>Inventory Class</span>
                </div>
                <select
                    value={editForm?.category || ''}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all font-bold text-[#080808] appearance-none cursor-pointer shadow-sm"
                    disabled={categoryLoading}
                >
                    <option value="">UNCATEGORIZED</option>
                    {categoryData?.map((cat) => (
                        <option key={cat?._id} value={cat?._id}>
                            {cat?.name?.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2 group">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                    <span>Architecture Description</span>
                </div>
                <textarea
                    value={editForm?.subscriptionDescription}
                    onChange={(e) => setEditForm({ ...editForm, subscriptionDescription: e.target.value })}
                    rows={4}
                    className="w-full border-2 border-gray-100 rounded-3xl px-4 py-3 text-sm resize-none focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-600 bg-white placeholder:italic shadow-sm"
                    placeholder="Document the technical specifics of this plan..."
                />
            </div>

            <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Infrastructure Deployment</div>
                <div className="flex flex-wrap gap-2.5">
                    {platformsLoading ? (
                        <div className="text-gray-400 font-bold animate-pulse text-xs">SYNCHRONIZING INFRA...</div>
                    ) : platforms?.length === 0 ? (
                        <div className="text-gray-400 font-bold italic text-xs">NO INFRA AVAILABLE</div>
                    ) : (
                        platforms?.map((plat) => {
                            const isSelected = editForm?.selectedPlan?.includes(plat?._id);
                            return (
                                <button
                                    key={plat?._id}
                                    type="button"
                                    onClick={() => togglePlatform(plat?._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border uppercase ${isSelected ? 'bg-[#080808] text-primary border-[#080808] shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-primary hover:text-[#080808]'
                                        }`}
                                >
                                    {isSelected && <Check size={12} />}
                                    {plat?.platformName}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cookie Integration Modules</div>
                <div className="flex flex-wrap gap-2.5">
                    {platformsLoading ? (
                         <div className="text-gray-400 font-bold animate-pulse text-xs">SYNCHRONIZING COOKIES...</div>
                    ) : cookiePlatforms?.length === 0 ? (
                        <div className="text-gray-400 font-bold italic text-xs">NO MODULES AVAILABLE</div>
                    ) : (
                        cookiePlatforms?.map((cp) => {
                            const isSelected = editForm?.selectedCookiePlatforms?.includes(cp?._id);
                            return (
                                <button
                                    key={cp?._id}
                                    type="button"
                                    onClick={() => toggleCookiePlatform(cp?._id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all border uppercase ${isSelected ? 'bg-primary text-[#080808] border-primary shadow-[0_4px_15px_rgba(132,204,22,0.3)]' : 'bg-white text-gray-400 border-gray-100 hover:border-primary hover:text-[#080808]'
                                        }`}
                                >
                                    {isSelected && <Check size={12} />}
                                    {cp?.p_name || cp?.platformName || 'UNNAMED MODULE'}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={editForm?.isMostPopular}
                            onChange={(e) => setEditForm({ ...editForm, isMostPopular: e.target.checked })}
                            className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${editForm?.isMostPopular ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-200'}`}>
                            {editForm?.isMostPopular && <Check size={14} className="text-[#080808] stroke-[4]" />}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#080808] transition-colors">
                        <Star size={16} className={editForm?.isMostPopular ? 'fill-primary text-primary' : ''} />
                        <span>Prioritize as flagship offering</span>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default SubscriptionEditForm;
