import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../userContext.jsx';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
    const { user } = useContext(UserContext);

    // State for data displayed on the dashboard
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [error, setError] = useState(null);

    // State for the "Add Book" form
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [totalCopies, setTotalCopies] = useState(1);

    // Fetch all necessary data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all books for the "Manage Books" section
                const allBooksRes = await fetch('http://127.0.0.1:8000/api/books');
                const allBooksData = await allBooksRes.json();
                setAllBooks(allBooksData);

                // Fetch all issued books for the report section
                const issuedBooksRes = await fetch('http://127.0.0.1:8000/api/admin/issued-books');
                const issuedBooksData = await issuedBooksRes.json();
                setIssuedBooks(issuedBooksData);

            } catch (err) {
                setError("Failed to fetch data from the server.");
                console.error(err);
            }
        };

        if (user && user.isAdmin) {
            fetchData();
        }
    }, [user]);

    // --- Handler Functions ---

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!title || !author) {
            alert("Please fill in both title and author.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, total_copies: parseInt(totalCopies) }),
            });

            if (!response.ok) throw new Error("Failed to add book.");

            alert("Book added successfully!");
            setTitle('');
            setAuthor('');
            setTotalCopies(1);
            // Refresh the list of all books
            const allBooksRes = await fetch('http://127.0.0.1:8000/api/books');
            setAllBooks(await allBooksRes.json());

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleRemoveBook = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/books/${bookId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Failed to remove book.");
            
            alert("Book removed successfully!");
            // Update the UI instantly by filtering out the removed book
            setAllBooks(currentBooks => currentBooks.filter(book => book[0] !== bookId));

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/issued-books/download');
            if (!response.ok) throw new Error("Failed to download report.");
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'issued_books_report.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (!user || !user.isAdmin) {
        return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Access Denied</h2>;
    }

    if (error) {
        return <h2 style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</h2>;
    }

    return (
        <div className={styles.container}>
            <h1>Admin Dashboard</h1>
            
            <div className={styles.section}>
                <h2>Add a New Book</h2>
                <form onSubmit={handleAddBook} className={styles.addForm}>
                    <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <input type="text" placeholder="Author Name" value={author} onChange={e => setAuthor(e.target.value)} required />
                    <input type="number" placeholder="Total Copies" value={totalCopies} onChange={e => setTotalCopies(e.target.value)} min="1" required />
                    <button type="submit">Add Book</button>
                </form>
            </div>

            <div className={styles.section}>
                <h2>All Issued Books</h2>
                <button onClick={handleDownloadReport} className={styles.downloadButton}>Download as Excel</button>
                <table className={styles.booksTable}>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Book Title</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issuedBooks.length > 0 ? issuedBooks.map((issue, index) => (
                            <tr key={index}>
                                <td>{issue.user_name}</td>
                                <td>{issue.user_email}</td>
                                <td>{issue.book_title}</td>
                                <td>{issue.book_author}</td>
                            </tr>
                        )) : <tr><td colSpan="4">No books are currently issued.</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className={styles.section}>
                <h2>Manage All Books</h2>
                <table className={styles.booksTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBooks.map((book) => (
                            <tr key={book[0]}>
                                <td>{book[0]}</td>
                                <td>{book[1]}</td>
                                <td>{book[2]}</td>
                                <td>
                                    <button onClick={() => handleRemoveBook(book[0])} className={styles.removeButton}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
