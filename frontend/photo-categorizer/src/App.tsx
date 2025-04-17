import { Route, Routes } from "react-router-dom";
import "./App.css"; // Keep or modify global styles as needed
import Layout from "./components/Layout/Layout";
import PhotoUpload from "./components/PhotoUpload/PhotoUpload";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; // Import ProtectedRoute
import AllPhotosPage from "./pages/AllPhotosPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <Routes>
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}> {/* Parent route for protected content */}
                {/* Routes using Layout */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<PhotoUpload />} /> {/* Default page */}
                    <Route path="all" element={<AllPhotosPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    {/* Add other pages that need the layout and protection here */}
                </Route>
                {/* Add other protected routes that DON'T use the Layout here */}
            </Route>

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            {/* Add other public routes here */}
        </Routes>
    );
}

export default App;
