
function getKartDataFromLS() {
    const storedLista = localStorage.getItem('KartData');
    return storedLista ? JSON.parse(storedLista) : {};
}

function savaKastDataToLS(lista) {
    localStorage.setItem('KartData', JSON.stringify(lista))
}

function processarPDF() {
    const pdf = document.querySelector('#inputGroupFile01').files[0];
    
    if(pdf) {
        
        const formData = new FormData();
        formData.append('file', pdf);

        fetch('http://localhost:5400/readPDF', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {

            tbody = ''
            localStorage.setItem('corrida', data['corrida']) 
            let lista = getKartDataFromLS()

            data['classificacao'].forEach(kart => {

                if (lista[kart.kart]) {
                    tbody += `<tr class="checkRow selectedRows">`
                } else {
                    tbody += `<tr class="checkRow">`
                }

                tbody += `
                        <td>${kart.pos}</td>
                        <td class="kart">${kart.kart}</td>
                        <td style="text-align: left;">${kart.nome}</td>
                        <td>${kart.mv}</td>
                        <td class="tmv">${kart.tmv}</td>
                    </tr>
                `;
            const table = document.querySelector('#rawPDF');
            table.querySelector('tbody').innerHTML = tbody;
            setupCheckRow()
            });
        })
    }
}

function getFileName() {
    const pathStr = document.querySelector('#inputGroupFile01').value;
    if (pathStr != '') {
        const path =  pathStr.split(`\\`);
        document.querySelector('#fileLabel').textContent = path[path.length - 1];
    } else {
        document.querySelector('#fileLabel').textContent = 'Escolha o arquivo';
    }
}

function setupCheckRow() {
    const rows = document.querySelectorAll('.checkRow')
    rows.forEach((item) => {
        item.addEventListener('click', (e) => {
            if (!item.classList.contains('selectedRows')) {
                e.target.parentNode.classList.add('selectedRows')
            } else {
                e.target.parentNode.classList.remove('selectedRows')
            }

           })
    })
}

function addToLS(){
    const rows = document.querySelectorAll('.selectedRows');
    let lista = getKartDataFromLS()

    rows.forEach((element) => {
        const kart = element.querySelector('.kart').textContent.trim();
        const tmv = element.querySelector('.tmv').textContent.trim();

        if (!lista[kart]) {
            lista[kart] = {
                "WARMUP": "",
                "COBRE I": "",
                "COBRE II": "",
                "BRONZE": "",
                "PRATA": "",
                "OURO": ""
            }
        }
        
        lista[kart][localStorage.getItem('corrida')] = tmv
    })

    savaKastDataToLS(lista)
    atualizarListaGeral()
}

function atualizarListaGeral(){
    var tbody = ''
    let lista = getKartDataFromLS()

    for (const key in lista) {
        tbody += `
        <tr>
            <td>${key}</td>
            <td>${lista[key]['WARMUP']}</td>
            <td>${lista[key]['COBRE I']}</td>
            <td>${lista[key]['COBRE II']}</td>
            <td>${lista[key]['BRONZE']}</td>
            <td>${lista[key]['PRATA']}</td>
            <td>${lista[key]['OURO']}</td>
        </tr>
        `
    const table = document.querySelector('#finalTable')
    table.querySelector('tbody').innerHTML = tbody
    }
}

atualizarListaGeral()