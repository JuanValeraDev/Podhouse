
cargarTabla();
const botonCerrar = document.querySelector('.boton-cerrar-reproductor');
const reproductorCompleto = document.getElementById('reproductor-completo');
const reproductor = document.querySelector('.reproductor');
const tabla = document.getElementById('cuerpo-tabla');
const botonCTA = document.getElementById('botonScroll');

/*Función para que la cta vaya a la tabla */
botonCTA.addEventListener('click', function () {
    tabla.scrollIntoView({behavior: 'smooth'});
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
        let opciones = {method: metodo};
        if (body) {
            opciones.body = JSON.stringify(body);
            opciones.headers = {"Content-type": "application/json"};
        }
        const respuesta = await fetch(url, opciones);
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        if (respuesta.ok) {
            if (opciones.method === 'PUT') {
                showToast("Podcast editado con éxito");
                console.log('Podcast editado con éxito');
            }
            if (opciones.method === 'POST') {
                showToast("Podcast guardado con éxito");
                console.log('Podcast creado con éxito');
            }
            if (opciones.method === 'DELETE') {
                showToast("Podcast borrado con éxito");
                console.log('Podcast borrado con éxito');
            }
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
        console.error(`Error al enviar la petición ${metodo} a ${url}: ${error}`);
        return error.message;
    }
}

/*CRUD */
async function guardarPodcast(podcastData) {
    return await enviarFetch("/podcasts", "POST", podcastData);
}

async function obtenerTodosLosPodcasts() {
    return await enviarFetch("/podcasts", "GET")
}

async function buscarPodcast(titulo) {
    return await enviarFetch(
        `/podcasts?titulo=${titulo}`, "GET"
    );
}

async function editarPodcast(id, podcastData) {
    return await enviarFetch(`/podcasts/${id}`, "PUT", podcastData);
}

async function borrarPodcast(id) {
    return await enviarFetch(`/podcasts/${id}`, "DELETE");
}

/*Cargar tabla */

async function cargarTabla(titulo) {
    let podcasts;
    let podcastsConFechasJavaScript;
    if (titulo) {
        podcasts = await buscarPodcast(titulo);
    } else {
        podcasts = await obtenerTodosLosPodcasts();
    }
    podcastsConFechasJavaScript = podcasts.map(podcast => {
        let fecha = new Date(podcast.fecha);
        podcast.fechaFormateada = fecha.toLocaleDateString("es-ES", {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
        return podcast;
    });

    tabla.innerHTML = plantillaPodcasts({podcasts: podcastsConFechasJavaScript});

}


/*Función para buscar por título*/
const buscador = document.querySelector('.buscador');
let timeout;
buscador.addEventListener("input", async () => {
    clearTimeout(timeout);

    timeout = setTimeout(await cargarTabla(buscador.value), 500);
});


/*Función para crear y editar*/
const botonGuardar = document.getElementById("boton-guardar-modal");
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
        await editarPodcast(id, podcastDataEdicion);
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

        await guardarPodcast(podcastData);
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

/*Funciones para abrir y cerrar el reproductor */

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

botonCerrar.addEventListener('click', () => {
    reproductor.pause();
    reproductorCompleto.style.display = 'none';
});


/*Función para mover el reproductor arrastrándolo con el ratón*/
let estaEnMovimiento = false;
let actualX;
let actualY;
let inicialX;
let inicialY;
let xOffset = 0;
let yOffset = 0;


reproductorCompleto.addEventListener("mousedown", dragStart);
reproductorCompleto.addEventListener("mouseup", dragEnd);
reproductorCompleto.addEventListener("mouseout", dragEnd);
reproductorCompleto.addEventListener("mousemove", drag);


function dragStart(e) {
    inicialX = e.clientX - xOffset;
    inicialY = e.clientY - yOffset;

    estaEnMovimiento = true;
}

function dragEnd(e) {
    estaEnMovimiento = false;
}

function drag(e) {
    if (estaEnMovimiento) {
        e.preventDefault();
        actualX = e.clientX - inicialX;
        actualY = e.clientY - inicialY;

        xOffset = actualX;
        yOffset = actualY;

        setTranslate(actualX, actualY, reproductorCompleto);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}


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


/*Función para el Toast */
function showToast(message) {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.backgroundColor = "#263159";
    toast.style.color = "#FFFBEB";
    toast.style.border = "#251749";
    toast.style.padding = "10px";
    toast.style.position = "fixed";
    toast.style.bottom = "200px";
    toast.style.right = "40%";
    toast.style.boxShadow = "2px 2px 10px #000";
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}





