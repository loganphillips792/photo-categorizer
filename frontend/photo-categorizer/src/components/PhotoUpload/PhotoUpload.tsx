import { Alert, Button, Group, LoadingOverlay, Stack, Text, rem, useMantineTheme } from "@mantine/core"; // Import LoadingOverlay, Alert
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"; // Removed FileWithPath as we handle File directly now
import { IconAlertCircle, IconPhoto, IconUpload, IconX } from "@tabler/icons-react"; // Import IconAlertCircle
import React, { useCallback, useRef, useState } from "react"; // Import useState, useCallback
// Removed duplicate React import from line below
// Removed duplicate React import line

// Removed PhotoUploadProps as the component handles uploads internally now

const PhotoUpload: React.FC = () => {
    // Removed props
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stagedFiles, setStagedFiles] = useState<File[]>([]); // State for staged files
    // Removed inputRef, handleFileChange, triggerInputClick

    // Removed complex getFilesFromEntry helper function
    // --- Function to upload files to the API ---
    const uploadFiles = useCallback(async () => {
        // No longer takes files argument
        // Use stagedFiles from state
        if (stagedFiles.length === 0) {
            console.log("No staged files to upload.");
            setError("No files selected for upload."); // Inform user
            return;
        }
        setIsLoading(true);
        setError(null);
        console.log(`Uploading ${stagedFiles.length} files...`);

        const formData = new FormData();
        stagedFiles.forEach((file) => {
            // Iterate over stagedFiles
            formData.append(`files`, file, file.name); // Use 'files' as the key
        });

        try {
            // Use relative path and include credentials
            const response = await fetch("/api/upload", {
                // Added /api prefix
                method: "POST",
                body: formData,
                credentials: "include", // Send cookies with the request
                // No need to set Content-Type for FormData, browser handles it
            });

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({ message: "Upload failed with status: " + response.status }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Upload successful:", result);
            // Optionally: Show success message
            setStagedFiles([]); // Clear staged files on success
        } catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during upload.");
        } finally {
            setIsLoading(false);
            // Clear staged files even on error? Maybe not, allow retry.
            // Consider adding a "Clear Selection" button if needed.
            // Let's clear on error too for simplicity now.
            setStagedFiles([]);
        }
    }, [stagedFiles]); // Add stagedFiles dependency

    // --- Simplified onDrop handler ---
    // Mantine's Dropzone provides a flat list of files,
    // including those from a selected directory when using webkitdirectory.
    const handleDrop = useCallback((acceptedFiles: File[]) => {
        // No longer async, just sets state
        console.log("Files accepted by Dropzone:", acceptedFiles);
        setError(null); // Clear previous errors
        setStagedFiles([]); // Clear previous selection

        if (acceptedFiles.length > 0) {
            // Filter for valid image types
            const imageFiles = acceptedFiles.filter((file) => IMAGE_MIME_TYPE.includes(file.type as any));
            if (imageFiles.length > 0) {
                console.log(`Staging ${imageFiles.length} image files.`);
                setStagedFiles(imageFiles); // Set the state with valid files
            } else {
                console.log("No valid image files found among accepted files.");
                setError("No valid image files found. Please select images or a folder containing images.");
            }
        } else {
            console.log("No files were accepted by Dropzone (likely rejected).");
            // Don't set an error here, onReject might provide a more specific one
            // setError("No files were accepted. Check file types and size limits.");
        }
    }, []); // No dependency on uploadFiles anymore
    return (
        <Stack align="center" gap="md" style={{ position: "relative" }}>
            {" "}
            {/* Added relative positioning for Overlay */}
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {error && (
                <Alert
                    icon={<IconAlertCircle size="1rem" />}
                    title="Upload Error"
                    color="red"
                    withCloseButton
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}
            <Dropzone
                onDrop={handleDrop} // Use the new handler
                onReject={(rejectedFiles) => {
                    console.log("Rejected files:", rejectedFiles);
                    setError(
                        `File rejected: ${rejectedFiles.map((f) => f.errors.map((e) => e.message).join(", ")).join("; ")}`,
                    );
                    setStagedFiles([]); // Clear stage on rejection
                }}
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
                            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }}
                            stroke={1.5}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }}
                            stroke={1.5}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto
                            style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                            stroke={1.5}
                        />
                    </Dropzone.Idle>
                    <div>
                        <Text size="xl" inline>
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>
            {/* Display staged file count */}
            {stagedFiles.length > 0 && !isLoading && (
                <Text c="dimmed" size="sm" mt="xs">
                    {stagedFiles.length} photo(s) ready for upload.
                </Text>
            )}
            {/* Buttons */}
            <Group justify="center" mt="md">
                <Button onClick={() => openRef.current?.()} disabled={isLoading}>
                    {" "}
                    {/* Removed variant="default" */}
                    Select Files/Folder
                </Button>
                <Button onClick={uploadFiles} disabled={stagedFiles.length === 0 || isLoading} loading={isLoading}>
                    Upload Photos
                </Button>
            </Group>
        </Stack>
    );
};

export default PhotoUpload;
