import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../userContext.jsx';
import styles from './ReturnPage.module.css';

function ReturnsPage() {
    const { user } = useContext(UserContext);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchIssuedBooks = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/issues?user_email=${user.email}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch your issued books.");
                }
                const data = await response.json();
                setIssuedBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssuedBooks();
    }, [user]);

    const handleReturnBook = async (bookId) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/issues', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ book_id: bookId, user_email: user.email }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to return book.");
            }
            
            setIssuedBooks(currentBooks => currentBooks.filter(book => book.book_id !== bookId));
            alert("Book returned successfully!");

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (isLoading) return <div className={styles.container}><h2>Loading your books...</h2></div>;
    if (error) return <div className={styles.container}><h2>Error: {error}</h2></div>;

    return (
        <div className={styles.container}>
            <Link to="/library" className={styles.backLink}>&larr; Back to Library</Link>
            <h1>Your Issued Books</h1>
            {issuedBooks.length === 0 ? (
                <p>You have not issued any books.</p>
            ) : (
                <table className={styles.booksTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issuedBooks.map(book => (
                            <tr key={book.book_id}>
                                <td>{book.name}</td>
                                <td>{book.author}</td>
                                <td>
                                    <button onClick={() => handleReturnBook(book.book_id)}>
                                        Return
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ReturnsPage;