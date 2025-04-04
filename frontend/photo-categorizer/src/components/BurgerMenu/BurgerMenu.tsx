import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./BurgerMenu.module.css";

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className={styles.burgerIcon} onClick={toggleMenu}>
                {/* Basic burger icon representation */}
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
                <ul>
                    <li>
                        <NavLink
                            to="/all"
                            className={({ isActive }) => (isActive ? styles.activeLink : "")}
                            onClick={toggleMenu} // Close menu on link click
                        >
                            All
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => (isActive ? styles.activeLink : "")}
                            onClick={toggleMenu} // Close menu on link click
                        >
                            Settings
                        </NavLink>
                    </li>
                    {/* Add more navigation links as needed */}
                </ul>
            </nav>
            {/* Optional: Overlay to close menu when clicking outside */}
            {isOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
        </>
    );
};

export default BurgerMenu;
