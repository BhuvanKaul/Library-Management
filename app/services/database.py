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
    if not pool:
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
