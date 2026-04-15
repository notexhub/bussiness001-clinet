import React from 'react';
import { Globe, Mail, Key, Copy, Eye, EyeOff, LinkIcon } from 'lucide-react';

const PlanDetailsLoginSection = ({
    platforms,
    globalPasswordVisible,
    showPasswords,
    togglePassword,
    copyToClipboard
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
            <div className="px-6 py-5 border-b bg-gray-50/80">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <Globe className="text-indigo-600" />
                    Account Credentials
                </h2>
                <p className="text-sm text-gray-600 mt-1.5">
                    Login details for your active platforms
                </p>
            </div>

            {platforms.length === 0 ? (
                <div className="p-12 text-center text-gray-500 italic">
                    No platform credentials available for this plan.
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {platforms.map((plat) => {
                        const platformId = plat._id?.$oid || plat._id;
                        const visible = globalPasswordVisible || showPasswords[platformId];

                        return (
                            <div key={platformId} className="p-6 hover:bg-gray-50/60 transition-colors">
                                <div className="flex flex-col gap-5">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                        {plat.platformName}
                                    </h3>

                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border">
                                        <Mail className="text-gray-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 uppercase">Email</p>
                                            <p className="font-medium truncate">{plat.platformEmail || '—'}</p>
                                        </div>
                                        {plat.platformEmail && (
                                            <button
                                                onClick={() => copyToClipboard(plat.platformEmail, 'Email')}
                                                className="p-2 hover:bg-gray-200 rounded-lg"
                                            >
                                                <Copy size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border">
                                        <Key className="text-gray-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 uppercase">Password</p>
                                            <p className={`font-mono font-medium ${visible ? '' : 'tracking-widest'}`}>
                                                {visible ? plat.platformPassword || '—' : '•••••••••••'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePassword(platformId)}
                                                className="p-2 hover:bg-gray-200 rounded-lg"
                                                title={visible ? 'Hide password' : 'Show password'}
                                            >
                                                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            {plat.platformPassword && (
                                                <button
                                                    onClick={() => copyToClipboard(plat.platformPassword, 'Password')}
                                                    className="p-2 hover:bg-gray-200 rounded-lg"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {plat.platformLink && (
                                        <a
                                            href={plat.platformLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-xl font-medium transition-colors"
                                        >
                                            <LinkIcon size={18} />
                                            Go to {plat.platformName}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlanDetailsLoginSection;
