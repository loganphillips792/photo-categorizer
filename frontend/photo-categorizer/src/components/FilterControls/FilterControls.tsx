import { SegmentedControl, Select, Stack, Title, Divider, Card } from "@mantine/core"; // Added Card
import React from "react";

// Define the possible filter types (remains the same)
type StatusFilter = "all" | "processed" | "categorized" | "uncategorized";

interface FilterControlsProps {
    categories: { id: string; name: string }[];
    currentStatusFilter: StatusFilter;
    currentCategoryFilter: string; // ID of the selected category, or 'all'
    onStatusFilterChange: (filter: StatusFilter) => void;
    onCategoryFilterChange: (categoryId: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
    categories,
    currentStatusFilter,
    currentCategoryFilter,
    onStatusFilterChange,
    onCategoryFilterChange,
}) => {
    // Prepare data for Mantine components
    const statusFilterData = [
        { label: "All", value: "all" },
        { label: "Processed", value: "processed" },
        { label: "Categorized", value: "categorized" },
        { label: "Uncategorized", value: "uncategorized" },
    ];

    const categoryFilterData = [
        { label: "All Categories", value: "all" },
        ...categories.map((category) => ({
            label: category.name,
            value: category.id,
        })),
    ];

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder> {/* Added Card wrapper */}
            <Stack gap="md">
            <Title order={3}>Filters</Title> {/* Added main title */}
            <Divider my="sm" /> {/* Added separator */}
            {/* Removed Filter by Status title */}
            <SegmentedControl
                data={statusFilterData}
                value={currentStatusFilter}
                onChange={(value) => onStatusFilterChange(value as StatusFilter)} // Mantine passes the value directly
                fullWidth // Optional: make it take full width
            />
            {/* Removed Filter by Category title */}
            <Select
                data={categoryFilterData}
                value={currentCategoryFilter}
                onChange={(value) => onCategoryFilterChange(value || "all")} // Mantine passes value, handle null case
                placeholder="Select category"
                allowDeselect={false} // Prevent deselecting to null if 'all' is the default
            />
            </Stack>
        </Card>
    );
};

export default FilterControls;
