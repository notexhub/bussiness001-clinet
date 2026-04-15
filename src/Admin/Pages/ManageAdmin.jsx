import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '@/api/axios';
import { motion } from 'framer-motion';
import { Plus, Trash2, ShieldCheck, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageAdmin = () => {
    const { user } = useSelector((state) => state.auth);
    const isSuperAdmin = user?.role === 'superadmin';

    const [admins, setAdmins] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [loading, setLoading] = useState(false);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin');
            setAdmins(res.data || []);
        } catch (err) {
            toast.error('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Name is required');
        if (!email.trim()) return toast.error('Email is required');
        if (!password.trim()) return toast.error('Password is required');

        try {
            await api.post('/admin', { name: name.trim(), email: email.trim(), password: password.trim(), role });
            toast.success('Admin added successfully');
            setName('');
            setEmail('');
            setPassword('');
            setRole('admin');
            await loadAdmins();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to add admin');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await api.patch(`/admin/${id}`, { role: newRole });
            toast.success('Role updated');
            await loadAdmins();
        } catch {
            toast.error('Failed to update role');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this admin?')) return;

        try {
            await api.delete(`/admin/${id}`);
            toast.success('Admin removed');
            await loadAdmins();
        } catch {
            toast.error('Failed to delete admin');
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 border border-gray-100 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-0"></div>

            <div className="mx-auto max-w-5xl relative z-10">
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-[#080808] shadow-lg shadow-black/10">
                            <ShieldCheck className="text-primary" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#080808] tracking-tight logoFont">
                                Admin<span className="text-green-600">Protocol</span>
                            </h1>
                            <p className="text-gray-500 font-medium text-sm sm:text-base mt-2">
                                Governance and hierarchical control of platform authorities.
                            </p>
                        </div>
                    </div>
                </div>

                {isSuperAdmin && (
                    <motion.form
                        onSubmit={handleAddAdmin}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500"
                    >
                        <div className="p-6 sm:p-10 flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Entity Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full name of authority..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-[#080808] bg-gray-50/50"
                                        required
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Secure Email</label>
                                    <input
                                        type="email"
                                        placeholder="admin@notexhub.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-[#080808] bg-gray-50/50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Credentials</label>
                                    <input
                                        type="password"
                                        placeholder="Strong passphrase..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-[#080808] bg-gray-50/50"
                                        required
                                    />
                                </div>

                                <div className="w-full sm:w-44 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hierarchy Level</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-black text-[#080808] bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="superadmin">SUPERADMIN</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#080808] hover:bg-black text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all shadow-xl shadow-black/10 hover:shadow-primary/20 hover:text-primary min-h-[56px]"
                                >
                                    <Plus size={20} className="text-primary" />
                                    Authorize Admin
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5 flex items-center justify-between">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Active Authorities ({admins?.length || 0})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-20 flex flex-col justify-center items-center gap-4">
                            <Loader className="animate-spin text-primary" size={40} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing Hierarchy...</p>
                        </div>
                    ) : admins?.length === 0 ? (
                        <div className="p-20 text-center">
                            <ShieldCheck className="mx-auto h-20 w-20 text-gray-100 mb-6" />
                            <p className="text-xl font-black text-gray-400 italic">No administrative entities located.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-50/50 text-gray-400 text-left">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-sans">Identity Email</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-sans w-48 text-center">Hierarchy Access</th>
                                        {isSuperAdmin && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest font-sans text-right w-32">Operations</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {admins.map((admin) => (
                                        <tr
                                            key={admin?._id}
                                            className="hover:bg-gray-50/70 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-[#080808] group-hover:text-green-600 transition-colors break-all">
                                                    {admin?.email}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {isSuperAdmin ? (
                                                    <select
                                                        value={admin?.role}
                                                        onChange={(e) =>
                                                            handleRoleChange(admin?._id, e.target.value)
                                                        }
                                                        className="w-full max-w-[160px] border-2 border-gray-100 rounded-xl px-4 py-2 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[#080808] text-xs mx-auto block uppercase tracking-widest"
                                                    >
                                                        <option value="superadmin">SUPERADMIN</option>
                                                        <option value="admin">ADMIN</option>
                                                        <option value="user">USER</option>
                                                    </select>
                                                ) : (
                                                    <div className="text-center">
                                                        <span className="inline-flex px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-gray-100 text-[#080808] border border-gray-200 uppercase">
                                                            {admin?.role}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            {isSuperAdmin && (
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => handleDelete(admin?._id)}
                                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 group/btn"
                                                        title="Revoke Authorization"
                                                    >
                                                        <Trash2 size={22} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAdmin;
