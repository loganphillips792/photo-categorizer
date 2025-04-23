import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    username: string;
   role: string;
   isSubscriber: boolean;
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
            // Ping backend endpoint to check for valid session cookie
            const response = await fetch("/api/check-auth", {
                // Assuming this endpoint exists
                method: "GET", // Or POST, depending on backend implementation
                credentials: "include", // Crucial for sending cookies
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData.user) {
                    // Check if user data exists in response
                    setIsAuthenticated(true);
                    setUser(userData.user); // Assuming backend returns { user: { ..., isSubscriber: boolean } }
                } else {
                    // Response OK, but no user data? Treat as not authenticated.
                    console.warn("Auth check successful but no user data received.");
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                // If response is not ok (e.g., 401), user is not authenticated
                setIsAuthenticated(false);
                setUser(null);
            }
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
            await fetch("/api/logout", {
                // Ensure /api prefix is present
                method: "POST",
                credentials: "include", // Important to send cookies
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
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
