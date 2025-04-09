import { Route, Routes } from "react-router-dom";
// Removed unused FileWithPath import
import "./App.css"; // Keep or modify global styles as needed
import Layout from "./components/Layout/Layout";
import PhotoUpload from "./components/PhotoUpload/PhotoUpload"; // Import PhotoUpload
import AllPhotosPage from "./pages/AllPhotosPage";
import CategoriesPage from "./pages/CategoriesPage"; // Import the new page
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage"; // Import the new login page

function App() {
    // Removed handleFilesSelected function as PhotoUpload now handles uploads internally
    return (
        <Routes>
             {/* Routes with the main layout (sidebar, header) */}
            <Route path="/" element={<Layout />}>
                <Route index element={<PhotoUpload />} />
                <Route path="all" element={<AllPhotosPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="settings" element={<SettingsPage />} />
                {/* Add other pages that need the layout here */}
            </Route>

            {/* Standalone Login Route (no layout) */}
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
