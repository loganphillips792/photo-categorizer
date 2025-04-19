import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import {
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Title,
    Alert,
    Paper,
    Text,
    Anchor,
    Container,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const CreateAccountPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Add email state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth(); // Get auth context

    const handleCreateAccount = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (!username || !email || !password || !confirmPassword) { // Add email validation
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        console.log(`Attempting to create account for username: ${username}, email: ${email}`); // Log email

        try {
            // Step 1: Register the user
            const registerResponse = await fetch('/api/add_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                throw new Error(registerData.error || `Account creation failed: ${registerResponse.statusText}`);
            }
            console.log('Account created successfully:', registerData);

            // Step 2: Attempt automatic login
            console.log(`Attempting automatic login for username: ${username}`);
            const loginResponse = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies
                body: JSON.stringify({ username: username, password: password }),
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                 // Registration succeeded, but auto-login failed.
                 throw new Error(loginData.error || `Registration successful, but auto-login failed: ${loginResponse.statusText}. Please log in manually.`);
            }

            // Step 3: Update auth state and redirect
            if (loginData.user) {
                auth.login(loginData.user); // Update auth state
                console.log('Auto-login successful, user:', loginData.user);
                navigate('/'); // Redirect to home page
            } else {
                // Handle unexpected success response without user data from login
                throw new Error('Auto-login successful but no user data received.');
            }

        } catch (err) {
            console.error('Account creation error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during account creation.');
        } finally {
            setIsLoading(false);
        }

    }, [username, email, password, confirmPassword, navigate, auth]); // Add auth to dependencies

    return (
        <Container size="xs" px="xs">
             <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" mb="lg">Create Account</Title>
                <form onSubmit={handleCreateAccount}>
                    <Stack>
                        {error && (
                            <Alert icon={<IconAlertCircle size="1rem" />} title="Creation Error" color="red" withCloseButton onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        <TextInput
                            required
                            label="Username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                        />

                        <TextInput
                            required
                            type="email" // Set input type to email
                            label="Email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
                        />

                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Choose a password"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                        />

                        <PasswordInput
                            required
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                            error={error && error.includes('match') ? 'Passwords do not match' : undefined}
                        />

                        <Button type="submit" loading={isLoading} fullWidth mt="xl">
                            Create Account
                        </Button>

                        <Text ta="center" mt="md">
                            Already have an account? <Anchor component={Link} to="/login">Sign in</Anchor>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateAccountPage;