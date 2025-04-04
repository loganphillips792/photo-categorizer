import React from 'react';
import { Outlet } from 'react-router-dom';
import BurgerMenu from '../BurgerMenu/BurgerMenu'; // We'll create this next
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <BurgerMenu />
      <main className={styles.content}>
        <Outlet /> {/* Page content will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;