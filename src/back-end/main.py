from flask import Flask, jsonify, request
from flask_cors import CORS
import pdfplumber, os

app = Flask(__name__)
CORS(app)

def readPDF(path):
    with pdfplumber.open(path) as pdf:

        page = pdf.pages[0]
        text = page.extract_text()
        row = text.split('\n')

        json = {
            "corrida":"",
            "classificacao":[

            ]
        }

        pageCont = 0
        for i in row:
            pageCont += 1
            if pageCont == 2:
                json['corrida'] = ' '.join(i.split(' ')[2:-1])
            try:
                int(i.split(' ')[0])
            except:
                pass
            else:
                cedula = i.split(' ')

                pos = cedula[0]
                kart = cedula[1]
                nome = cedula[2] 
                mv = 0
                tmv = ''

                cont = 2
                readingName = True
                while readingName:
                    cont += 1
                    try:
                        int(cedula[cont])
                    except:
                        nome += ' ' + cedula[cont]
                    else:
                        readingName = False

                mv = int(cedula[cont])
                tmv = cedula[cont+1]

                nomeFormatado = ''
                try:
                    int(nome.split(' ')[0])
                except:
                    pass
                else:
                    novoNome = ''
                    for i in nome.split(' '):
                        if i != nome.split(' ')[0] and len(i) != 1:
                            if novoNome == '':
                                novoNome += i
                            else:
                                novoNome += ' ' + i
                    nome = novoNome

                if nome.split(' ')[0] != nome.split(' ')[-1]:
                        nomeFormatado = nome.split(' ')[0] + ' ' + nome.split(' ')[-1]
                else:
                    nomeFormatado = nome.split(' ')[0]
                json['classificacao'].append({"pos":pos, "kart":kart, "nome":nomeFormatado, "mv":mv, "tmv":tmv})
    return json


#upload folder
UPLOAD_FOLDER = 'upload'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/readPDF', methods=['POST'])
def readPDF():
    file = request.files['file']
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    json = readPDF(file_path)
    return json

if __name__ == '__main__':
    os.system('cls')
    app.run(host='0.0.0.0', port=5400)