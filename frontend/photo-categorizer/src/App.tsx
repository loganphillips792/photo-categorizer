import { Route, Routes } from "react-router-dom";
import "./App.css"; // Keep or modify global styles as needed
import Layout from "./components/Layout/Layout";
import PhotoUpload from "./components/PhotoUpload/PhotoUpload"; // Import PhotoUpload
import AllPhotosPage from "./pages/AllPhotosPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
    // Placeholder function for file selection
    const handleFilesSelected = (files: FileList | null) => {
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
                <Route path="settings" element={<SettingsPage />} />
                {/* Add other routes here as needed */}
            </Route>
        </Routes>
    );
}

export default App;
