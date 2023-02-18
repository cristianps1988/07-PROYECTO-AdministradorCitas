import Citas from "./clases/Citas.js";
import UI from "./clases/UI.js";
import {
    mascotaInput, 
    propietarioInput, 
    telefonoInput, 
    fechaInput, 
    horaInput, 
    sintomasInput, 
    formulario
} from "./selectores.js";

const administrarCitas = new Citas();
const ui = new UI();

let editando;
export let DB;

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}


// funciones

export function baseDatos(){
    window.onload = () => {
        crearDB();
    }
}

// crear la base de datos
function crearDB(){
    // crear la DB 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // si hay error
    crearDB.onerror = function(){
        console.log('Hubo un error al crear la DB');
    }

    // si todo sale bien
    crearDB.onsuccess = function(){
        console.log('DB creada correctamente');
        DB = crearDB.result;
        console.log(DB);
        ui.imprimirCitas();
    }

    // definir el schema
    crearDB.onupgradeneeded = function(e){
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        // definir las columnas
        objectStore.createIndex('mascota', 'mascota', {unique: false});
        objectStore.createIndex('propietario', 'propietario', {unique: false});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('sintomas', 'sintomas', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});

        console.log('DB creada y lista');
    }
}

export function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e){
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return;
    }

    if(editando){
        administrarCitas.editarCita({...citaObj});

        // editar en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        objectStore.put(citaObj);
        transaction.oncomplete = () => {
            ui.imprimirAlerta('Editada correctamente');
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }
        transaction.onerror = () => {
            console.log('hubo un error');
        }

    } else{
        // generar id unico para cada cita
        citaObj.id = Date.now();
        administrarCitas.agregarCita({...citaObj});

        //insertar registro en la indexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        // habilitar object store
        const objectStore = transaction.objectStore('citas');

        // insetar en la DB
        objectStore.add(citaObj);
        transaction.oncomplete = () => {
            ui.imprimirAlerta('Cita creada correctamente');
        }
    }

    
    reiniciarObj();
    formulario.reset();
    ui.imprimirCitas();
}

export function reiniciarObj(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

export function eliminarCita(id){
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    objectStore.delete(id);
    transaction.oncomplete = () => {
        console.log(`Cita ${id} eliminada`);
        ui.imprimirCitas();
    }
    transaction.onerror = () => {
        console.log('Hubo un error');
    }

    // mostrar mensaje
    ui.imprimirAlerta('La cita fue eliminada');

    // refrescar citas
}

export function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // cambiar texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    // activar modo edicion
    editando = true;
}  