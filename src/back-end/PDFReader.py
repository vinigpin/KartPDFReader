import pdfplumber

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
