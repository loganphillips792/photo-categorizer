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
import React, { useMemo, useState } from "react"; // Added useEffect
// import PhotoUpload from '../components/PhotoUpload/PhotoUpload'; // Removed - Upload likely happens elsewhere now
import FilterControls from "../components/FilterControls/FilterControls";
import mockData from "../lib/mock-data.json"; // Import mock data
import { Category, Photo, PhotoStatus } from "../types"; // Import types

// Type definitions are now imported from ../types.ts
// StatusFilter type alias is replaced by PhotoStatus | 'all' where needed

const AllPhotosPage: React.FC = () => {
    // Initialize state with imported mock data, casting to assert types
    const [photos, setPhotos] = useState<Photo[]>(mockData.photos as Photo[]);
    const [categories, setCategories] = useState<Category[]>(mockData.categories as Category[]);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    // Use PhotoStatus for filter state, plus 'all'
    const [statusFilter, setStatusFilter] = useState<PhotoStatus | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all"); // Keep as string for category ID or 'all'
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null); // Uses imported Photo type

    // handleFilesSelected might be triggered from a different component now (e.g., a dedicated upload button/page)
    // Keeping the logic here for now, assuming it might be called from somewhere
    const handleFilesSelected = (files: FileList) => {
        console.log("Files selected in AllPhotosPage:", files);
        setUploadStatus(`Processing ${files.length} files...`);

        // TODO: Implement actual upload logic (API call)

        // Create new photos matching the updated Photo interface
        const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
            id: `temp-${Date.now()}-${index}`, // Temporary ID
            name: file.name,
            src: URL.createObjectURL(file), // Use 'src'
            status: "processing", // Initial status
            // Other fields like category, timestamp will be added later
        }));

        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);

        // Simulate upload completion
        setTimeout(() => {
            setUploadStatus(`Upload simulation complete for ${files.length} files.`);
            setPhotos((currentPhotos) =>
                currentPhotos.map((p) => {
                    if (p.id.startsWith("temp-")) {
                        // Simulate processing result based on new structure
                        const randomStatus: PhotoStatus = Math.random() > 0.5 ? "categorized" : "uncategorized";
                        const randomCategory =
                            randomStatus === "categorized" && categories.length > 0
                                ? categories[Math.floor(Math.random() * categories.length)] // Assign full category object
                                : undefined;
                        // Update status and category, keep other fields
                        return { ...p, status: randomStatus, category: randomCategory };
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
                // Adjust status checks for PhotoStatus type
                // Map the 'processed' filter value to the 'processing' status
                (statusFilter === "processed" && photo.status === "processing") ||
                (statusFilter === "categorized" && photo.status === "categorized") ||
                (statusFilter === "uncategorized" && photo.status === "uncategorized") ||
                (statusFilter === "pending" && photo.status === "pending");
            // Filter by category ID within the category object
            const categoryMatch = categoryFilter === "all" || photo.category?.id === categoryFilter;
            return statusMatch && categoryMatch;
        });
    }, [photos, statusFilter, categoryFilter]);

    // Filter change handlers remain the same
    // Update filter handler types
    const handleStatusFilterChange = (filter: PhotoStatus | "all") => setStatusFilter(filter);
    const handleCategoryFilterChange = (categoryId: string) => setCategoryFilter(categoryId);

    // Remove getCategoryName helper, use photo.category.name directly

    // Helper to get status badge color
    // Update getStatusColor to use PhotoStatus
    const getStatusColor = (status: PhotoStatus): string => {
        switch (status) {
            case "processing":
                return "blue";
            case "categorized":
                return "green";
            case "uncategorized":
                return "orange";
            case "pending":
                return "yellow"; // Add color for pending
            default:
                return "gray";
        }
    };

    // Function to handle info icon click
    const handleInfoClick = (photo: Photo) => {
        console.log("Info icon clicked for photo:", photo.id); // Added console log
        setSelectedPhoto(photo);
        openModal();
    };

    // Calculate counts for the summary
    const totalPhotos = photos.length;
    // Update counts based on PhotoStatus
    const categorizedCount = photos.filter((p) => p.status === "categorized").length;
    const processingCount = photos.filter((p) => p.status === "processing").length;
    const uncategorizedCount = photos.filter((p) => p.status === "uncategorized").length;
    const pendingCount = photos.filter((p) => p.status === "pending").length; // Add pending count if needed for summary

    // Remove old mock photo generation logic, state is initialized from JSON

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
                    currentStatusFilter={statusFilter} // Pass the updated status filter state
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
                    {/* Remove the separate mock photo grid rendering logic */}
                    {/* The main grid now renders photos from state, initialized with mock data */}
                    {/* Render actual photos if they exist and match filters */}
                    {filteredPhotos.map((photo) => (
                        <Grid.Col key={photo.id} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                            {" "}
                            {/* Responsive columns */}
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section>
                                    <Box pos="relative">
                                        <Image
                                            src={photo.src} // Use src field
                                            height={160}
                                            alt={photo.name}
                                            // fallbackSrc="https://via.placeholder.com/300x200/f0f0f0/cccccc?text=+" // Consistent placeholder
                                            fallbackSrc="https://images.pexels.com/photos/130576/pexels-photo-130576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                        />
                                        {/* Actual Category Badge Overlay */}
                                        {/* Use category object for badge */}
                                        {photo.category && (
                                            <Badge
                                                color={photo.category.color || "dark"} // Use category color or default
                                                variant="filled"
                                                radius="xl"
                                                pos="absolute"
                                                top={8}
                                                left={8}
                                            >
                                                {photo.category.name || "Unknown"}
                                            </Badge>
                                        )}
                                        {/* Optionally, add a badge for uncategorized/pending/processing */}
                                        {!photo.category && (
                                            <Badge
                                                color={getStatusColor(photo.status)}
                                                variant="light"
                                                radius="xl"
                                                pos="absolute"
                                                top={8}
                                                left={8}
                                            >
                                                {photo.status.charAt(0).toUpperCase() + photo.status.slice(1)}{" "}
                                                {/* Capitalize status */}
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
                                    {/* Display timestamp if available */}
                                    {photo.timestamp ? new Date(photo.timestamp).toLocaleString() : "No date"}
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
                            src={selectedPhoto.src} // Use src field
                            height={200} // Adjust height as needed
                            fit="contain"
                            alt={selectedPhoto.name}
                            // fallbackSrc="https://via.placeholder.com/300x200/f0f0f0/cccccc?text=+"
                            fallbackSrc="https://images.pexels.com/photos/130576/pexels-photo-130576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
                                /{/* Update path display logic */}
                                {selectedPhoto.category
                                    ? selectedPhoto.category.name.toLowerCase()
                                    : selectedPhoto.status}
                                /{selectedPhoto.name}
                            </Text>

                            <Text fw={500} size="sm">
                                Category:
                            </Text>
                            <Text size="sm">
                                {selectedPhoto.category
                                    ? selectedPhoto.category.name
                                    : selectedPhoto.status.charAt(0).toUpperCase() + selectedPhoto.status.slice(1)}
                            </Text>

                            <Text fw={500} size="sm">
                                Processed:
                            </Text>
                            {/* Display timestamp */}
                            <Text size="sm">
                                {selectedPhoto.timestamp ? new Date(selectedPhoto.timestamp).toLocaleString() : "N/A"}
                            </Text>
                        </SimpleGrid>
                    </Stack>
                )}
            </Modal>
        </Container>
    );
};

export default AllPhotosPage;
