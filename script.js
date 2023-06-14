// Para tratar HTML
let tableBody = document.getElementById('tableBody');
let rowJuegos = document.getElementById('rowJuegos');
let tablePuntos = document.getElementById('tableBodyPuntos');
let idGame = juegos.length;

// Funciones
function init(){
    rellenarTablaCliente();
    rellenarJuegos();
    agregarSelects();
    agregarPuntos();
}

function agregarCliente(e) {
    e.preventDefault();
    let cliente = {
        nombres: document.getElementById('formNombre').value,
        apellidos: document.getElementById('formApellido').value,
        identificacion: document.getElementById('formIdentificacion').value,
        telefono: document.getElementById('formTelefono').value,
        correo: document.getElementById('formCorreo').value,
        nacimiento: document.getElementById('formNacimiento').value,
        nacionalidad: document.getElementById('formNacionalidad').value,
        puntos: 0
    }
    clientes.push(cliente);
    rellenarTablaCliente();
    agregarSelects();
    agregarPuntos();
    document.getElementById('formAgregar').reset();

}

function rellenarTablaCliente() {
    tableBody.innerHTML = '';
    let id = 0;
    for (let cliente of clientes) {
        const row = document.createElement('tr');
        row.id = 'cliente' + id;
        row.innerHTML = `
        <td>${cliente.nombres}</td>
        <td>${cliente.apellidos}</td>
        <td>${cliente.identificacion}</td>
        <td>${cliente.nacimiento}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.nacionalidad}</td>
        <td><button type="button" class="btn btn-danger" onclick="eliminarCliente(${id})">Eliminar</button> <button type="button" class="btn btn-success" onclick="editar(${id})" id="botonEditar">Editar</button></td>`
        tableBody.appendChild(row);
        id++;
    }
    
}

function eliminarCliente(id) {
    let eliminado = document.getElementById('cliente'+id);
    tableBody.removeChild(eliminado);
    clientes.splice(id, 1);
}

function editar(id) {
    let form = document.getElementById('formAgregar');
    let inputs = form.getElementsByTagName('input');
    let [nombre, apellido, identificacion, telefono, nacimiento, correo, nacionalidad] = inputs
    if (nombre.value != '' || apellido.value !='' || telefono.value !='' || identificacion.value !='' || nacimiento.value !='' || correo.value !='' || nacionalidad.value !='' ) {
        alert ('Esta editando otro cliente');
        return
    }
    let cliente = clientes[id];
    let fecha_nac = cliente.nacimiento;
    let cambiada = fecha_nac.split("/").join("-");
    nombre.value = cliente.nombres;
    apellido.value = cliente.apellidos;
    identificacion.value = cliente.identificacion;
    telefono.value = cliente.telefono;
    nacimiento.value = cambiada;
    correo.value = cliente.correo;
    nacionalidad.value = cliente.nacionalidad;
    eliminarCliente(id);
}

function buscar() {
    const buscado = document.getElementById('searchInput').value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].getElementsByTagName('td');
        let found = false;
        for (let j = 0; j < columns.length; j++) {
            const columnValue = columns[j].textContent.toLowerCase();
            if (columnValue.includes(buscado)) {
                found = true;
                break;
            }
        }
        if (found) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

function agregarJuego(e){
    e.preventDefault();
    let nombreJuego = document.getElementById('formNombreJuego').value;
    let valorLicencia = document.getElementById('formPrecio').value;
    let tematica = document.getElementById('formTematica').value;
    let url = document.getElementById('formUrl').value;
    if (url == '') {
        url = `./images/cards-img/nothing.png`;
    }
    let juego = {
        id: idGame,
        nombre: nombreJuego,
        tematica: tematica,
        valorLicencia: valorLicencia,
        fidelización: parseInt(valorLicencia * 0.2),
        srcImage: url
    }
    idGame++;
    juegos.push(juego);
    rellenarJuegos();
    document.getElementById('formGestion').reset();
    agregarSelects();

}

