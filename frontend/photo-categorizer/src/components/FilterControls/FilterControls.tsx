import { Card, Divider, SegmentedControl, Select, Stack, Title } from "@mantine/core";
import React from "react";
import { Category, PhotoStatus } from "../../types"; // Import new types

// Remove old StatusFilter type definition

interface FilterControlsProps {
    categories: Category[]; // Use imported Category type
    currentStatusFilter: PhotoStatus | "all"; // Use imported PhotoStatus + 'all'
    currentCategoryFilter: string;
    onStatusFilterChange: (filter: PhotoStatus | "all") => void; // Use imported PhotoStatus + 'all'
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
        // Update values to match PhotoStatus
        { label: "All", value: "all" },
        { label: "Categorized", value: "categorized" },
        { label: "Processing", value: "processing" }, // Changed value
        { label: "Pending", value: "pending" }, // Added pending
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
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            {" "}
            {/* Added Card wrapper */}
            <Stack gap="md">
                <Title order={3}>Filters</Title> {/* Added main title */}
                <Divider my="sm" /> {/* Added separator */}
                {/* Removed Filter by Status title */}
                <SegmentedControl
                    data={statusFilterData}
                    value={currentStatusFilter}
                    onChange={(value) => onStatusFilterChange(value as PhotoStatus | "all")} // Cast to the correct type
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
