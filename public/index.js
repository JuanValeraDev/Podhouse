/*
TODO: 
- !!!Falta implementar el buscador: ten en cuenta que aquí hay dos métodos
uno para cogerlos todos y otro para buscar por título. En la función
de cargar tabla estás cogiéndolos todos.
- Implementar una función para que si le dan a cancelar al modal se borre lo que han escrito
- Poner el logo de la web
- Cambiar textos para explicar la nueva idea de negocio
- Que al darle al play en la tabla se empiece a reproducir directamente el audio.
*/

/*Función para crear muchos podcasts de golpe*/
/*async function crearPodcasts() {
    const podcastData = {
        titulo: "Prueba",
        episodio: 1,
        temporada: 1,
        fecha: new Date(2020, 0o2, 0o2),
        imagen: "/img/MM.jpg",
        audio: "/audios/MM.mp3"
    };
    for (let i = 0; i < 10; i++) {
        guardarPodcast(podcastData);
    }
}
crearPodcasts();
*/
const botonCerrar = document.querySelector('.boton-cerrar-reproductor');
const reproductorCompleto = document.getElementById('reproductor-completo');
const reproductor = document.querySelector('.reproductor');
const tabla = document.getElementById('cuerpo-tabla');

/*Función para mover el reproductor arrastrándolo con el ratón*/
let estaEnMovimiento = false;
let actualX;
let actualY;
let inicialX;
let inicialY;
let xOffset = 0;
let yOffset = 0;
let originalX = 0;
let originalY = 0;

reproductorCompleto.addEventListener("mousedown", establecerPosicionOriginal);

reproductorCompleto.addEventListener("mousedown", dragStart);
reproductorCompleto.addEventListener("mouseup", dragEnd);
reproductorCompleto.addEventListener("mouseout", dragEnd);
reproductorCompleto.addEventListener("mousemove", drag);

function establecerPosicionOriginal() {
    originalX = reproductorCompleto.offsetLeft;
    originalY= reproductorCompleto.offsetTop;

}

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

/*Funciones para abrir y cerrar el reproductor */

tabla.addEventListener('click', (event) => {
    if (event.target.matches('.play-button-table')) {
        reproductorCompleto.style.display = 'flex';
        /*Con esto del sessionStorage estoy*/
       sessionStorage.key(1,reproductorCompleto.style.offSetLeft)

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
    document.cookie = "reproductor_x=" + reproductorCompleto.offsetLeft + "; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/;";
    document.cookie = "reproductor_y=" + reproductorCompleto.offsetTop + "; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/;";

    reproductorCompleto.style.display = 'none';
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
    document.getElementById('tabla').scrollIntoView({behavior: 'smooth'});
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
    return await enviarFetch("/podcasts", "GET", titulo);
}

async function editarPodcast(id, podcastData) {
    return await enviarFetch(`/podcasts/${id}`, "PUT", podcastData);
}

async function borrarPodcast(id) {
    return await enviarFetch(`/podcasts/${id}`, "DELETE");
}

/*Cargar tabla */

async function cargarTabla() {
    const podcasts = await obtenerTodosLosPodcasts();
    const podcastsConFechasJavaScript = podcasts.map(podcast => {
        podcast.fecha = new Date(podcast.fecha);
        podcast.fechaFormateada = podcast.fecha.toLocaleDateString("es-ES", {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
        return podcast;
    });

    const cuerpoTabla = document.getElementById("cuerpo-tabla");
    cuerpoTabla.innerHTML = plantillaPodcasts({podcasts: podcastsConFechasJavaScript});

}


cargarTabla();


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





