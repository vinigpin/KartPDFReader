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

            data.forEach(kart => {
                tbody += `
                    <tr>
                        <td>${kart.pos}</td>
                        <td>${kart.kart}</td>
                        <td style="text-align: left;">${kart.nome}</td>
                        <td>${kart.mv}</td>
                        <td>${kart.tmv}</td>
                    </tr>
                `;
            const table = document.querySelector('#rawPDF');
            table.querySelector('tbody').innerHTML = tbody;
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
