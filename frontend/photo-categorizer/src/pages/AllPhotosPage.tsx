import React, { useState, useMemo } from 'react';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';
import FilterControls from '../components/FilterControls/FilterControls';

// Define the possible filter types
type StatusFilter = 'all' | 'processed' | 'categorized' | 'uncategorized';

// Interface for a category (matching SettingsPage)
interface Category {
  id: string;
  name: string;
}

// Updated interface for a photo
interface Photo {
  id: string;
  name: string;
  url: string;
  status: 'uncategorized' | 'categorized' | 'processing';
  categoryId?: string; // Use categoryId
}

const AllPhotosPage: React.FC = () => {
  // State for photos
  const [photos, setPhotos] = useState<Photo[]>([]);
  // State for upload status
  const [uploadStatus, setUploadStatus] = useState<string>('');
  // State for available categories (fetch or get from shared state later)
  const [categories, setCategories] = useState<Category[]>([
    // Example categories - should match SettingsPage or come from backend
    { id: 'cat-1', name: 'Work' },
    { id: 'cat-2', name: 'Personal' },
  ]);

  // State for filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all'); // 'all' or category ID

  const handleFilesSelected = (files: FileList) => {
    console.log('Files selected in AllPhotosPage:', files);
    setUploadStatus(`Processing ${files.length} files...`);

    // TODO: Implement actual upload logic (API call)

    const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      status: 'processing',
      // categoryId: undefined, // Initially no category
    }));

    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);

    // Simulate upload completion and initial categorization (replace with backend logic)
    setTimeout(() => {
      setUploadStatus(`Upload simulation complete for ${files.length} files.`);
      setPhotos(currentPhotos => currentPhotos.map(p => {
        if (p.id.startsWith('temp-')) {
          // Simulate some getting categorized, some not
          const randomStatus = Math.random() > 0.5 ? 'categorized' : 'uncategorized';
          const randomCategory = randomStatus === 'categorized' && categories.length > 0
            ? categories[Math.floor(Math.random() * categories.length)].id
            : undefined;
          return { ...p, status: randomStatus, categoryId: randomCategory };
        }
        return p;
      }));
    }, 2000);
  };

  // Memoized filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // Status filter logic
      const statusMatch = statusFilter === 'all' ||
                          (statusFilter === 'processed' && photo.status === 'processing') ||
                          (statusFilter === 'categorized' && photo.status === 'categorized') ||
                          (statusFilter === 'uncategorized' && photo.status === 'uncategorized');

      // Category filter logic
      const categoryMatch = categoryFilter === 'all' || photo.categoryId === categoryFilter;

      return statusMatch && categoryMatch;
    });
  }, [photos, statusFilter, categoryFilter]);

  // Handlers for filter changes
  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
  };

  // Helper to get category name from ID
  const getCategoryName = (categoryId?: string): string | undefined => {
    return categories.find(cat => cat.id === categoryId)?.name;
  }

  return (
    <div>
      <h1>All Photos</h1>

      {/* PhotoUpload component removed from this page */}
      {uploadStatus && <p>{uploadStatus}</p>}

      {/* --- Filter Controls --- */}
      <FilterControls
        categories={categories}
        currentStatusFilter={statusFilter}
        currentCategoryFilter={categoryFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
      />
      {/* --- End Filter Controls --- */}


      {/* Display the list of filtered photos */}
      {/* Use CSS Grid for photo layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '20px' }}>
        {filteredPhotos.length === 0 && photos.length > 0 && (
           <p>No photos match the current filters.</p>
        )}
         {filteredPhotos.length === 0 && photos.length === 0 && !uploadStatus.includes('Processing') && (
          <p>No photos uploaded yet. Use the button above to select a directory.</p>
        )}
        {filteredPhotos.map((photo) => (
          <div key={photo.id} style={{ border: '1px solid #eee', padding: '10px', width: '150px' }}>
            <img src={photo.url} alt={photo.name} style={{ maxWidth: '100%', height: 'auto' }} />
            <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{photo.name}</p>
            <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Status: {photo.status}</p>
            {photo.categoryId && <p style={{ fontSize: '0.8rem' }}>Category: {getCategoryName(photo.categoryId) || 'Unknown'}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPhotosPage;