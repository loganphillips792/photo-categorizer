import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            const response = await fetch('/api/add_user', { // Use /api prefix assuming proxy/same-origin
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }), // Add email to body
            });

            const data = await response.json();

            if (!response.ok) {
                // Use error message from backend if available
                throw new Error(data.error || `Account creation failed: ${response.statusText}`);
            }

            console.log('Account created successfully:', data);
            // Redirect to login page after successful creation
            navigate('/login');

        } catch (err) {
            console.error('Account creation error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during account creation.');
        } finally {
            setIsLoading(false);
        }

    }, [username, email, password, confirmPassword, navigate]); // Add email to dependencies

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