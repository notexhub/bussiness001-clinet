import React from 'react';
import { Eye, EyeOff, Monitor, Smartphone, ShieldCheck, Key, Settings2, Cookie } from 'lucide-react';

const CookieTutorialVideo = ({
    showTutorial,
    setShowTutorial,
    desktopVideoUrl,
    mobileVideoUrl,
    activeTutorialTab,
    setActiveTutorialTab,
    activeCategory2,
    setActiveCategory2
}) => {
    const hasAnyVideo = desktopVideoUrl || mobileVideoUrl;

    const categories = [
        // { id: 'login', label: 'Login Video', icon: <Key size={16} /> },
        // { id: 'manage-cookie', label: 'Manage Cookie', icon: <ShieldCheck size={16} /> },
    ];
    console.log(activeCategory2)

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowTutorial(!showTutorial)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm border transition-all font-semibold text-sm ${showTutorial
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                        }`}
                >
                    {showTutorial ? <EyeOff size={18} /> : <Eye size={18} />}
                    {showTutorial ? 'Hide Tutorial' : 'Show Tutorial Videos'}
                </button>
            </div>

            {showTutorial && (
                <div className="bg-white rounded shadow-xl  overflow-hidden transition-all">
                    <div className="bg-gray-50/80  p-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory2(cat.id);
                                        setActiveTutorialTab(0);
                                    }}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${activeCategory2 === cat.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border focus:ring-2 focus:ring-indigo-200'
                                        }`}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => setActiveTutorialTab(0)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded cursor-pointer font-bold transition-all ${activeTutorialTab === 0
                                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                                    : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                <Monitor size={20} />
                              How to use in Desktop
                            </button>
                            <button
                                onClick={() => setActiveTutorialTab(1)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded cursor-pointer font-bold transition-all ${activeTutorialTab === 1
                                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                                    : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                <Smartphone size={20} />
                                How to use on Mobile
                            </button>
                        </div>

                        {/* Video Frame */}
                        <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden border shadow-inner bg-slate-900">
                            {(activeTutorialTab === 0 ? desktopVideoUrl : mobileVideoUrl) ? (
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={activeTutorialTab === 0 ? desktopVideoUrl : mobileVideoUrl}
                                    title="Tutorial Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                                    <Video className="w-16 h-16 text-slate-700 mb-4" />
                                    <p className="text-xl font-bold opacity-60">No tutorial video available for this version</p>
                                    <p className="text-sm opacity-40 mt-2">Try switching between Desktop/Mobile or another category</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CookieTutorialVideo;
