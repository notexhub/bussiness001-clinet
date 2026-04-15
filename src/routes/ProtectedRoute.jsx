import { useSelector } from 'react-redux';
import { Loader } from 'lucide-react';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin">
                    <Loader size={20} />
                </div>
            </div>
        );
    }

    if (!user || !user?.email) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
