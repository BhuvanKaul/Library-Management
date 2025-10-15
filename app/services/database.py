import psycopg2
from psycopg2 import pool, OperationalError

try:
    dbPool = psycopg2.pool.SimpleConnectionPool(
        1, 10,
        dbname="library",
        user="postgres",
        password="Bhuvan@2004",
        host="localhost",
        port="5432"
    )
except OperationalError as err:
    print("Could not connect to DB", err)


def getBooks(type='all', availability='all', lang='all'):
    if not dbPool:
        print("Databse Connection not available")
        return []
    
    conn = None
    try:
        conn = dbPool.getconn()
    
        query = "SELECT book_id, name, author, type, language, total_copies, copies_issued FROM books"
        conditions = []
        params = []

        if type.lower() != 'all':
            conditions.append("type = %s")
            params.append(type.capitalize())
        if availability.lower() == 'yes':
            conditions.append("total_copies > copies_issued")
        if lang.lower() != 'all':
            conditions.append("language = %s")
            params.append(lang.capitalize())
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        books = []
        with conn.cursor() as cursor:
            cursor.execute(query, tuple(params))
            books = cursor.fetchall()
        
        return books

    except:
        print("Error while fetching books")
    finally:
        if conn:
            dbPool.putconn(conn)


def addUser(name, email):
    if not dbPool:
        print("Database connection pool is not available.")
        return

    conn = None
    try:
        conn = dbPool.getconn()
        with conn.cursor() as cursor:
            sql = "INSERT INTO users (name, email) VALUES (%s, %s) ON CONFLICT (email) DO NOTHING;"
            
            cursor.execute(sql, (name, email))
            conn.commit()

    except Exception as err:
        print(f"An error occurred while adding a user: {err}")
    finally:
        if conn:
            dbPool.putconn(conn)

def issue_book(book_id, user_email):
    conn = None
    try:
        conn = dbPool.getconn()
        cursor = conn.cursor()

        cursor.execute("SELECT user_id FROM users WHERE email = %s", (user_email,))
        user_record = cursor.fetchone()

        if not user_record:
            raise ValueError("User not found in the database.")
        
        user_id = user_record[0]
        cursor.execute(
            "INSERT INTO issues (user_id, book_id) VALUES (%s, %s) ON CONFLICT (user_id, book_id) DO NOTHING",
            (user_id, book_id)
        )
        if cursor.rowcount > 0:
            cursor.execute(
                "UPDATE books SET copies_issued = copies_issued + 1 WHERE book_id = %s",
                (book_id,)
            )

        conn.commit()
        cursor.close()
        return {"message": "Issue request processed successfully."}

    except Exception as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()


def get_issued_books_for_user(user_email: str):
    conn = None
    try:
        conn = dbPool.getconn()
        cursor = conn.cursor()

        query = """
            SELECT b.book_id, b.name, b.author
            FROM books b
            JOIN issues i ON b.book_id = i.book_id
            JOIN users u ON i.user_id = u.user_id
            WHERE u.email = %s;
        """
        cursor.execute(query, (user_email,))
        issued_books = cursor.fetchall()
        
        cursor.close()
        return issued_books

    except Exception as e:
        print(f"Database error in get_issued_books_for_user: {e}")
        raise e
    finally:
        if conn:
            dbPool.putconn(conn)

def return_book(book_id, user_email):
    conn = None
    try:
        conn = dbPool.getconn()
        cursor = conn.cursor()

        cursor.execute("SELECT user_id FROM users WHERE email = %s", (user_email,))
        user_record = cursor.fetchone()
        if not user_record:
            raise ValueError("User not found.")
        user_id = user_record[0]

        delete_query = "DELETE FROM issues WHERE user_id = %s AND book_id = %s"
        cursor.execute(delete_query, (user_id, book_id))
        
        if cursor.rowcount == 0:
            raise ValueError("Issue record not found. Book may have already been returned.")

        update_query = "UPDATE books SET copies_issued = copies_issued - 1 WHERE book_id = %s"
        cursor.execute(update_query, (book_id,))
        
        conn.commit()
        cursor.close()
        return {"message": "Book returned successfully."}
        
    except Exception as e:
        print(f"Database error in return_book: {e}")
    finally:
        if conn:
            dbPool.putconn(conn)

def get_all_issued_books():
    conn = None
    try:
        conn = dbPool.getconn()
        cursor = conn.cursor()
        query = """
            SELECT u.name, u.email, b.name, b.author
            FROM issues i
            JOIN users u ON i.user_id = u.user_id
            JOIN books b ON i.book_id = b.book_id;
        """
        cursor.execute(query)
        all_issues = cursor.fetchall()
        cursor.close()
        return all_issues
    finally:
        if conn:
            dbPool.putconn(conn)

def add_book(title: str, author: str, book_type: str, language: str, total_copies: int):
    conn = None
    try:
        conn = dbPool.getconn()
        cursor = conn.cursor()
        query = """
            INSERT INTO books (name, author, type, language, total_copies, copies_issued)
            VALUES (%s, %s, %s, %s, %s, 0) RETURNING book_id;
        """
        cursor.execute(query, (title, author, book_type, language, total_copies))
        new_book_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return {"book_id": new_book_id, "message": "Book added successfully"}
    finally:
        if conn:
            dbPool.putconn(conn)

def remove_book(book_id: int):
    conn = None
    try:
        conn = dbPool.getconn()
        cursor = conn.cursor()
        query = "DELETE FROM books WHERE book_id = %s"
        cursor.execute(query, (book_id,))
        conn.commit()
        cursor.close()
        return {"message": "Book removed successfully"}
    finally:
        if conn:
            dbPool.putconn(conn)