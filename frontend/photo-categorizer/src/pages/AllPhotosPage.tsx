import React, { useState, useMemo } from 'react';
import { Container, Title, Text, Grid, Card, Image, Badge, Stack } from '@mantine/core';
// import PhotoUpload from '../components/PhotoUpload/PhotoUpload'; // Removed - Upload likely happens elsewhere now
import FilterControls from '../components/FilterControls/FilterControls';

// Define the possible filter types
type StatusFilter = 'all' | 'processed' | 'categorized' | 'uncategorized';

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
  status: 'uncategorized' | 'categorized' | 'processing';
  categoryId?: string;
}

const AllPhotosPage: React.FC = () => {
  // State remains the same
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', name: 'Work' },
    { id: 'cat-2', name: 'Personal' },
  ]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // handleFilesSelected might be triggered from a different component now (e.g., a dedicated upload button/page)
  // Keeping the logic here for now, assuming it might be called from somewhere
  const handleFilesSelected = (files: FileList) => {
    console.log('Files selected in AllPhotosPage:', files);
    setUploadStatus(`Processing ${files.length} files...`);

    // TODO: Implement actual upload logic (API call)

    const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      status: 'processing',
    }));

    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);

    // Simulate upload completion
    setTimeout(() => {
      setUploadStatus(`Upload simulation complete for ${files.length} files.`);
      setPhotos(currentPhotos => currentPhotos.map(p => {
        if (p.id.startsWith('temp-')) {
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

  // Memoized filtered photos (logic remains the same)
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      const statusMatch = statusFilter === 'all' ||
                          (statusFilter === 'processed' && photo.status === 'processing') ||
                          (statusFilter === 'categorized' && photo.status === 'categorized') ||
                          (statusFilter === 'uncategorized' && photo.status === 'uncategorized');
      const categoryMatch = categoryFilter === 'all' || photo.categoryId === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [photos, statusFilter, categoryFilter]);

  // Filter change handlers remain the same
  const handleStatusFilterChange = (filter: StatusFilter) => setStatusFilter(filter);
  const handleCategoryFilterChange = (categoryId: string) => setCategoryFilter(categoryId);

  // Helper to get category name
  const getCategoryName = (categoryId?: string): string | undefined => {
    return categories.find(cat => cat.id === categoryId)?.name;
  }

  // Helper to get status badge color
  const getStatusColor = (status: Photo['status']): string => {
    switch (status) {
      case 'processing': return 'blue';
      case 'categorized': return 'green';
      case 'uncategorized': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Container size="xl"> {/* Use Mantine Container */}
      <Stack gap="lg"> {/* Stack for vertical spacing */}
        <Title order={1}>All Photos</Title>

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
          {filteredPhotos.length === 0 && photos.length > 0 && (
             <Grid.Col span={12}><Text>No photos match the current filters.</Text></Grid.Col>
          )}
          {filteredPhotos.length === 0 && photos.length === 0 && !uploadStatus.includes('Processing') && (
            <Grid.Col span={12}><Text>No photos uploaded yet.</Text></Grid.Col> // Simplified message
          )}
          {filteredPhotos.map((photo) => (
            <Grid.Col key={photo.id} span={{ base: 12, xs: 6, sm: 4, md: 3 }}> {/* Responsive columns */}
              <Card shadow="sm" padding="sm" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={photo.url}
                    height={160}
                    alt={photo.name}
                    fallbackSrc="https://via.placeholder.com/150" // Optional fallback
                  />
                </Card.Section>

                <Stack mt="md" mb="xs" gap="xs">
                   <Text fw={500} size="sm" truncate="end">{photo.name}</Text>
                   <Badge color={getStatusColor(photo.status)} variant="light">
                     {photo.status}
                   </Badge>
                   {photo.categoryId && (
                     <Badge color="blue" variant="outline">
                       {getCategoryName(photo.categoryId) || 'Unknown'}
                     </Badge>
                   )}
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default AllPhotosPage;