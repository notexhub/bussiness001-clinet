import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '@/store/slices/authSlice';
import {
    Mail,
    User as UserIcon,
    Calendar,
    LogOut,
    Edit2,
    Save,
    X
} from 'lucide-react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [updating, setUpdating] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="h-10 w-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 text-lg">No user data found</p>
            </div>
        );
    }

    const initials =
        user.name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';

    const handleLogout = () => {
        dispatch(adminLogout());
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        try {
            setUpdating(true);
            const res = await api.patch(`/users/${user._id}`, { name: newName });
            if (res.data.modifiedCount === 1) {
                toast.success('Name updated successfully. Please refresh or relogin to see changes.');
                setIsEditing(false);
            } else {
                toast.error('No changes made');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update name');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="p-8 sm:p-10 flex flex-col sm:flex-row gap-6">
                        <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold">
                            {initials}
                        </div>

                        <div className="flex-1">
                            {isEditing ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-white/40 text-2xl font-bold"
                                        placeholder="Enter your name"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={updating}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {updating ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-bold">
                                        {user.name || 'Unnamed User'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setNewName(user.name);
                                            setIsEditing(true);
                                        }}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white/70 hover:text-white"
                                        title="Edit Name"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-3 text-slate-300">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InfoCard
                        icon={<Calendar />}
                        label="Account Created"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    />
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
            {icon}
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
        <p className="mt-1 font-semibold text-slate-900 break-words">{value}</p>
    </div>
);

export default Profile;
