import React, { useEffect } from 'react'
import { useContext } from 'react'
import { booksContext } from '../contexts'
import styles from './BookList.module.css'

function BookList() {
    const [books, setBooks] = useContext(booksContext);

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
                    {books.map((bookData, index) => (
                        <tr key={index} className={styles.bookRow}>
                            <td className={styles.bookId}>{bookData[0]}</td>
                            <td className={styles.bookTitle}>{bookData[1]}</td>
                            <td className={styles.authorName}>{bookData[2]}</td>
                            <td className={styles.bookType}>{bookData[3]}</td>
                            <td className={styles.bookLang}>{bookData[4]}</td>
                            <td className={styles.bookAction}>
                                <button className={styles.issueButton} disabled={bookData[5] <= bookData[6]}>
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