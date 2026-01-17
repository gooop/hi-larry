"""Minimal SQLite metadata module for storing file metadata."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "metadata.db"


def _get_connection() -> sqlite3.Connection:
    """Get a connection to the database."""
    return sqlite3.connect(DB_PATH)


def init_db() -> None:
    """Create the files table if it doesn't exist."""
    with _get_connection() as conn:
        conn.execute("""
                     CREATE TABLE IF NOT EXISTS files
                     (
                         filename
                         TEXT
                         PRIMARY
                         KEY,
                         title
                         TEXT
                     )
                     """)


def get_title(filename: str) -> str | None:
    """Return the title for a file, or None if not found."""
    with _get_connection() as conn:
        cursor = conn.execute(
            "SELECT title FROM files WHERE filename = ?",
            (filename,)
        )
        row = cursor.fetchone()
        return row[0] if row else None


def set_title(filename: str, title: str) -> None:
    """Upsert the title for a file."""
    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO files (filename, title)
            VALUES (?, ?) ON CONFLICT(filename) DO
            UPDATE SET title = excluded.title
            """,
            (filename, title)
        )


def delete_metadata(filename: str) -> None:
    """Remove the metadata entry for a file."""
    with _get_connection() as conn:
        conn.execute(
            "DELETE FROM files WHERE filename = ?",
            (filename,)
        )
