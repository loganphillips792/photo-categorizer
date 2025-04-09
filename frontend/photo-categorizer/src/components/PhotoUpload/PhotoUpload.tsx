import { Group, Stack, Text, rem, Button, useMantineTheme } from "@mantine/core"; // Import Button and useMantineTheme
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import React, { useRef } from "react"; // Import useRef (Keep this one)
// Removed duplicate React import from line below
// Removed duplicate React import line

interface PhotoUploadProps {
    onFilesSelected: (files: FileWithPath[]) => void; // Updated type for Dropzone
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFilesSelected }) => {
    const theme = useMantineTheme(); // Get theme for colors
    const openRef = useRef<() => void>(null); // Ref for Dropzone's open function
    // Removed inputRef, handleFileChange, triggerInputClick

    return (
        <Stack align="center" gap="md"> {/* Wrap in Stack */}
        <Dropzone
            onDrop={(files) => {
                console.log("Dropped files:", files);
                onFilesSelected(files);
            }}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2} // 5MB limit per file
            accept={IMAGE_MIME_TYPE} // Accept common image types
            openRef={openRef} // Assign the ref
            // Removed the custom 'styles' prop to use default Mantine state handling
        >
            <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }} // Keep pointerEvents none for the group
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
        </Stack> // Close Stack
    );
};

export default PhotoUpload;
