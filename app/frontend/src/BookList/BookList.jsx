import React, { useContext } from 'react';
import { booksContext } from '../contexts.js';
import { UserContext } from '../userContext.jsx';
import styles from './BookList.module.css';

function BookList() {
    const [books, setBooks] = useContext(booksContext);
    const { user } = useContext(UserContext); 

    const handleIssueBook = async (bookId) => {
        if (!user) {
            alert("Please log in to issue a book.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/issues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: bookId,
                    user_email: user.email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to issue the book.');
            }

            const result = await response.json();
            alert(`Book issued successfully!`);

            const updatedBooks = books.map(book => {
                if (book[0] === bookId) {
                    const newBookData = [...book];
                    newBookData[6] += 1;
                    return newBookData;
                }
                return book;
            });
            setBooks(updatedBooks);

        } catch (error) {
            console.error("Error issuing book:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h4>There are {books.length} matching books</h4>
            
            <table className={styles.bookTable}>
                <thead>
                    <tr>
                        <th className={styles.bookId}>Book ID</th>
                        <th className={styles.bookTitle}>Title</th>
                        <th className={styles.authorName}>Author</th>
                        <th className={styles.bookType}>Type</th>
                        <th className={styles.bookLang}>Language</th>
                        <th className={styles.action}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((bookData) => (
                        <tr key={bookData[0]} className={styles.bookRow}>
                            <td className={styles.bookId}>{bookData[0]}</td>
                            <td className={styles.bookTitle}>{bookData[1]}</td>
                            <td className={styles.authorName}>{bookData[2]}</td>
                            <td className={styles.bookType}>{bookData[3]}</td>
                            <td className={styles.bookLang}>{bookData[4]}</td>
                            <td className={styles.bookAction}>
                                <button
                                    className={styles.issueButton}
                                    disabled={bookData[5] <= bookData[6]}
                                    onClick={() => handleIssueBook(bookData[0])}
                                >
                                    Issue
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;

