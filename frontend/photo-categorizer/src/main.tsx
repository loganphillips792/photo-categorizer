import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css"; // Import Mantine core styles
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <AuthProvider> {/* Wrap App with AuthProvider */}
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </MantineProvider>
    </StrictMode>,
);
