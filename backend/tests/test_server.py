import io
import json
import os
from pathlib import Path


def test_upload_file(client, temp_upload_folder):
    data = {"file": (io.BytesIO(b"content"), "test.txt")}
    response = client.post("/upload", data=data, content_type="multipart/form-data")
    assert response.status_code == 200
    file_path = os.path.join(temp_upload_folder, "test.txt")
    assert os.path.exists(file_path)
    with open(file_path, "rb") as f:
        assert f.read() == b"content"


def test_upload_no_file(client):
    response = client.post("/upload", data={}, content_type="multipart/form-data")
    assert response.status_code == 400


def test_list_empty(client):
    response = client.get("/list")
    assert response.status_code == 200
    assert json.loads(response.data) == []


def test_list_with_files(client, temp_upload_folder, isolated_metadata_module):
    Path(os.path.join(temp_upload_folder, "file.txt")).write_text("content")
    isolated_metadata_module.set_title("file.txt", "Title")
    isolated_metadata_module.set_author("file.txt", "Author")
    isolated_metadata_module.set_type("file.txt", "doc")

    Path(os.path.join(temp_upload_folder, "file2.txt")).write_text("content2")

    response = client.get("/list")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 2
    assert data[1] == {"filename": "file.txt", "title": "Title", "author": "Author", "type": "doc"}
    assert data[0] == {"filename": "file2.txt", "title": None, "author": None, "type": None}


def test_download(client, temp_upload_folder):
    file_path = os.path.join(temp_upload_folder, "file.txt")
    Path(file_path).write_bytes(b"content")
    response = client.get("/download/file.txt")
    assert response.status_code == 200
    assert response.data == b"content"


def test_delete(client, temp_upload_folder, isolated_metadata_module):
    file_path = os.path.join(temp_upload_folder, "file.txt")
    Path(file_path).write_text("content")
    isolated_metadata_module.set_title("file.txt", "Title")

    response = client.delete("/delete/file.txt")
    assert response.status_code == 200
    assert not os.path.exists(file_path)
    assert isolated_metadata_module.get_title("file.txt") is None


def test_delete_not_found(client):
    response = client.delete("/delete/nonexistent.txt")
    assert response.status_code == 404


def test_metadata_update(client, temp_upload_folder, isolated_metadata_module):
    Path(os.path.join(temp_upload_folder, "file.txt")).write_text("content")
    response = client.post(
        "/metadata",
        data=json.dumps({"file.txt": {"title": "Title", "author": "Author", "type": "doc"}}),
        content_type="application/json"
    )
    assert response.status_code == 200
    assert isolated_metadata_module.get_title("file.txt") == "Title"
    assert isolated_metadata_module.get_author("file.txt") == "Author"
    assert isolated_metadata_module.get_type("file.txt") == "doc"


def test_metadata_partial_update(client, temp_upload_folder, isolated_metadata_module):
    Path(os.path.join(temp_upload_folder, "file.txt")).write_text("content")
    response = client.post(
        "/metadata",
        data=json.dumps({"file.txt": {"author": "Author"}}),
        content_type="application/json"
    )
    assert response.status_code == 200
    assert isolated_metadata_module.get_author("file.txt") == "Author"
    assert isolated_metadata_module.get_title("file.txt") is None
    assert isolated_metadata_module.get_type("file.txt") is None


def test_metadata_file_not_found(client):
    response = client.post(
        "/metadata",
        data=json.dumps({"nonexistent.txt": {"title": "Title"}}),
        content_type="application/json"
    )
    assert response.status_code == 404


def test_metadata_invalid_body(client):
    response = client.post("/metadata", data="invalid", content_type="application/json")
    assert response.status_code == 400
