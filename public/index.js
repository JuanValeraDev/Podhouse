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
const modalBootstrap = new bootstrap.Modal(document.getElementById('modal'));

document.getElementById('boton-editar').addEventListener('click', abrirModal);
document.getElementById('boton-insertar').addEventListener('click', abrirModal);
const modal = document.getElementById('modal');

function abrirModal(evt) {
  if (evt.target.classList.contains('boton-insertar')) {
    modal.classList.remove("d-none");
    modalBootstrap.show();
  } else {
    if (selectedRow) {
      modal.classList.add("d-none");
      modalBootstrap.show();
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
      opciones.body = JSON.stringify(body);
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
  const cuerpoTabla=document.getElementById("cuerpo-tabla");
  cuerpoTabla.innerHTML = plantillaPodcasts({
    podcasts: await obtenerTodosLosPodcasts()})
}
cargarTabla();

/* Guardar un podcast*/
const podcastDataPrueba={titulo:"CP",
episodio:2,
temporada:3,
fecha:new Date(2020,02,02),
imagen:"./img/CoPe.jpg",
audio: "./audios/Las noches de ortega 9-03 24_09_2022.mp3"};

const botonGuardar= document.getElementById("boton-guardar-modal");
botonGuardar.addEventListener("click", async () => {
  modalBootstrap.hide();
  const id = botonGuardar.dataset.id;
  if (id) {
    await editarPodcast(id, podcastDataPrueba);
  } else {
    const podcastData = {
      titulo: frmTitulo.value,
      episodio: frmEpisodio.value,
      temporada: frmTemporada.value,
      fecha: frmFecha.value,
      imagen: frmImagen.value,
      audio: frmAudio.value
    };
    await guardarPodcast(podcastData);
  }
  await cargarTabla();
});
