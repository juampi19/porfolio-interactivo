//Selectores
const formulario = document.querySelector( '.form' );
const divActividades = document.querySelector('.actividades');

const nombreInput = document.querySelector('#title');
const descripcionInput = document.querySelector('#description');
const imagenInput = document.querySelector('#imgUrl');

//objetos
class Activity {
  constructor( {title, description, imgUrl} ) {
    this.id = new Date().getTime()  * 3;
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
  }
}
class Repository {
  constructor() {
    this.activities = JSON.parse( localStorage.getItem('activities') ) ?? [];
  }
  
  getAllActivities() {
    return this.activities;
  } 
  //* Agregamos la actividad al arreglo
  createActivity(activity) {
    this.activities = [ ...this.activities, activity ];
  }

  //* Borrarmos una actividad
  deleteActivity( id ) {
    this.activities = this.activities.filter( act => act.id !== id );
  }

  //* agregamos al localstorage 
  addToLocalStorage() {
    localStorage.setItem('activities', JSON.stringify( this.activities ));
  }

}

//Variables
let actividadObj = {};
const activitiesRepo = new Repository();


//Eventos y funciones
//* Reset del html
const resetHTML = () => {
  while(divActividades.firstChild) {
    divActividades.removeChild( divActividades.firstChild );
  }
}

//* comprobamos si hay alguna activiada
const comprobarActiviades = () => {
  const parrafoNohay = document.querySelector( '.sin-actividades' );

  if( activitiesRepo.getAllActivities().length === 0 ) {
    parrafoNohay.classList.remove('d-none')
    parrafoNohay.classList.add('d-block');

  }else {
    parrafoNohay.classList.remove('d-block');
    parrafoNohay.classList.add('d-none');
  }
}

//* eliminamos la activiada
const eliminarActividad = ( id ) => {
  activitiesRepo.deleteActivity( id );
  activitiesRepo.addToLocalStorage();
  generarHTML();
}

//* Generar el html con las actividades
function generarHTML(){
  comprobarActiviades();
  resetHTML();

  const arreglo = activitiesRepo.getAllActivities();


  arreglo.forEach( act => {
    const { title, description, imgUrl, id } = act;

    //div de la actividad
    const actividadDiv = document.createElement('div');
    actividadDiv.classList.add( 'actividad' );
    actividadDiv.dataset.id = id;

    //titulo actividad
    const tituloActividad = document.createElement('h4');
    tituloActividad.textContent = title;

    //Descripcion actividad
    const descripcionActividad = document.createElement('p');
    descripcionActividad.textContent = description;

    //imagen actividad
    const imagenActividad = document.createElement('img');
    imagenActividad.src = imgUrl;
    imagenActividad.alt = `Imagen de la actividad - ${ title }`


    //agregamos al div actividad
    actividadDiv.appendChild(tituloActividad);
    actividadDiv.appendChild(descripcionActividad);
    actividadDiv.appendChild(imagenActividad);

    //agregamos al div principal
    divActividades.appendChild( actividadDiv );

    actividadDiv.onclick = () => eliminarActividad( id );

  } )
}

//* Obtener los valores de los inputa
const datosActividad = ( event ) => {
  actividadObj[event.target.name] = event.target.value;
}

//* reseteamos el objeto
const resetObj = () => {
  actividadObj.title = undefined;
  actividadObj.description = undefined;
  actividadObj.imgUrl = undefined;
}


//* crear un mensaje de alerta
const mensajeAlerta =( mensaje, error ) => {
  //Evitamos que se repita la alerta
  const errorClass = document.querySelector('.alerta');

  if( errorClass ) {
    errorClass.remove();
  }
  
  //Generamos el html
  const mensajeParrafo = document.createElement('p');
  
  if( error ) {
    mensajeParrafo.remove();
    mensajeParrafo.classList.add( 'error' );
  }else{
    mensajeParrafo.remove();
    mensajeParrafo.classList.add('success');
  }
  mensajeParrafo.classList.add( 'alerta' );
  mensajeParrafo.textContent = mensaje;

  //Inyectamos al html
  document.querySelector('.container-alerta').appendChild( mensajeParrafo )

  setTimeout( () => {
    mensajeParrafo.remove();
  }, 4000 )
}



//* agregar una actividad
const nuevaActividad = ( event ) => {
  event.preventDefault();
  const { title, description, imgUrl } = actividadObj

  //Comprobamos que el objeto no este vacío
  if( [title, description, imgUrl].includes( undefined ) ) {
    mensajeAlerta( '¡Todos los campos son obligatorios!', true );

    return;
  }

  //Creamos una instancia de activity y la agregamos al arreglo
  const activity = new Activity( actividadObj );

  activitiesRepo.createActivity( activity );
  activitiesRepo.addToLocalStorage();

  formulario.reset();
  resetObj();
  mensajeAlerta( '¡Actividad agregada correctamente!' );
  
  generarHTML();
  
}

//* Iniciar la aplicación
const initApp = () => {
  nombreInput.addEventListener( 'input', datosActividad );
  descripcionInput.addEventListener('input', datosActividad);
  imagenInput.addEventListener('input', datosActividad);

  formulario.addEventListener( 'submit', nuevaActividad );

  document.addEventListener('DOMContentLoaded', comprobarActiviades )

  generarHTML();
}
initApp();