import { AppShell, Burger, Group, NavLink, ScrollArea, UnstyledButton, ActionIcon, Box } from "@mantine/core"; // Added ActionIcon, Box
import { useDisclosure } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"; // Added icons
import React from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
// Removed BurgerMenu import

const Layout: React.FC = () => {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(); // Renamed for clarity
    const [desktopCollapsed, { toggle: toggleDesktop }] = useDisclosure(false); // State for desktop collapse
    const navigate = useNavigate();

    // Placeholder navigation links
    const navLinks = [
        { label: "Upload Files", path: "/" }, // Added Upload Files link
        { label: "All Photos", path: "/all" }, // Correct path for AllPhotosPage
        { label: "Categories", path: "/categories" }, // Added Categories link
        { label: "Settings", path: "/settings" },
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !mobileOpened, desktop: desktopCollapsed } }} // Use both states
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    {/* Use UnstyledButton for clickable title/logo */}
                    <UnstyledButton onClick={() => navigate("/")}>
                        <div>Photo Categorizer</div>
                    </UnstyledButton>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <AppShell.Section grow component={ScrollArea}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            // href={link.path} // Remove href to prevent default link behavior
                            label={link.label}
                            // Add active state logic if needed, e.g., based on location.pathname
                            // Example: active={location.pathname === link.path}
                            onClick={() => {
                                navigate(link.path); // Use navigate for client-side routing
                                if (mobileOpened) toggleMobile(); // Close navbar on mobile after click
                            }}
                        />
                    ))}
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                {/* Add collapse toggle button for desktop */}
                <ActionIcon
                    onClick={toggleDesktop}
                    variant="default" // Gives border
                    size="lg"
                    radius="xl" // Make it round
                    aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    visibleFrom="sm" // Only show on sm+ screens
                    style={{
                        position: 'absolute',
                        top: 'calc(var(--app-shell-header-height, 0px) + 20px)', // Position below header
                        left: desktopCollapsed ? '10px' : 'calc(300px - 18px)', // Adjust left based on state
                        zIndex: 101, // Ensure it's above navbar
                        transition: 'left 0.2s ease', // Smooth transition
                        backgroundColor: 'var(--mantine-color-body)', // Match background
                    }}
                >
                    {desktopCollapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
                </ActionIcon>
                <Outlet /> {/* Page content will be rendered here */}
            </AppShell.Main>
        </AppShell>
    );
};

export default Layout;
