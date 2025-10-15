import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}
DB_NAME = os.getenv("DB_NAME", "library")


def create_database_and_tables():
    conn = None
    try:
        print("Connecting to the default PostgreSQL database...")
        conn = psycopg2.connect(**DB_CONFIG)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        print(f"Checking for existing database '{DB_NAME}'...")
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
        if cursor.fetchone():
            print(f"Database '{DB_NAME}' exists. Dropping it to ensure a clean state.")
            cursor.execute(f"DROP DATABASE {DB_NAME}")
        
        print(f"Creating new database: '{DB_NAME}'...")
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        print("Database created successfully.")
        
        cursor.close()
        conn.close()

        print(f"Connecting to the '{DB_NAME}' database...")
        db_specific_config = DB_CONFIG.copy()
        db_specific_config["dbname"] = DB_NAME
        conn = psycopg2.connect(**db_specific_config)
        cursor = conn.cursor()

        print("Creating table: 'users'...")
        cursor.execute("""
            CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(255) NOT NULL UNIQUE
            );
        """)

        print("Creating table: 'books'...")
        cursor.execute("""
            CREATE TABLE books (
                book_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                type VARCHAR(50),
                language VARCHAR(50),
                total_copies INTEGER NOT NULL DEFAULT 1,
                copies_issued INTEGER NOT NULL DEFAULT 0
            );
        """)

        print("Creating table: 'issues'...")
        cursor.execute("""
            CREATE TABLE issues (
                issue_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                book_id INTEGER NOT NULL,
                CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                CONSTRAINT fk_book FOREIGN KEY(book_id) REFERENCES books(book_id) ON DELETE CASCADE,
                UNIQUE (user_id, book_id)
            );
        """)
        
        conn.commit()
        print("\nAll tables created successfully in the '{}' database!".format(DB_NAME))

    except psycopg2.Error as e:
        print(f"\nA database error occurred: {e}")
        print("Please ensure your PostgreSQL server is running and the credentials in your .env file are correct.")
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("Database connection closed.")


if __name__ == "__main__":
    create_database_and_tables()