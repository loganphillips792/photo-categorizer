import React from 'react';
import styles from './FilterControls.module.css';

// Define the possible filter types
type StatusFilter = 'all' | 'processed' | 'categorized' | 'uncategorized';

interface FilterControlsProps {
  categories: { id: string; name: string }[]; // Pass available categories for filtering
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
  return (
    <div className={styles.filterContainer}>
      <h4>Filter by Status:</h4>
      <div className={styles.filterGroup}>
        {(['all', 'processed', 'categorized', 'uncategorized'] as StatusFilter[]).map((status) => (
          <button
            key={status}
            className={`${styles.filterButton} ${currentStatusFilter === status ? styles.active : ''}`}
            onClick={() => onStatusFilterChange(status)}
          >
            {/* Capitalize first letter */}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <h4>Filter by Category:</h4>
      {/* Replace buttons with a dropdown */}
      <div className={styles.filterGroup}>
        <select
          className={styles.filterSelect} // Add a class for styling if needed
          value={currentCategoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;