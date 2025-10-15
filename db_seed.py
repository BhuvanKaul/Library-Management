import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}

BOOKS_TO_ADD = [
    ('Concepts of Physics', 'H.C. Verma', 'Educational', 'English', 50, 25),
    ('The God of Small Things', 'Arundhati Roy', 'Novel', 'English', 15, 3),
    ('Raag Darbari', 'Shrilal Shukla', 'Novel', 'Hindi', 14, 1),
    ('Godan', 'Munshi Premchand', 'Novel', 'Hindi', 25, 8),
    ('The White Tiger', 'Aravind Adiga', 'Novel', 'English', 20, 5),
    ('Gunahon Ka Devta', 'Dharamvir Bharati', 'Novel', 'Hindi', 18, 4),
    ('A Suitable Boy', 'Vikram Seth', 'Novel', 'English', 12, 2),
    ('Arthashastra', 'Kautilya', 'Educational', 'Hindi', 10, 3),
    ("India's Struggle for Independence", 'Bipan Chandra', 'Educational', 'English', 30, 11),
    ('Bharat Ki Khoj', 'Jawaharlal Nehru', 'Educational', 'Hindi', 22, 8)
]

def seed_database():
    conn = None
    try:
        print("Connecting to the 'library' database to seed data...")
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        print("Seeding 'books' table with initial data...")
        
        insert_query = """
            INSERT INTO books (name, author, type, language, total_copies, copies_issued) 
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        cursor.executemany(insert_query, BOOKS_TO_ADD)
        
        conn.commit()
        
        print(f"Successfully added {cursor.rowcount} books to the database. ✅")

    except psycopg2.Error as e:
        print(f"A database error occurred: {e}")
        print("Please ensure the database has been migrated first by running 'python db_migrate.py'.")
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    seed_database()