import React, { useState, FormEvent } from 'react';
import { Container, Title, Stack, TextInput, Textarea, Button, Paper, Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react'; // For error alert icon

// Interface for a category (remains the same)
interface Category {
  id: string;
  name: string;
  description: string;
}

const SettingsPage: React.FC = () => {
  // State remains the same
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', name: 'Work', description: 'Screenshots related to work projects.' },
    { id: 'cat-2', name: 'Personal', description: 'Personal screenshots, memes, etc.' },
  ]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAddCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!newCategoryName.trim() || !newCategoryDescription.trim()) {
      setError('Category name and description cannot be empty.');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        setError(`Category "${newCategoryName.trim()}" already exists.`);
        return;
    }

    // TODO: Add API call here

    const newCategory: Category = {
      id: `temp-cat-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
    };

    setCategories(prevCategories => [...prevCategories, newCategory]);

    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  // TODO: Add functions for editing and deleting categories

  return (
    <Container size="md"> {/* Use Mantine Container */}
      <Stack gap="xl"> {/* Main stack for page sections */}
        <Title order={1}>Settings</Title>

        <Stack gap="lg"> {/* Stack for category management section */}
          <Title order={2}>Manage Categories</Title>

          {/* Form to add a new category */}
          <Paper shadow="xs" p="md" withBorder component="form" onSubmit={handleAddCategory}>
            <Stack gap="md">
              <Title order={3}>Add New Category</Title>
              {error && (
                <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" radius="md">
                  {error}
                </Alert>
              )}
              <TextInput
                label="Name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.currentTarget.value)}
                required
                data-autofocus // Optional: focus on load
              />
              <Textarea
                label="Description"
                placeholder="Enter category description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.currentTarget.value)}
                required
                autosize // Optional: auto-resize height
                minRows={2}
              />
              <Button type="submit">Add Category</Button>
            </Stack>
          </Paper>

          {/* List of existing categories */}
          <Stack gap="md">
             <Title order={3}>Existing Categories</Title>
             {categories.length === 0 ? (
               <Text>No categories defined yet.</Text>
             ) : (
               categories.map((category) => (
                 <Paper key={category.id} shadow="xs" p="md" withBorder>
                   <Text fw={500}>{category.name}</Text>
                   <Text size="sm" c="dimmed">{category.description}</Text>
                   {/* TODO: Add Edit/Delete buttons here (e.g., using Group and ActionIcon) */}
                 </Paper>
               ))
             )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default SettingsPage;