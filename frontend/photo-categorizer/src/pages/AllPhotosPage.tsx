import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Container,
    Grid,
    Group,
    Image,
    Modal,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from "@mantine/core"; // Added Modal, SimpleGrid
import { useDisclosure } from "@mantine/hooks"; // Added useDisclosure
import { IconInfoCircle } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
// import PhotoUpload from '../components/PhotoUpload/PhotoUpload'; // Removed - Upload likely happens elsewhere now
import FilterControls from "../components/FilterControls/FilterControls";

// Define the possible filter types
type StatusFilter = "all" | "processed" | "categorized" | "uncategorized";

// Interface for a category
interface Category {
    id: string;
    name: string;
}

// Interface for a photo
interface Photo {
    id: string;
    name: string;
    url: string;
    status: "uncategorized" | "categorized" | "processing";
    categoryId?: string;
}

const AllPhotosPage: React.FC = () => {
    // State remains the same
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([
        { id: "cat-1", name: "Work" },
        { id: "cat-2", name: "Personal" },
    ]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    // handleFilesSelected might be triggered from a different component now (e.g., a dedicated upload button/page)
    // Keeping the logic here for now, assuming it might be called from somewhere
    const handleFilesSelected = (files: FileList) => {
        console.log("Files selected in AllPhotosPage:", files);
        setUploadStatus(`Processing ${files.length} files...`);

        // TODO: Implement actual upload logic (API call)

        const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
            id: `temp-${Date.now()}-${index}`,
            name: file.name,
            url: URL.createObjectURL(file),
            status: "processing",
        }));

        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);

        // Simulate upload completion
        setTimeout(() => {
            setUploadStatus(`Upload simulation complete for ${files.length} files.`);
            setPhotos((currentPhotos) =>
                currentPhotos.map((p) => {
                    if (p.id.startsWith("temp-")) {
                        const randomStatus = Math.random() > 0.5 ? "categorized" : "uncategorized";
                        const randomCategory =
                            randomStatus === "categorized" && categories.length > 0
                                ? categories[Math.floor(Math.random() * categories.length)].id
                                : undefined;
                        return { ...p, status: randomStatus, categoryId: randomCategory };
                    }
                    return p;
                }),
            );
        }, 2000);
    };

    // Memoized filtered photos (logic remains the same)
    const filteredPhotos = useMemo(() => {
        return photos.filter((photo) => {
            const statusMatch =
                statusFilter === "all" ||
                (statusFilter === "processed" && photo.status === "processing") ||
                (statusFilter === "categorized" && photo.status === "categorized") ||
                (statusFilter === "uncategorized" && photo.status === "uncategorized");
            const categoryMatch = categoryFilter === "all" || photo.categoryId === categoryFilter;
            return statusMatch && categoryMatch;
        });
    }, [photos, statusFilter, categoryFilter]);

    // Filter change handlers remain the same
    const handleStatusFilterChange = (filter: StatusFilter) => setStatusFilter(filter);
    const handleCategoryFilterChange = (categoryId: string) => setCategoryFilter(categoryId);

    // Helper to get category name
    const getCategoryName = (categoryId?: string): string | undefined => {
        return categories.find((cat) => cat.id === categoryId)?.name;
    };

    // Helper to get status badge color
    const getStatusColor = (status: Photo["status"]): string => {
        switch (status) {
            case "processing":
                return "blue";
            case "categorized":
                return "green";
            case "uncategorized":
                return "orange";
            default:
                return "gray";
        }
    };

    // Function to handle info icon click
    const handleInfoClick = (photo: Photo) => {
        setSelectedPhoto(photo);
        openModal();
    };

    // Calculate counts for the summary
    const totalPhotos = photos.length;
    const categorizedCount = photos.filter(p => p.status === 'categorized').length;
    const processingCount = photos.filter(p => p.status === 'processing').length;
    const uncategorizedCount = photos.filter(p => p.status === 'uncategorized').length;

    return (
        <Container size="xl">
            {" "}
            {/* Use Mantine Container */}
            <Stack gap="lg">
                {" "}
                {/* Stack for vertical spacing */}
                <Title order={1}>All Photos</Title>
                {/* Summary Section */}
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="lg">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap={0}>
                            <Text fz={32} fw={700} c="dark.6">
                                {totalPhotos}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Total Photos
                            </Text>
                        </Stack>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap={0}>
                            <Text fz={32} fw={700} c="green.6">
                                {categorizedCount}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Categorized
                            </Text>
                        </Stack>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap={0}>
                            <Text fz={32} fw={700} c="orange.6">
                                {processingCount}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Processing
                            </Text>
                        </Stack>
                    </Card>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack align="center" gap={0}>
                            <Text fz={32} fw={700} c="red.6">
                                {uncategorizedCount}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Uncategorized
                            </Text>
                        </Stack>
                    </Card>
                </SimpleGrid>
                {/* Display upload status */}
                {uploadStatus && <Text c="dimmed">{uploadStatus}</Text>}
                {/* Filter Controls (already refactored) */}
                <FilterControls
                    categories={categories}
                    currentStatusFilter={statusFilter}
                    currentCategoryFilter={categoryFilter}
                    onStatusFilterChange={handleStatusFilterChange}
                    onCategoryFilterChange={handleCategoryFilterChange}
                />
                {/* Photo Grid */}
                <Grid gutter="md">
                    {/* Show message if filters result in no photos, but photos exist */}
                    {filteredPhotos.length === 0 && photos.length > 0 && (
                        <Grid.Col span={12}>
                            <Text>No photos match the current filters.</Text>
                        </Grid.Col>
                    )}
                    {/* Show placeholder grid if no photos are uploaded */}
                    {photos.length === 0 && !uploadStatus.includes("Processing") && (
                        <>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Grid.Col key={`placeholder-${index}`} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                                        <Card.Section>
                                            {/* Use Box for positioning context */}
                                            <Box pos="relative">
                                                <Image
                                                    src="https://via.placeholder.com/300x200/f0f0f0/cccccc?text=+" // Updated placeholder
                                                    height={160}
                                                    alt="Placeholder image"
                                                />
                                                {/* Placeholder Category Badge Overlay */}
                                                <Badge
                                                    color="dark"
                                                    variant="filled"
                                                    radius="xl"
                                                    pos="absolute"
                                                    top={8}
                                                    left={8}
                                                >
                                                    Category
                                                </Badge>
                                            </Box>
                                        </Card.Section>

                                        {/* Group for filename and info icon */}
                                        <Group justify="space-between" mt="md" mb={5}>
                                            <Text fw={500} size="sm" truncate="end">
                                                placeholder.jpg
                                            </Text>
                                            <ActionIcon variant="subtle" color="gray">
                                                <IconInfoCircle size={16} />
                                            </ActionIcon>
                                        </Group>

                                        {/* Placeholder Date */}
                                        <Text size="xs" c="dimmed">
                                            MM/DD/YYYY, HH:MM:SS AM/PM
                                        </Text>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </>
                    )}
                    {/* Render actual photos if they exist and match filters */}
                    {filteredPhotos.map((photo) => (
                        <Grid.Col key={photo.id} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                            {" "}
                            {/* Responsive columns */}
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section>
                                    <Box pos="relative">
                                        <Image
                                            src={photo.url}
                                            height={160}
                                            alt={photo.name}
                                            fallbackSrc="https://via.placeholder.com/300x200/f0f0f0/cccccc?text=+" // Consistent placeholder
                                        />
                                        {/* Actual Category Badge Overlay */}
                                        {photo.categoryId && (
                                            <Badge
                                                color="dark" // Match style from image
                                                variant="filled"
                                                radius="xl"
                                                pos="absolute"
                                                top={8}
                                                left={8}
                                            >
                                                {getCategoryName(photo.categoryId) || "Unknown"}
                                            </Badge>
                                        )}
                                    </Box>
                                </Card.Section>

                                {/* Group for filename and info icon */}
                                <Group justify="space-between" mt="md" mb={5}>
                                    <Text fw={500} size="sm" truncate="end">
                                        {photo.name}
                                    </Text>
                                    <ActionIcon variant="subtle" color="gray" onClick={() => handleInfoClick(photo)}>
                                        <IconInfoCircle size={16} />
                                    </ActionIcon>
                                </Group>

                                {/* Placeholder Date - Add actual date later */}
                                <Text size="xs" c="dimmed">
                                    {/* TODO: Replace with actual photo date */}
                                    MM/DD/YYYY, HH:MM:SS AM/PM
                                </Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Stack>
            {/* Photo Details Modal */}
            <Modal opened={modalOpened} onClose={closeModal} title="Photo Details" centered size="lg">
                {selectedPhoto && (
                    <Stack>
                        <Text size="sm" c="dimmed">
                            Information about this photo
                        </Text>
                        <Image
                            src={selectedPhoto.url}
                            height={200} // Adjust height as needed
                            fit="contain"
                            alt={selectedPhoto.name}
                            fallbackSrc="https://via.placeholder.com/300x200/f0f0f0/cccccc?text=+"
                            radius="sm"
                            style={{ backgroundColor: "#f0f0f0" }} // Background for containment
                        />
                        <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
                            <Text fw={500} size="sm">
                                Filename:
                            </Text>
                            <Text size="sm">{selectedPhoto.name}</Text>

                            <Text fw={500} size="sm">
                                Path:
                            </Text>
                            {/* TODO: Replace with actual path */}
                            <Text size="sm">
                                /
                                {selectedPhoto.categoryId
                                    ? getCategoryName(selectedPhoto.categoryId)?.toLowerCase()
                                    : "uncategorized"}
                                /{selectedPhoto.name}
                            </Text>

                            <Text fw={500} size="sm">
                                Category:
                            </Text>
                            <Text size="sm">
                                {selectedPhoto.categoryId ? getCategoryName(selectedPhoto.categoryId) : "Uncategorized"}
                            </Text>

                            <Text fw={500} size="sm">
                                Processed:
                            </Text>
                            {/* TODO: Replace with actual processed date */}
                            <Text size="sm">MM/DD/YYYY, HH:MM:SS AM/PM</Text>
                        </SimpleGrid>
                    </Stack>
                )}
            </Modal>
        </Container>
    );
};

export default AllPhotosPage;
