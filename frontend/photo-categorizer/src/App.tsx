import { Route, Routes } from "react-router-dom";
import { FileWithPath } from "@mantine/dropzone"; // Import FileWithPath
import "./App.css"; // Keep or modify global styles as needed
import Layout from "./components/Layout/Layout";
import PhotoUpload from "./components/PhotoUpload/PhotoUpload"; // Import PhotoUpload
import AllPhotosPage from "./pages/AllPhotosPage";
import CategoriesPage from "./pages/CategoriesPage"; // Import the new page
import SettingsPage from "./pages/SettingsPage";

function App() {
    // Placeholder function for file selection
    const handleFilesSelected = (files: FileWithPath[]) => { // Update type to FileWithPath[]
        if (files) {
            console.log("Files selected:", files);
            // TODO: Implement actual file handling logic (e.g., upload, state update)
        }
    };

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Index route for the default page */}
                <Route index element={<PhotoUpload onFilesSelected={handleFilesSelected} />} />{" "}
                {/* Render PhotoUpload on the index route */}
                <Route path="all" element={<AllPhotosPage />} /> {/* Add route for all photos */}
                <Route path="categories" element={<CategoriesPage />} /> {/* Add route for categories */}
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
}

export default App;
