import { useSelector } from 'react-redux';
import api from '@/api/axios';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const [checkingRole, setCheckingRole] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user?.email) {
            setCheckingRole(false);
            return;
        }

        // We already have the user role from the Redux store (populated by auth/admin_me)
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        setCheckingRole(false);
    }, [user, loading]);

    if (loading || checkingRole) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader className="animate-spin" size={24} />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin_signin" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
