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

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}


// funciones
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
        ui.imprimirAlerta('Editada correctamente');
        administrarCitas.editarCita({...citaObj});
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        editando = false;
    } else{
        // generar id unico para cada cita
        citaObj.id = Date.now();
        administrarCitas.agregarCita({...citaObj});
        ui.imprimirAlerta('Cita creada correctamente');
    }

    
    reiniciarObj();
    formulario.reset();
    ui.impimirCitas(administrarCitas);
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
    // eliminar cita
    administrarCitas.eliminarCita(id);

    // mostrar mensaje
    ui.imprimirAlerta('La cita fue eliminada');

    // refrescar citas
    ui.impimirCitas(administrarCitas);
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