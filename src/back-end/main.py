from flask import Flask, jsonify, request
from flask_cors import CORS
import PDFReader, os

app = Flask(__name__)
CORS(app)

#upload folder
UPLOAD_FOLDER = 'upload'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/readPDF', methods=['POST'])
def readPDF():
    file = request.files['file']
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    json = PDFReader.readPDF(file_path)
    return json

if __name__ == '__main__':
    os.system('cls')
    app.run(host='0.0.0.0', port=5400)