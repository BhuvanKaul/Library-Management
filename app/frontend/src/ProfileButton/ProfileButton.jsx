import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../userContext';
import styles from './ProfileButton.module.css';

function ProfileButton() {
    const { user, logout } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={styles.profileContainer}>
            <button 
                className={styles.profileButton} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src={user.picture} alt="Profile" className={styles.profilePicture} />
                <span>{user.name}</span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className={styles.dropdown}>
                    <Link to="/returns" className={styles.dropdownItem}>
                        Returns
                    </Link>
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileButton;