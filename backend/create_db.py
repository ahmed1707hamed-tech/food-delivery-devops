import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_db():
    # Connect to default postgres database to create the new one
    conn = psycopg2.connect(
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432",
        database="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'food_delivery'")
    exists = cursor.fetchone()
    
    if not exists:
        cursor.execute("CREATE DATABASE food_delivery")
        print("Database created successfully")
    else:
        print("Database already exists")
        
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_db()
