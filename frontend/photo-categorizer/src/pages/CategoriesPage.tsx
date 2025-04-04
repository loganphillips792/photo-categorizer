import {
    Container,
    Title,
    Text,
    Stack,
    Card,
    Group,
    Badge,
    ActionIcon,
    Button,
    Divider,
} from "@mantine/core";
import { IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";
import React, { useMemo } from "react";
import { Category, Photo } from "../types"; // Import types
import mockData from "../lib/mock-data.json"; // Import mock data

const CategoriesPage: React.FC = () => {
    // Use mock data directly for now
    const categories: Category[] = mockData.categories as Category[];
    const photos: Photo[] = mockData.photos as Photo[];

    // Calculate photo counts for each category
    const photoCounts = useMemo(() => {
        const counts: { [categoryId: string]: number } = {};
        photos.forEach((photo) => {
            if (photo.category) {
                counts[photo.category.id] = (counts[photo.category.id] || 0) + 1;
            }
        });
        return counts;
    }, [photos]);

    const handleEditCategory = (categoryId: string) => {
        console.log("Edit category:", categoryId);
        // TODO: Implement edit functionality (e.g., open modal)
    };

    const handleDeleteCategory = (categoryId: string) => {
        console.log("Delete category:", categoryId);
        // TODO: Implement delete functionality (e.g., confirmation modal, API call)
    };

    const handleAddNewCategory = () => {
        console.log("Add new category");
        // TODO: Implement add functionality (e.g., open modal or navigate to a form)
    };

    return (
        <Container size="md">
            <Stack gap="xl">
                <Stack gap="xs">
                    <Title order={1}>Categories</Title>
                    <Text c="dimmed">
                        Define categories to help the AI classify your photos
                    </Text>
                </Stack>

                <Stack gap="md">
                    {categories.map((category) => (
                        <Card key={category.id} shadow="sm" padding="lg" radius="md" withBorder>
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Group gap="sm">
                                        <Title order={3}>{category.name}</Title>
                                        <Badge variant="light" radius="sm">
                                            {photoCounts[category.id] || 0} photos
                                        </Badge>
                                    </Group>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            onClick={() => handleEditCategory(category.id)}
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
                        </Card>
                    ))}
                </Stack>

                <Divider my="md" />

                <Button
                    leftSection={<IconPlus size={18} />}
                    onClick={handleAddNewCategory}
                    fullWidth
                    variant="light" // Match screenshot style
                >
                    Add New Category
                </Button>
            </Stack>
        </Container>
    );
};

export default CategoriesPage;