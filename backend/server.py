from flask import Flask, request, send_file, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from metadata import init_db, get_title, set_title, delete_metadata

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
UPLOAD_FOLDER = os.path.join('..', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
init_db()


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return 'No file', 400
    file = request.files['file']
    if file.filename == '':
        return 'No file', 400
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return 'Success', 200


@app.route('/list')
def list_files():
    files = os.listdir(UPLOAD_FOLDER)
    file_info = []

    for file in files:
        title = get_title(file)
        if title:
            file_info.append({file: [title]})
        else:
            file_info.append({file: []})

    return jsonify(file_info)


@app.route('/download/<filename>')
def download(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)


@app.route('/delete/<filename>', methods=['DELETE'])
def delete(filename):
    try:
        os.remove(os.path.join(UPLOAD_FOLDER, filename))
        delete_metadata(filename)
    except FileNotFoundError:
        return 'File not found', 404
    except Exception:
        return 'Unknown error', 500
    return 'Success', 200


@app.route('/metadata', methods=['POST'])
def update_metadata():
    file_titles = request.get_json()
    if not file_titles or not isinstance(file_titles, dict):
        return 'Invalid request body', 400
    for filename, title in file_titles.items():
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            return 'File not found', 404
        set_title(filename, title)
    return 'Success', 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
