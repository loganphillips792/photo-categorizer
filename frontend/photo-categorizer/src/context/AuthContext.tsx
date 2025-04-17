import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean; // To handle initial check
    login: (userData: User) => void;
    logout: () => void;
    checkAuthStatus: () => Promise<void>; // Function to check status on load
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

    // Function to check authentication status (e.g., by calling a backend endpoint)
    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            // Example: Ping a protected backend endpoint that requires a valid JWT cookie
            // If the request succeeds, the user is authenticated.
            // We might get user data back from this endpoint too.
            // For now, let's simulate a check. Replace with actual API call.
            // const response = await fetch('/api/check-auth', { credentials: 'include' });
            // if (response.ok) {
            //     const userData = await response.json();
            //     setIsAuthenticated(true);
            //     setUser(userData);
            // } else {
            //     setIsAuthenticated(false);
            //     setUser(null);
            // }

            // --- Placeholder ---
            // Simulate checking - remove this when implementing actual check
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            // Assume not authenticated initially until login
            setIsAuthenticated(false);
            setUser(null);
            // --- End Placeholder ---

        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Check auth status on initial load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
        setIsLoading(false); // Ensure loading is false after login
    };

    const logout = async () => {
        // Call backend logout endpoint
        try {
            await fetch('/api/logout', { // Ensure /api prefix is present
                method: 'POST',
                credentials: 'include', // Important to send cookies
            });
        } catch (error) {
            console.error("Logout API call failed:", error);
            // Still proceed with frontend logout
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
        }
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};