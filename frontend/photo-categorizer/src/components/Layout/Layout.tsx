import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AppShell, Burger, Group, NavLink, ScrollArea, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// Removed BurgerMenu import

const Layout: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate(); // Initialize useNavigate

  // Placeholder navigation links
  const navLinks = [
    { label: 'Upload Files', path: '/' }, // Added Upload Files link
    { label: 'All Photos', path: '/all' }, // Correct path for AllPhotosPage
    { label: 'Settings', path: '/settings' },
    // Add more links as needed
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* Use UnstyledButton for clickable title/logo */}
          <UnstyledButton onClick={() => navigate('/')}>
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
                  if (opened) toggle(); // Close navbar on mobile after click (if it was open)
                }}
              />
            ))}
         </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet /> {/* Page content will be rendered here */}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;