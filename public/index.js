/*
TODO: Que al hacer hover sobre una fila de la tabla aparezca un dialogo con la imagen y una descripción del programa.
Que solo se pueda abrir el modal de editar teniendo seleccionada una fila.
El modal de edición debe abrirse con los datos de esa fila.
El modal de edición y de inserción deben admitir una subida de una imagen

*/

/*Funciones para abrir y cerrar el reproductor */
const botonCerrar = document.querySelector('.boton-cerrar-reproductor');
const reproductorCompleto = document.getElementById('reproductor-completo');
const reproductor = document.querySelector('.reproductor');

botonCerrar.addEventListener('click', () => {
  reproductor.pause();
  reproductorCompleto.style.display = 'none';
});

const botonesPlay = document.querySelectorAll('.play-button-table');
for (const boton of botonesPlay) {
  boton.addEventListener('click', () => {
    reproductorCompleto.style.display = 'flex';
  });
}

/*Función para que la cta vaya a la tabla */
document.getElementById('botonScroll').addEventListener('click', function () {
  document.getElementById('tabla').scrollIntoView({ behavior: 'smooth' });
});


/*Función para seleccionar o deseleccionar una fila */
const tabla = document.getElementById('tabla');
let selectedRow;

tabla.addEventListener('click', (event) => {
  const row = event.target.parentNode;
  if (row.tagName === 'TR') {
    if (row === selectedRow) {
      row.style.backgroundColor = '';
      row.style.color = '#251749'
      selectedRow = null;
    } else {
      row.style.backgroundColor = '#263159';
      row.style.color = '#FFFBEB';
      if (selectedRow) {
        selectedRow.style.backgroundColor = '';
        selectedRow.style.color = ''
      }
      selectedRow = row;
    }
  }
});

/*Función para abrir modal */
const modal = new bootstrap.Modal(document.getElementById('informacion-podcast'));

document.getElementById('boton-editar').addEventListener('click', abrirModal);
document.getElementById('boton-insertar').addEventListener('click', abrirModal);
const inputSubida = document.getElementById('input-subida');

function abrirModal(evt) {
  if (evt.target.classList.contains('boton-insertar')) {
    inputSubida.classList.remove("d-none");
    modal.show();
  } else {
    if (selectedRow) {
      inputSubida.classList.add("d-none");
      modal.show();
    }
  }

}


/*Función para cambiar el podcast del reproductor */
const rows = document.querySelectorAll('.table tbody tr');

rows.forEach(row => {
  const botonReproducir = row.querySelector('td p .btn');
  botonReproducir.addEventListener('click', () => {

    const titulo = row.querySelector('.titulo-fila').textContent;
    const imagen = row.querySelector('.imagen-dentro-de-tabla').src;
    const audio = row.querySelector('.audio-dentro-de-tabla').src;

    document.querySelector('.imagen-reproductor').src = imagen;
    document.querySelector('.titulo-reproductor').textContent = titulo;
    document.querySelector('.reproductor').src = audio;
  });
});

/*Función para el fetch*/

async function enviarFetch(url, metodo, body) {
  try {
    let opciones = { method: metodo };
    if (body) {
      opciones.body = JSON.parse(body);
      opciones.headers = { "Content-type": "appication/json" };
    }
    const respuesta = await fetch(url, opciones);
    if (respuesta.ok) {
      const tipoMIME = respuesta.headers.get("content-type");
      if (tipoMIME && tipoMIME.startsWith("application/json")) {
        return await respuesta.json();
      } else {
        return await respuesta.text();
      }
    } else {
      throw respuesta.statusText;
    }

  } catch (error) {
    throw error;
  }
}

/*CRUD */
async function guardarPodcast(podcastData) {
  return await enviarFetch("/podcasts", "POST", podcastData);
}
async function obtenerTodosLosPodcasts(){
  return await enviarFetch("/podcasts", "GET")
}
async function buscarPodcast(id) {
  return await enviarFetch(`/podcasts/${id}`, "GET");
}
async function editarPodcast(id, podcastData) {
  return await enviarFetch(`/podcasts/${id}`, "PUT", podcastData);
}
async function borrarPodcast(id) {
  return await enviarFetch(`/podcasts/${id}`, "DELETE");
}

/*Cargar tabla */
async function cargarTabla(){
  cuerpoTabla.innerHTML = plantillaPodcasts({podcasts:podcasts})
}

cargarTabla();