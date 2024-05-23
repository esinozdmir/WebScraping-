from flask import Flask, request
from PyPDF2 import PdfReader
import requests
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/extract-text', methods=['POST'])
def extracttext():
    pdfurl = request.json['url']
    response = requests.get(pdfurl)
    pdf_file = BytesIO(response.content)

    reader = PdfReader(pdf_file)
    text = ''
    for page in reader.pages:
        text += page.extract_text() + '\n'

    return text

if __name__ == '__main__':
    app.run(debug=True)