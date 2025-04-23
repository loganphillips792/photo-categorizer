import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PremiumAccessPage: React.FC = () => {
    const { user } = useAuth();
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/premium-access");

                if (response.ok) {
                    const data = await response.json();
                    setContent(data.message);
                    setError(null);
                } else if (response.status === 403) {
                    const data = await response.json();
                    setError(data.error);
                    setContent(null);
                } else {
                    setError("Failed to fetch premium content.");
                    setContent(null);
                }
            } catch (error) {
                setError("Network error. Please try again.");
                setContent(null);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {content && (
                <>
                    <h1>Premium Access</h1>
                    <p>{content}</p>
                </>
            )}
        </div>
    );
};

export default PremiumAccessPage;
