from flask import Flask, Response, request, send_file, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import xattr

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
        file_path = os.path.join(UPLOAD_FOLDER, file)
        xattrs = []
        try:
            title = xattr.getxattr(file_path, 'hi.larry.title')
            xattrs.append(title.decode(encoding='utf8'))
        except Exception as e:
            print(f"Failed to get title for {file}, exception: {e}")

        file_info.append({file: xattrs})

    return jsonify(file_info)

@app.route('/download/<filename>')
def download(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)

@app.route('/delete/<filename>', methods=['DELETE'])
def delete(filename):
    try:
        os.remove(os.path.join(UPLOAD_FOLDER, filename))
    except FileNotFoundError as e:
        return 'File not found', 404
    except Exception as e:
        return 'Unknown error', 500
    return 'Success', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
