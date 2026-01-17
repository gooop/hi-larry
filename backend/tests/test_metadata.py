import sqlite3
from unittest import mock


def test_init_db_creates_table_with_all_columns(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db
        init_db()

    conn = sqlite3.connect(db_path)
    cursor = conn.execute("PRAGMA table_info(files)")
    columns = {row[1] for row in cursor.fetchall()}
    conn.close()
    assert columns == {"filename", "title", "author", "type"}


def test_init_db_migrates_existing_table(tmp_path):
    db_path = tmp_path / "test.db"
    conn = sqlite3.connect(db_path)
    conn.execute("CREATE TABLE files (filename TEXT PRIMARY KEY, title TEXT)")
    conn.execute("INSERT INTO files (filename, title) VALUES ('old.txt', 'Old Title')")
    conn.commit()
    conn.close()

    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db
        init_db()

    conn = sqlite3.connect(db_path)
    cursor = conn.execute("PRAGMA table_info(files)")
    columns = {row[1] for row in cursor.fetchall()}
    cursor = conn.execute("SELECT title FROM files WHERE filename = 'old.txt'")
    assert cursor.fetchone()[0] == "Old Title"
    conn.close()
    assert "author" in columns
    assert "type" in columns


def test_get_and_set_title(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db, get_title, set_title
        init_db()
        assert get_title("file.txt") is None
        set_title("file.txt", "My Title")
        assert get_title("file.txt") == "My Title"
        set_title("file.txt", "Updated")
        assert get_title("file.txt") == "Updated"


def test_get_and_set_author(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db, get_author, set_author
        init_db()
        assert get_author("file.txt") is None
        set_author("file.txt", "John Doe")
        assert get_author("file.txt") == "John Doe"


def test_get_and_set_type(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db, get_type, set_type
        init_db()
        assert get_type("file.txt") is None
        set_type("file.txt", "document")
        assert get_type("file.txt") == "document"


def test_get_metadata_returns_all_fields(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db, set_title, set_author, set_type, get_metadata
        init_db()
        assert get_metadata("file.txt") is None
        set_title("file.txt", "Title")
        set_author("file.txt", "Author")
        set_type("file.txt", "doc")
        result = get_metadata("file.txt")
        assert result == {"filename": "file.txt", "title": "Title", "author": "Author", "type": "doc"}


def test_delete_metadata_removes_entry(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db, set_title, get_title, delete_metadata
        init_db()
        set_title("file.txt", "Title")
        delete_metadata("file.txt")
        assert get_title("file.txt") is None


def test_setters_preserve_other_fields(tmp_path):
    db_path = tmp_path / "test.db"
    with mock.patch("metadata.DB_PATH", db_path):
        from metadata import init_db, set_title, set_author, set_type, get_title, get_author, get_type
        init_db()
        set_title("file.txt", "Title")
        set_author("file.txt", "Author")
        set_type("file.txt", "doc")
        assert get_title("file.txt") == "Title"
        assert get_author("file.txt") == "Author"
        assert get_type("file.txt") == "doc"