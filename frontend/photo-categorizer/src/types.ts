// Type definitions based on the user-provided example structure

export interface Category {
    id: string;
    name: string;
    description?: string;
    color?: string;
}

// Define the possible photo statuses based on the example
export type PhotoStatus = "categorized" | "processing" | "pending" | "uncategorized";

export interface Photo {
    id: string;
    name: string;
    src: string; // Use 'src' as in the example
    status: PhotoStatus;
    category?: Category; // Store the full category object
    timestamp?: string;
    confidenceScore?: number;
}