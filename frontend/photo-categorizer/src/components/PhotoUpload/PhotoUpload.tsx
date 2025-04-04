import React, { ChangeEvent, useRef } from 'react';
import { FileButton, Button, Text, Stack } from '@mantine/core';

interface PhotoUploadProps {
  onFilesSelected: (files: FileList) => void; // Callback remains the same
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the original file change handler
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(`Selected ${event.target.files.length} files from directory.`);
      onFilesSelected(event.target.files);
      // Clear the value to allow selecting the same directory again if needed
      // event.target.value = '';
    }
  };

  // Click handler for the hidden input (still needed)
  const triggerInputClick = () => {
    inputRef.current?.click();
  };

  return (
    <Stack align="center" gap="md"> {/* Use Stack for layout */}
      {/* Hidden input remains largely the same */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        // Directory selection attributes
        webkitdirectory=""
        mozdirectory=""
        directory=""
        multiple // Keep multiple for fallback/consistency
      />

      {/* Use Mantine Button to trigger the hidden input */}
      <Button onClick={triggerInputClick}>
        Upload Screenshot Directory
      </Button>

      <Text size="sm" c="dimmed"> {/* Use Mantine Text */}
        Select the folder containing your screenshots.
      </Text>
    </Stack>
  );
};

export default PhotoUpload;