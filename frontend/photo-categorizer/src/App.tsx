import { Route, Routes } from "react-router-dom";
// Removed unused FileWithPath import
import "./App.css"; // Keep or modify global styles as needed
import Layout from "./components/Layout/Layout";
import PhotoUpload from "./components/PhotoUpload/PhotoUpload"; // Import PhotoUpload
import AllPhotosPage from "./pages/AllPhotosPage";
import CategoriesPage from "./pages/CategoriesPage"; // Import the new page
import SettingsPage from "./pages/SettingsPage";

function App() {
    // Removed handleFilesSelected function as PhotoUpload now handles uploads internally
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Index route for the default page */}
                <Route index element={<PhotoUpload />} /> {/* Removed onFilesSelected prop */}
                {/* Render PhotoUpload on the index route */}
                <Route path="all" element={<AllPhotosPage />} /> {/* Add route for all photos */}
                <Route path="categories" element={<CategoriesPage />} /> {/* Add route for categories */}
                <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
}

export default App;
