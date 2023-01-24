/*
TODO: Si hay un error en el fetch debería informar al usuario de lo que ha pasado
Está fallando en la edición.

Falta implementar el buscador
*/



/*Funciones para abrir y cerrar el reproductor */
const botonCerrar = document.querySelector('.boton-cerrar-reproductor');
const reproductorCompleto = document.getElementById('reproductor-completo');
const reproductor = document.querySelector('.reproductor');

botonCerrar.addEventListener('click', () => {
  reproductor.pause();
  reproductorCompleto.style.display = 'none';
});


const tabla = document.getElementById('cuerpo-tabla');
tabla.addEventListener('click', (event) => {
  if (event.target.matches('.play-button-table')) {
    reproductorCompleto.style.display = 'flex';
    row = event.target.closest('tr');

    const titulo = row.querySelector('.titulo-fila').textContent;
    const imagen = row.querySelector('.imagen-dentro-de-tabla').src;
    const audio = row.querySelector('.audio-dentro-de-tabla').src;

    document.querySelector('.imagen-reproductor').src = imagen;
    document.querySelector('.titulo-reproductor').textContent = titulo;
    document.querySelector('.reproductor').src = audio;
  }
});

/*Función para seleccionar o deseleccionar una fila */
let selectedRow = null;

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

/*Función para que la cta vaya a la tabla */
document.getElementById('botonScroll').addEventListener('click', function () {
  document.getElementById('tabla').scrollIntoView({ behavior: 'smooth' });
});

/*Función para abrir modal */
const modalBootstrap = new bootstrap.Modal(document.getElementById('modal'));
const frmTitulo = document.getElementById('frmTitulo');
const frmEpisodio = document.getElementById('frmEpisodio');
const frmTemporada = document.getElementById('frmTemporada');
const frmFecha = document.getElementById('frmFecha');
const frmImagen = document.getElementById('frmImagen');
let esEdicion = false;

document.getElementById('boton-editar').addEventListener('click', abrirModal);
document.getElementById('boton-insertar').addEventListener('click', abrirModal);
const audioModal = document.getElementById('audio-modal');

function abrirModal(evt) {
  if (evt.target.classList.contains('boton-insertar')) {
    audioModal.classList.remove("d-none");
    frmTitulo.placeholder = "Nombre del programa";
    frmEpisodio.placeholder = "Número de episodio";
    frmTemporada.placeholder = "Número de temporada";
    frmFecha.placeholder = "Fecha";
    frmImagen.placeholder = "Ruta de la imagen";
    modalBootstrap.show();
  } else {
    esEdicion = true;
    if (selectedRow) {
      audioModal.classList.add("d-none");
      const tituloPodcast = selectedRow.querySelector('.titulo-fila').textContent;
      const episodioPodcast = selectedRow.querySelector('.episodio-fila').textContent;
      const temporadaPodcast = selectedRow.querySelector('.temporada-fila').textContent;
      const fechaPodcast = selectedRow.querySelector('.fecha-fila').textContent;
      const imagenPodcast = selectedRow.querySelector('.imagen-dentro-de-tabla').src;
      frmTitulo.value = tituloPodcast;
      frmEpisodio.value = episodioPodcast;
      frmTemporada.value = temporadaPodcast;
      frmFecha.value = fechaPodcast;
      frmImagen.vaue = imagenPodcast;
      modalBootstrap.show();
    }
  }
}



/*Función para el fetch*/
async function enviarFetch(url, metodo, body) {
  try {
    let opciones = { method: metodo };
    if (body) {
      opciones.body = JSON.stringify(body);
      opciones.headers = { "Content-type": "application/json" };
    }
    const respuesta = await fetch(url, opciones);
    if (respuesta.ok) {
      const tipoMIME = respuesta.headers.get("content-type");
      if (tipoMIME && tipoMIME.startsWith("application/json")) {
        return { ok: true, data: await respuesta.json() };
      } else {
        return { ok: true, data: await respuesta.text() };
      }
    } else {
      throw respuesta.statusText;
    }
  } catch (error) {
    console.log("Ha habido un error en el fetch:" + error)
    return { ok: false, error: error.message };
  }
}

/*CRUD */
async function guardarPodcast(podcastData) {
  return await enviarFetch("/podcasts", "POST", podcastData);
}
async function obtenerTodosLosPodcasts() {
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

// async function cargarTabla() {
//   const cuerpoTabla = document.getElementById("cuerpo-tabla");
//   cuerpoTabla.innerHTML = plantillaPodcasts({
//     podcasts: await obtenerTodosLosPodcasts()
//   })
// }
// cargarTabla();

// async function cargarTabla() {
  
//   const podcasts = await obtenerTodosLosPodcasts();
//   console.log(typeof podcasts);

//   const podcastsConFechasJavaScript = podcasts.data.map(podcast => {
//     podcast.fecha = new Date(podcast.fecha);
//     return podcast;
//   });
//   const cuerpoTabla = document.getElementById("cuerpo-tabla");
//   cuerpoTabla.innerHTML = plantillaPodcasts({ podcasts: podcastsConFechasJavaScript });
// }
// cargarTabla();
async function cargarTabla() {
  const podcasts = await obtenerTodosLosPodcasts();
  const podcastsConFechasJavaScript = podcasts.data.map(podcast => {
    podcast.fecha = new Date(podcast.fecha);
    podcast.fechaFormateada = podcast.fecha.toLocaleDateString("es-ES", {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    return podcast;
  });
  const cuerpoTabla = document.getElementById("cuerpo-tabla");
  cuerpoTabla.innerHTML = plantillaPodcasts({ podcasts: podcastsConFechasJavaScript });
}
cargarTabla();






/*Función para crear y editar*/
const botonGuardar = document.getElementById("boton-guardar-modal");
const botonCerrarModal = document.getElementById('boton-cerrar-modal');

botonGuardar.addEventListener("click", async () => {
  modalBootstrap.hide();

  if (selectedRow && esEdicion) {
    const id = selectedRow.dataset.id;
    const podcastDataEdicion = {
      titulo: frmTitulo.value,
      episodio: frmEpisodio.value,
      temporada: frmTemporada.value,
      fecha: frmFecha.value,
      imagen: frmImagen.value,
      audio: selectedRow.querySelector('.audio-dentro-de-tabla').src
    };

    const respuesta = await editarPodcast(id, podcastDataEdicion);
    if (respuesta.ok) {
      console.log(respuesta)
    } else {
      console.log("Error: " + respuesta.status)
    }
    esEdicion = false;

  } else {
    const podcastData = {
      titulo: frmTitulo.value,
      episodio: frmEpisodio.value,
      temporada: frmTemporada.value,
      fecha: frmFecha.value,
      imagen: frmImagen.value,
      audio: frmAudio.value
    };
    const respuesta = await guardarPodcast(podcastData);
    console.log(respuesta);
  }
  await cargarTabla();
});


/*Fución para borrar un podcast */
const botonBorrar = document.getElementById('boton-borrar');

botonBorrar.addEventListener("click", async () => {
  if (selectedRow) {
    const id = selectedRow.dataset.id;
    await borrarPodcast(id);
  }
  await cargarTabla();
});