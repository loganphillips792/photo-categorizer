import React from 'react';
import { Stack, Title, SegmentedControl, Select } from '@mantine/core';

// Define the possible filter types (remains the same)
type StatusFilter = 'all' | 'processed' | 'categorized' | 'uncategorized';

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
    { label: 'All', value: 'all' },
    { label: 'Processed', value: 'processed' },
    { label: 'Categorized', value: 'categorized' },
    { label: 'Uncategorized', value: 'uncategorized' },
  ];

  const categoryFilterData = [
    { label: 'All Categories', value: 'all' },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  return (
    <Stack gap="md"> {/* Use Stack for vertical layout */}
      <Title order={4}>Filter by Status:</Title>
      <SegmentedControl
        data={statusFilterData}
        value={currentStatusFilter}
        onChange={(value) => onStatusFilterChange(value as StatusFilter)} // Mantine passes the value directly
        fullWidth // Optional: make it take full width
      />

      <Title order={4}>Filter by Category:</Title>
      <Select
        data={categoryFilterData}
        value={currentCategoryFilter}
        onChange={(value) => onCategoryFilterChange(value || 'all')} // Mantine passes value, handle null case
        placeholder="Select category"
        allowDeselect={false} // Prevent deselecting to null if 'all' is the default
      />
    </Stack>
  );
};

export default FilterControls;