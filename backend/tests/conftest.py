import sys
import tempfile
import pytest
from unittest import mock


@pytest.fixture
def temp_upload_folder():
    with tempfile.TemporaryDirectory() as tmpdir:
        yield tmpdir


@pytest.fixture
def isolated_metadata_module(tmp_path):
    db_path = tmp_path / "test.db"
    if "metadata" in sys.modules:
        del sys.modules["metadata"]

    import metadata
    original_db_path = metadata.DB_PATH
    metadata.DB_PATH = db_path
    metadata.init_db()
    yield metadata
    metadata.DB_PATH = original_db_path


@pytest.fixture
def app(temp_upload_folder, isolated_metadata_module):
    if "server" in sys.modules:
        del sys.modules["server"]

    with mock.patch.dict(sys.modules, {"metadata": isolated_metadata_module}):
        import server
        original_upload_folder = server.UPLOAD_FOLDER
        server.UPLOAD_FOLDER = temp_upload_folder
        server.app.config["TESTING"] = True
        yield server.app
        server.UPLOAD_FOLDER = original_upload_folder


@pytest.fixture
def client(app):
    return app.test_client()
