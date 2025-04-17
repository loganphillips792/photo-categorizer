import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import {
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Title,
    Alert,
    Paper,
    Container,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState(''); // Changed from email to username
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth(); // Get auth context

    const handleLogin = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!username || !password) {
            setError('Username and password are required.');
            setIsLoading(false);
            return;
        }

        console.log(`Attempting login for username: ${username}`);

        try {
            // Use relative path assuming proxy or same-origin deployment
            const response = await fetch('/api/login', { // Added /api prefix
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies
                body: JSON.stringify({ username: username, password: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Use error message from backend if available
                throw new Error(data.error || `Login failed: ${response.statusText}`);
            }

            // Login successful! Call auth context login function
            if (data.user) {
                auth.login(data.user); // Update auth state
                console.log('Login successful, user:', data.user);
                navigate('/'); // Redirect to home page
            } else {
                // Handle unexpected success response without user data
                 throw new Error('Login successful but no user data received.');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    }, [username, password, navigate, auth]); // Added auth to dependencies

    return (
        <Container size="xs" px="xs">
             <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" mb="lg">Login</Title>
                <form onSubmit={handleLogin}>
                    <Stack>
                        {error && (
                            <Alert icon={<IconAlertCircle size="1rem" />} title="Login Error" color="red" withCloseButton onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        <TextInput
                            required
                            label="Username" // Changed label
                            placeholder="Your username" // Changed placeholder
                            value={username}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                            error={error && error.includes('Username') ? error : undefined}
                        />

                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            error={error && error.includes('password') ? error : undefined} // Basic error highlighting
                        />

                        <Button type="submit" loading={isLoading} fullWidth mt="xl">
                            Sign in
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;