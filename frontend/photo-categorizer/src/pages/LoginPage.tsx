import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!email || !password) {
            setError('Email and password are required.');
            setIsLoading(false);
            return;
        }

        console.log(`Attempting login for email: ${email}`);

        try {
            // Note: Using 127.0.0.1 instead of 127.0.0.0.1 as it's the standard loopback.
            // Assuming port 5000 based on previous /upload endpoint.
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Flask backend expects 'username', let's send email as username for now
                // Adjust if backend expects 'email' specifically
                body: JSON.stringify({ username: email, password: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Login failed with status: ${response.status}`);
            }

            console.log('Login successful:', data);
            // TODO: Store the received token (e.g., in localStorage or context)
            // Example: localStorage.setItem('accessToken', data.access_token);
            // Example: localStorage.setItem('refreshToken', data.refresh_token);

            // Redirect to a protected page or home page after successful login
            navigate('/'); // Redirect to home page for now

        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    }, [email, password, navigate]);

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
                            label="Email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
                            error={error && error.includes('Email') ? error : undefined} // Basic error highlighting
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