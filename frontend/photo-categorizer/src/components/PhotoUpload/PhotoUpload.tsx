import { Group, Stack, Text, rem, Button, useMantineTheme, LoadingOverlay, Alert } from "@mantine/core"; // Import LoadingOverlay, Alert
import { IconUpload, IconPhoto, IconX, IconAlertCircle } from "@tabler/icons-react"; // Import IconAlertCircle
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"; // Removed FileWithPath as we handle File directly now
import React, { useRef, useState, useCallback } from "react"; // Import useState, useCallback
// Removed duplicate React import from line below
// Removed duplicate React import line

// Removed PhotoUploadProps as the component handles uploads internally now

const PhotoUpload: React.FC = () => { // Removed props
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Removed inputRef, handleFileChange, triggerInputClick

    // Removed complex getFilesFromEntry helper function
    // --- Function to upload files to the API ---
    const uploadFiles = useCallback(async (files: File[]) => {
        if (files.length === 0) {
            console.log("No image files found to upload.");
            return;
        }
        setIsLoading(true);
        setError(null);
        console.log(`Uploading ${files.length} files...`);

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files`, file, file.name); // Use 'files' as the key
        });

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
                // Headers might be needed depending on your backend (e.g., Authorization)
                // headers: { 'Content-Type': 'multipart/form-data' } // Usually set automatically by fetch for FormData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Upload failed with status: ' + response.status }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Upload successful:", result);
            // Optionally: Show success message or clear dropzone
        } catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during upload.");
        } finally {
            setIsLoading(false);
        }
    }, []);


    // --- Simplified onDrop handler ---
    // Mantine's Dropzone provides a flat list of files,
    // including those from a selected directory when using webkitdirectory.
    const handleDrop = useCallback(async (acceptedFiles: File[]) => {
        console.log("Files accepted by Dropzone:", acceptedFiles);
        if (acceptedFiles.length > 0) {
             // Filter again here just to be safe, although `accept` prop should handle it
            const imageFiles = acceptedFiles.filter(file => IMAGE_MIME_TYPE.includes(file.type as any));
             if (imageFiles.length > 0) {
                await uploadFiles(imageFiles);
            } else {
                console.log("No valid image files found among accepted files.");
                setError("No valid image files found. Please select images or a folder containing images.");
            }
        } else {
             console.log("No files were accepted by Dropzone.");
             // Error might be set by onReject, but we can set a generic one too
             setError("No files were accepted. Check file types and size limits.");
        }
    }, [uploadFiles]); // Removed getFilesFromEntry dependency
    return (
        <Stack align="center" gap="md" style={{ position: 'relative' }}> {/* Added relative positioning for Overlay */}
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {error && (
                <Alert icon={<IconAlertCircle size="1rem" />} title="Upload Error" color="red" withCloseButton onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
        <Dropzone
            onDrop={handleDrop} // Use the new handler
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2} // 5MB limit per file
            accept={IMAGE_MIME_TYPE} // Accept common image types
            openRef={openRef} // Assign the ref
            // Enable directory selection when clicking
            inputProps={{ webkitdirectory: "true", directory: "true" }}
        >
            <Group
                justify="center"
                gap="xl"
                mih={220}
                // Removed pointerEvents: "none" to allow drag events
            >
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>
                <div>
                    <Text size="xl" inline>
                        Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not
                        exceed 5mb
                    </Text>
                </div>
            </Group>
        </Dropzone>
            {/* Add Button below Dropzone */}
            <Button onClick={() => openRef.current?.()}>
                Or Select Files
            </Button>
        </Stack>
    );
};

export default PhotoUpload;