function rellenarJuegos() {
    rowJuegos.innerHTML = ''
    id = 0;
    juegos.forEach(juego => {
        const div = document.createElement('div');
        div.classList = "card m-1 bg-dark";
        div.id = 'juego' + id;
        div.innerHTML = `
            <img src="${juego.srcImage}" class="card-img-top" alt="${juego.nombre}">
            <div class="card-body">
                <h3 class="card-title text-center">${juego.nombre}</h3>
                <span class="card-text">${juego.tematica}</span>
                <br>
                <span class="card-text">$${juego.valorLicencia}</span>
            </div>
            <div class="card-footer text-center">    
                <button type="button" class="btn btn-outline-danger" onclick="eliminarJuego(${id})">Eliminar</button>
            </div>`
        rowJuegos.appendChild(div);
        id++;
    })
    idGame = id; 
}

function eliminarJuego(id) {
    let eliminado = document.getElementById('juego'+id);
    rowJuegos.removeChild(eliminado);
    juegos.splice(id, 1);
}

function agregarSelects() {
    document.getElementById('selectCliente').innerHTML = '<option selected disabled value="">Elige...</option>';
    document.getElementById('selectJuego').innerHTML = '<option selected disabled value="">Elige...</option>';
    clientes.forEach(cliente => {
        let opcion = document.createElement('option');
        opcion.value = clientes.indexOf(cliente);
        opcion.textContent = cliente.nombres + ' ' + cliente.apellidos;
        document.getElementById('selectCliente').appendChild(opcion);
    });
    juegos.forEach(juego => {
        let opcion = document.createElement('option');
        opcion.value = juegos.indexOf(juego);
        opcion.textContent = juego.nombre;
        document.getElementById('selectJuego').appendChild(opcion);
    });
}

function comprar(e) {
    e.preventDefault();
    let div = document.getElementById('factura');
    let opcionCliente = document.getElementById('selectCliente').value;
    let opcionJuego = document.getElementById('selectJuego').value;
    let precio = juegos[opcionJuego].valorLicencia;
    clientes[opcionCliente].puntos += juegos[opcionJuego].fidelización;
    let precioTotal = (precio*1.16) + (precio*0.04);
    let td = clientes[opcionCliente].nombres + ' ' + clientes[opcionCliente].apellidos;
    div.className = 'show';
    div.innerHTML = `
    <div class="card card-body" style="width: 500px;">
        <h3 class="mb-4 text-center fs-2">Factura</h3>
        <div class="position-absolute top-0 end-0">
            <button type="button" class="btn-close btn-danger" id="cerrar"></button>
        </div>
        <table class="g-2">
            <tr><th>Cliente</th><td class="text-end">${td}</td></tr>
            <tr><th>Juego</th><td class="text-end">${juegos[opcionJuego].nombre}</td></tr>
            <tr><th>Valor de la licencia</th><td class="text-end">$${precio}</td></tr>
            <tr><th>Valor de IVA</th><td class="text-end">$${(precio*0.16).toFixed(1)}</td></tr>
            <tr><th>Valor de impuesto especial</th><td class="text-end">$${(precio*0.04).toFixed(1)}</td></tr>
            <tr><th>Valor total</th><td class="text-end">$${precioTotal.toFixed(1)}</td></tr>
            <tr><th>Puntos de fidelizacion</th><td class="text-end">${juegos[opcionJuego].fidelización}</td></tr>
        </table>
    </div>`
    agregarPuntos();
    document.getElementById('formCompra').reset();
    document.getElementById('cerrar').addEventListener('click', () => {
        div.innerHTML = '';
    });
}

function agregarPuntos() {
    tablePuntos.innerHTML = '';
    clientes.forEach(cliente => {
        let row = document.createElement('tr');
        row.innerHTML = `
        <tr>
            <td>${cliente.nombres}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.puntos}</td>
        </tr>`
        tablePuntos.appendChild(row);
    })
}

// Iniciar Funciones Necesarias
init();

// Eventos
document.getElementById('formAgregar').addEventListener('submit', agregarCliente);
document.getElementById('formGestion').addEventListener('submit', agregarJuego);
document.getElementById('searchInput').addEventListener('input', buscar);
document.getElementById('formCompra').addEventListener('submit', comprar);