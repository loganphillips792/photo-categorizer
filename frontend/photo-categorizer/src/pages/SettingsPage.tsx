import {
    Container,
    Stack,
    Title,
    Paper,
    TextInput,
    Button,
    Group,
    Notification,
    Text,
} from "@mantine/core";
import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { IconCheck, IconX } from "@tabler/icons-react";

// Helper function to get a cookie by name
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

const SettingsPage: React.FC = () => {
    const { user, checkAuthStatus } = useAuth(); // Get user and potentially a function to refresh auth state
    const [newUsername, setNewUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Pre-fill username when user data loads
    useEffect(() => {
        if (user) {
            setNewUsername(user.username);
        }
    }, [user]);

    const handleUpdateUsername = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!newUsername || newUsername === user?.username) {
            setError("Please enter a new, different username.");
            setIsLoading(false);
            return;
        }

        console.log(`Attempting to update username to: ${newUsername}`);
        try {
            const csrfToken = getCookie('csrf_access_token'); // Get CSRF token from cookie
            if (!csrfToken) {
                throw new Error("CSRF token not found. Please log in again.");
            }

            const response = await fetch('/api/user/update-username', { // Assuming this endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, // Add CSRF token header
                },
                credentials: 'include', // Send auth cookie
                body: JSON.stringify({ new_username: newUsername }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Failed to update username: ${response.statusText}`);
            }

            setSuccessMessage("Username updated successfully!");
            await checkAuthStatus(); // Refresh user context to show updated username in header etc.

        } catch (err) {
             console.error('Username update error:', err);
             setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [newUsername, user?.username, checkAuthStatus]); // Add checkAuthStatus to dependencies
    return (
        <Container size="md">
            {" "}
            {/* Use Mantine Container */}
            <Stack gap="xl">
                {" "}
                {/* Main stack for page sections */}
                <Title order={1}>Settings</Title>

                <Paper withBorder shadow="sm" p="lg" radius="md">
                    <Title order={3} mb="md">Update Username</Title>
                    {error && (
                        <Notification icon={<IconX size="1.1rem" />} color="red" title="Error" withCloseButton={false} mb="md" onClose={() => setError(null)}>
                            {error}
                        </Notification>
                    )}
                    {successMessage && (
                        <Notification icon={<IconCheck size="1.1rem" />} color="teal" title="Success" withCloseButton={false} mb="md" onClose={() => setSuccessMessage(null)}>
                            {successMessage}
                        </Notification>
                    )}
                    {user ? (
                        <form onSubmit={handleUpdateUsername}>
                            <Stack>
                                <TextInput
                                    label="New Username"
                                    placeholder="Enter your new username"
                                    value={newUsername}
                                    onChange={(event) => setNewUsername(event.currentTarget.value)}
                                    required
                                />
                                <Group justify="flex-end" mt="md">
                                    <Button type="submit" loading={isLoading}>Update Username</Button>
                                </Group>
                            </Stack>
                        </form>
                    ) : <Text>Loading user information...</Text>}
                </Paper>
            </Stack>
        </Container>
    );
};

export default SettingsPage;
