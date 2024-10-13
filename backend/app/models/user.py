from database.db import get_db_connection

def create_user(username, password):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "INSERT INTO users (username, password) VALUES (%s, %s)"
        cursor.execute(sql, (username, password))
    connection.commit()
    connection.close()

def check_user(username, password):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "SELECT * FROM users WHERE username=%s AND password=%s"
        cursor.execute(sql, (username, password))
        result = cursor.fetchone()
    connection.close()
    return result is not None
