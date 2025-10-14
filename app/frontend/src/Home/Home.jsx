import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Filters from '../Filters/Filters';
import SearchBar from '../SearchBar/SearchBar';
import BookList from '../BookList/BookList';
import ProfileButton from '../ProfileButton/ProfileButton.jsx';
import { UserContext } from '../userContext.jsx';
import { booksContext, filtersContext, searchExpressionContext } from '../contexts.js';

function Home() {
    const { user, isLoading } = useContext(UserContext);
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState(['all', 'all', 'all']);
    const [searchExpression, setSearchExpression] = useState('');

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (!user) {
            navigate('/');
        }
    }, [user, isLoading]);

    useEffect(() => {
        if (user) {
            const loadPage = async () => {
                try {
                    const allBooksRes = await fetch(`http://127.0.0.1:8000/api/books`);

                    if (!allBooksRes.ok) {
                        throw new Error("Error accessing backend server");
                    }

                    const data = await allBooksRes.json();
                    setBooks(data);
                } catch (err) {
                    console.log("ERROR IN LOADING BOOKS, ", err);
                }
            };
            loadPage();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className={styles.header}>
                <h1>Library Management System</h1>
                <ProfileButton />
            </div>

            <div className={styles.content}>
                <filtersContext.Provider value={[appliedFilters, setAppliedFilters]}>
                    <Filters />
                </filtersContext.Provider>

                <div className={styles.books}>
                    <booksContext.Provider value={[books, setBooks]}>
                        <searchExpressionContext.Provider value={[searchExpression, setSearchExpression]}>
                            <filtersContext.Provider value={[appliedFilters, setAppliedFilters]}>
                                <SearchBar />
                            </filtersContext.Provider>
                        </searchExpressionContext.Provider>
                        <BookList />
                    </booksContext.Provider>
                </div>
            </div>
        </>
    );
}

export default Home;