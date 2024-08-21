
function getKartDataFromLS() {
    const storedLista = localStorage.getItem('KartData');
    try {
        return storedLista ? JSON.parse(storedLista) : {};
    } catch {
        return {}
    }
}

function savaKastDataToLS(lista) {
    localStorage.setItem('KartData', JSON.stringify(lista))
}

function processarPDF() {
    const pdf = document.querySelector('#inputGroupFile01').files[0];
    
    if(pdf) {
        
        const formData = new FormData();
        formData.append('file', pdf);

        fetch('http://192.168.202.176:5400/readPDF', {
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
        <tr id="${key}">
            <td class="kartKey">${key}</td>
            <td class="WARMUP">${lista[key]['WARMUP']}</td>
            <td class="COBRE-I">${lista[key]['COBRE I']}</td>
            <td class="COBRE-II">${lista[key]['COBRE II']}</td>
            <td class="BRONZE">${lista[key]['BRONZE']}</td>
            <td class="PRATA">${lista[key]['PRATA']}</td>
            <td class="OURO">${lista[key]['OURO']}</td>
        </tr>
        `
    const table = document.querySelector('#finalTable')
    table.querySelector('tbody').innerHTML = tbody
    }
}
atualizarListaGeral()

function limpar(){
    const rows = document.querySelectorAll('.selectedRows');
    rows.forEach((element) => {
        element.classList.remove('selectedRows')
    })
}

function editar() {
    document.querySelector('#finalTable').classList.add('editable');
    setupEditar()
}

function baixarExcel() {
    const tabela = document.getElementById('finalTable');
    const wb = XLSX.utils.table_to_book(tabela);
    XLSX.writeFile(wb, 'tabela.xlsx');
}

function setupEditar() {
    document.querySelectorAll('.editable .kartKey').forEach((row) => {
        row.addEventListener('mouseenter', (e) => {
            if (e.target.parentNode.parentNode.parentNode.classList.contains('editable')) {
                e.target.parentNode.style.backgroundColor = 'rgb(255, 205, 205)'
            }
        })
        row.addEventListener('click', (e) => {
            let resposta = confirm('Excluir campo?')
            if (e.target.parentNode.parentNode.parentNode.classList.contains('editable') && resposta) {
                let lista = getKartDataFromLS()

                delete lista[e.target.parentNode.id]

                savaKastDataToLS(lista)
                atualizarListaGeral()

                if (Object.keys(lista).length == 0){
                    location.reload()
                }
            }
        })
        row.addEventListener('mouseleave', (e) => {
            e.target.parentNode.style.backgroundColor = ''
        })
    })
    document.querySelectorAll('.editable td').forEach((td) => {
        td.addEventListener('mouseup', (e) => {
            if (!e.target.classList.contains('kartKey')) {
                let resposta = confirm('Excluir campo?')
                if(resposta) {
                    let lista = getKartDataFromLS()
                    lista[e.target.parentNode.querySelector('.kartKey').textContent][e.target.classList[0].replace(/-/g, ' ')] = '';
                    savaKastDataToLS(lista)
                    atualizarListaGeral()
                }
            }
        })
    })
    document.addEventListener('click', (e) => {
        if (!document.querySelector('#divFT').contains(e.target)) {
            document.querySelector('#finalTable').classList.remove('editable')
        }
    })
    
}