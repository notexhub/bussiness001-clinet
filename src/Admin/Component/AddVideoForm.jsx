import React, { useState } from 'react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, Video } from 'lucide-react';

const AddVideoForm = ({ title, endpoint, typeLabel }) => {
    const [windowsVideoLink, setWindowsVideoLink] = useState('');
    const [mobileVideoLink, setMobileVideoLink] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!windowsVideoLink.trim() && !mobileVideoLink.trim()) {
            toast.error('Please provide at least one video link');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                windowsVideoLink: windowsVideoLink.trim() || windowsVideoLink.trim(), // Support both naming conventions if needed
                windowsCookiesVideoLink: windowsVideoLink.trim(),
                mobileVideoLink: mobileVideoLink.trim(),
                mobileCookiesVideoLink: mobileVideoLink.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Mapping for backend specific field names if necessary
            if (endpoint === '/cookies-video') {
                payload.windowsCookiesVideoLink = windowsVideoLink.trim();
                payload.mobileCookiesVideoLink = mobileVideoLink.trim();
            }

            const res = await api.post(endpoint, payload);
            if (res.data.acknowledged) {
                toast.success(`${typeLabel} video links added successfully!`);
                setWindowsVideoLink('');
                setMobileVideoLink('');
            } else {
                toast.error('Something went wrong');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to add video links');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-8 px-4 md:px-8"
        >
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                        <Video size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
                        <p className="text-gray-600">Add YouTube links for Desktop and Mobile versions</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Desktop Video Link (Windows)
                        </label>
                        <input
                            type="url"
                            value={windowsVideoLink}
                            onChange={(e) => setWindowsVideoLink(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mobile Video Link
                        </label>
                        <input
                            type="url"
                            value={mobileVideoLink}
                            onChange={(e) => setMobileVideoLink(e.target.value)}
                            placeholder="https://youtu.be/..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            Save Video Links
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AddVideoForm;
