import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "metadata.db"


def _get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    with _get_connection() as conn:
        conn.execute("""
                     CREATE TABLE IF NOT EXISTS files
                     (
                         filename
                         TEXT
                         PRIMARY
                         KEY,
                         title
                         TEXT,
                         author
                         TEXT,
                         type
                         TEXT
                     )
                     """)
        # Migrate existing table: add missing columns
        cursor = conn.execute("PRAGMA table_info(files)")
        columns = {row[1] for row in cursor.fetchall()}
        if "author" not in columns:
            conn.execute("ALTER TABLE files ADD COLUMN author TEXT")
        if "type" not in columns:
            conn.execute("ALTER TABLE files ADD COLUMN type TEXT")


def get_title(filename):
    with _get_connection() as conn:
        cursor = conn.execute(
            "SELECT title FROM files WHERE filename = ?",
            (filename,)
        )
        row = cursor.fetchone()
        return row[0] if row else None


def set_title(filename, title):
    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO files (filename, title)
            VALUES (?, ?) ON CONFLICT(filename) DO
            UPDATE SET title = excluded.title
            """,
            (filename, title)
        )


def delete_metadata(filename):
    with _get_connection() as conn:
        conn.execute(
            "DELETE FROM files WHERE filename = ?",
            (filename,)
        )


def get_author(filename):
    with _get_connection() as conn:
        cursor = conn.execute(
            "SELECT author FROM files WHERE filename = ?",
            (filename,)
        )
        row = cursor.fetchone()
        return row[0] if row else None


def set_author(filename, author):
    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO files (filename, author)
            VALUES (?, ?) ON CONFLICT(filename) DO
            UPDATE SET author = excluded.author
            """,
            (filename, author)
        )


def get_type(filename):
    with _get_connection() as conn:
        cursor = conn.execute(
            "SELECT type FROM files WHERE filename = ?",
            (filename,)
        )
        row = cursor.fetchone()
        return row[0] if row else None


def set_type(filename, file_type):
    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO files (filename, type)
            VALUES (?, ?) ON CONFLICT(filename) DO
            UPDATE SET type = excluded.type
            """,
            (filename, file_type)
        )


def get_metadata(filename):
    with _get_connection() as conn:
        cursor = conn.execute(
            "SELECT filename, title, author, type FROM files WHERE filename = ?",
            (filename,)
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return {
            "filename": row[0],
            "title": row[1],
            "author": row[2],
            "type": row[3]
        }
