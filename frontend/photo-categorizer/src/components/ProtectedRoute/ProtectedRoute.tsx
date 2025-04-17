import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader, Center } from '@mantine/core'; // Assuming Mantine for loading state

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Show a loading indicator while checking auth status
        return (
            <Center style={{ height: '100vh' }}>
                <Loader />
            </Center>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the child route (Outlet) if authenticated
    return <Outlet />;
};

export default ProtectedRoute;