/*
TODO: Al escribir en el modal se queda guardado de una vez para otra.
Hay que ver cómo cambiar el formato de la fecha para que sea más amigable
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
    if (selectedRow) {
      audioModal.classList.add("d-none");
      const tituloPodcast = selectedRow.querySelector('.titulo-fila').textContent;
      const episodioPodcast = selectedRow.querySelector('.episodio-fila').textContent;
      const temporadaPodcast = selectedRow.querySelector('.temporada-fila').textContent;
      const fechaPodcast = selectedRow.querySelector('.fecha-fila').textContent;
      const imagenPodcast = selectedRow.querySelector('.imagen-dentro-de-tabla').src;
      frmTitulo.placeholder = tituloPodcast;
      frmEpisodio.placeholder = episodioPodcast;
      frmTemporada.placeholder = temporadaPodcast;
      frmFecha.placeholder = fechaPodcast;
      frmImagen.placeholder = imagenPodcast;
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

async function cargarTabla() {
  const cuerpoTabla = document.getElementById("cuerpo-tabla");
  cuerpoTabla.innerHTML = plantillaPodcasts({
    podcasts: await obtenerTodosLosPodcasts()
  })
}
cargarTabla();

const podcastDataPrueba = {
  titulo: "Podcast de prueba",
  episodio: 2,
  temporada: 3,
  fecha: new Date(2020, 02, 02),
  imagen: "/img/AHD.jpg",
  
};


/*Función para guardar y cancelar*/
const botonGuardar = document.getElementById("boton-guardar-modal");
const botonCerrarModal = document.getElementById('boton-cerrar-modal');
botonGuardar.addEventListener("click", async () => {
  modalBootstrap.hide();
  
  /*Aquí hay un problema grande y es que no sé cómo sacar el id del objeto 
  podcast que se encuentra en mongodb si aquí a lo que estoy accediendo es a una fila.
  Otro problema es que abajo estás comprobando si hay alguna línea
  seleccionada, pero ya no sabes si el modal se abrió para edición o para insertar. 
  */
  if (selectedRow) {
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
    const respuesta=await guardarPodcast(podcastData);
    console.log(respuesta);
  }
  await cargarTabla()
});
