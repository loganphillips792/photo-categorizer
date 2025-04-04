import React, { ChangeEvent, useRef } from 'react';
import styles from './PhotoUpload.module.css';

interface PhotoUploadProps {
  onFilesSelected: (files: FileList) => void; // Callback to handle selected files
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(`Selected ${event.target.files.length} files.`);
      onFilesSelected(event.target.files);
      // Optionally clear the input value if you want to allow re-selecting the same directory
      // event.target.value = '';
    }
  };

  const handleClick = () => {
    // Trigger the hidden file input click
    inputRef.current?.click();
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default input
        // Non-standard attributes for directory selection
        webkitdirectory=""
        mozdirectory=""
        directory=""
        multiple // Allow multiple file selection as fallback/part of directory
      />
      <button onClick={handleClick} className={styles.uploadButton}>
        Upload Screenshot Directory
      </button>
      <p className={styles.info}>
        Select the folder containing your screenshots.
      </p>
    </div>
  );
};

export default PhotoUpload;