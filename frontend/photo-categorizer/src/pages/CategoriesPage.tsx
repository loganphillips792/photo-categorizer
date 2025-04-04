import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Stack,
    Text,
    TextInput, // Added for editing
    Textarea,
    Title,
} from "@mantine/core";
import { IconCheck, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react"; // Added save/cancel icons
import React, { useMemo, useState } from "react"; // Added useState
import mockData from "../lib/mock-data.json"; // Import mock data
import { Category, Photo } from "../types"; // Import types

const CategoriesPage: React.FC = () => {
    // State for categories, editing status, and temporary edit values
    const [categories, setCategories] = useState<Category[]>(mockData.categories as Category[]);
    const [photos, setPhotos] = useState<Photo[]>(mockData.photos as Photo[]); // Keep photo state if needed for counts
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>("");
    const [editDescription, setEditDescription] = useState<string>("");
    // State for adding a new category
    const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [newCategoryDescription, setNewCategoryDescription] = useState<string>("");

    // Calculate photo counts for each category
    const photoCounts = useMemo(() => {
        const counts: { [categoryId: string]: number } = {};
        photos.forEach((photo) => {
            if (photo.category) {
                counts[photo.category.id] = (counts[photo.category.id] || 0) + 1;
            }
        });
        return counts;
    }, [photos]); // Dependency remains photos

    // Start editing a category
    const handleEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        setEditName(category.name);
        setEditDescription(category.description || ""); // Handle potentially undefined description
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        // No need to reset editName/editDescription here
    };

    // Save edited category
    const handleSaveEdit = (categoryId: string) => {
        // TODO: Add API call here to persist changes
        setCategories((prevCategories) =>
            prevCategories.map((cat) =>
                cat.id === categoryId ? { ...cat, name: editName, description: editDescription } : cat,
            ),
        );
        setEditingCategoryId(null); // Exit editing mode
    };

    const handleDeleteCategory = (categoryId: string) => {
        console.log("Delete category:", categoryId);
        // TODO: Implement delete functionality (e.g., confirmation modal, API call)
    };

    // Show the add category form
    const handleAddNewCategory = () => {
        setIsAddingCategory(true);
        setNewCategoryName(""); // Clear previous inputs
        setNewCategoryDescription("");
    };

    // Cancel adding a new category
    const handleCancelAddNewCategory = () => {
        setIsAddingCategory(false);
    };

    // Save the new category
    const handleSaveNewCategory = () => {
        if (!newCategoryName.trim()) {
            // Basic validation: prevent empty name
            // TODO: Add better error handling/feedback
            console.error("Category name cannot be empty");
            return;
        }
        // TODO: Add API call here to persist the new category
        const newCategory: Category = {
            // Generate a temporary ID, replace with real ID from backend later
            id: `temp-cat-${Date.now()}`,
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim(),
            // color: '#cccccc' // Optional: assign a default color or let user choose
        };
        setCategories((prevCategories) => [...prevCategories, newCategory]);
        setIsAddingCategory(false); // Hide form after saving
    };

    return (
        <Container size="md">
            <Stack gap="xl">
                <Stack gap="xs">
                    <Title order={1}>Categories</Title>
                    <Text c="dimmed">Define categories to help the AI classify your photos</Text>
                </Stack>

                <Stack gap="md">
                    {categories.map((category) => {
                        const isEditing = editingCategoryId === category.id;
                        return (
                            <Card key={category.id} shadow="sm" padding="lg" radius="md" withBorder>
                                {isEditing ? (
                                    // Editing View
                                    <Stack gap="md">
                                        <TextInput
                                            label="Category Name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.currentTarget.value)}
                                            data-autofocus // Focus when editing starts
                                        />
                                        <Textarea
                                            label="Description"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.currentTarget.value)}
                                            autosize
                                            minRows={2}
                                        />
                                        <Group justify="flex-end">
                                            <ActionIcon
                                                variant="subtle"
                                                color="gray"
                                                onClick={handleCancelEdit}
                                                aria-label="Cancel edit"
                                            >
                                                <IconX size={18} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="filled"
                                                color="blue"
                                                onClick={() => handleSaveEdit(category.id)}
                                                aria-label="Save changes"
                                            >
                                                <IconCheck size={18} />
                                            </ActionIcon>
                                        </Group>
                                    </Stack>
                                ) : (
                                    // Display View
                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Group gap="sm" align="center">
                                                <Title order={3}>{category.name}</Title>
                                                <Badge variant="light" radius="sm" mt={4}>
                                                    {" "}
                                                    {/* Adjust badge alignment */}
                                                    {photoCounts[category.id] || 0} photos
                                                </Badge>
                                            </Group>
                                            <Group gap="xs">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="gray"
                                                    onClick={() => handleEditCategory(category)} // Pass the whole category object
                                                    aria-label={`Edit category ${category.name}`}
                                                >
                                                    <IconPencil size={18} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    aria-label={`Delete category ${category.name}`}
                                                >
                                                    <IconTrash size={18} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                        {category.description && (
                                            <Text size="sm" c="dimmed">
                                                {category.description}
                                            </Text>
                                        )}
                                    </Stack>
                                )}
                            </Card>
                        );
                    })}{" "}
                    {/* This is the correct closing brace and parenthesis for the map function */}
                </Stack>

                {/* Conditionally render the Add New Category form */}
                {isAddingCategory && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack gap="md">
                            <Title order={4}>Add New Category</Title>
                            <TextInput
                                label="Category Name"
                                placeholder="Enter new category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.currentTarget.value)}
                                data-autofocus
                                required
                            />
                            <Textarea
                                label="Description"
                                placeholder="Enter description (optional)"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.currentTarget.value)}
                                autosize
                                minRows={2}
                            />
                            <Group justify="flex-end">
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    onClick={handleCancelAddNewCategory}
                                    aria-label="Cancel adding category"
                                >
                                    <IconX size={18} />
                                </ActionIcon>
                                <ActionIcon
                                    variant="filled"
                                    color="blue"
                                    onClick={handleSaveNewCategory}
                                    aria-label="Save new category"
                                    disabled={!newCategoryName.trim()} // Disable save if name is empty
                                >
                                    <IconCheck size={18} />
                                </ActionIcon>
                            </Group>
                        </Stack>
                    </Card>
                )}

                <Divider my="md" />

                {/* Add New Category Button */}
                <Button
                    leftSection={<IconPlus size={18} />}
                    onClick={handleAddNewCategory}
                    fullWidth
                    variant="light"
                    disabled={isAddingCategory || editingCategoryId !== null} // Disable if adding or editing
                >
                    Add New Category
                </Button>
            </Stack>
        </Container>
    );
};

export default CategoriesPage;
