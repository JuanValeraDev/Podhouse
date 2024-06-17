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
const frmDuracion = document.getElementById('frmDuracion');
const frmEpisodio = document.getElementById('frmEpisodio');
const frmTemporada = document.getElementById('frmTemporada');
const frmFecha = document.getElementById('frmFecha');
const frmImagen = document.getElementById('frmImagen');
const frmAudio = document.getElementById('frmAudio');

let esEdicion = false;

const audioModal = document.getElementById('audio-modal');
document.getElementById('boton-insertar').addEventListener('click', abrirModal);

function abrirModal(evt) {
    if (evt.target.classList.contains('boton-insertar')) {
        audioModal.classList.remove("d-none");
        frmTitulo.placeholder = "Nombre del programa";
        frmDuracion.placeholder = "Tiempo de duración"
        frmEpisodio.placeholder = "Número de episodio";
        frmTemporada.placeholder = "Número de temporada";
        frmFecha.placeholder = "Fecha";
        frmImagen.placeholder = "Ruta de la imagen";
        modalBootstrap.show();
    } else {
        esEdicion = true;
        if (selectedRow) {
            audioModal.classList.add("d-none");
            frmTitulo.value = selectedRow.querySelector('.titulo-fila').textContent;
            frmDuracion.value = selectedRow.querySelector('.duracion-fila').textContent;
            frmEpisodio.value = selectedRow.querySelector('.episodio-fila').textContent;
            frmTemporada.value = selectedRow.querySelector('.temporada-fila').textContent;
            frmFecha.value = selectedRow.querySelector('.fecha-fila').textContent;
            frmImagen.vaue = selectedRow.querySelector('.imagen-dentro-de-tabla').src;
            modalBootstrap.show();
        }
    }
}


/*Función para el fetch*/
async function enviarFetch(url, metodo, body) {
    try {
        let request = {method: metodo};
        if (body) {
            request.body = JSON.stringify(body);
            request.headers = {"Content-type": "application/json"};
        }
        const respuesta = await fetch(url, request);
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        if (respuesta.ok) {
            if (request.method === 'PUT') {
                showToast("Podcast editado con éxito");
            }
            if (request.method === 'POST') {
                showToast("Podcast guardado con éxito");
            }
            if (request.method === 'DELETE') {
                showToast("Podcast borrado con éxito");
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
            duracion: frmDuracion.value,
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
            duracion: frmDuracion.value,
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
    if (selectedRow === null) {
        botonVerReviews.style.display = 'none';
        botonPonerReviews.style.display = 'none';
        botonEditar.style.display='none';
        botonBorrar.style.display='none';
    } else {
        botonVerReviews.style.display = 'flex';
        botonPonerReviews.style.display = 'flex';
        botonEditar.style.display = 'flex';
        botonBorrar.style.display = 'flex';
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


/*Función para abrir el modal de añadir reviews*/

const modalPonerReviews = new bootstrap.Modal(document.getElementById('modalPonerReviews'));
const modalVerReviews = new bootstrap.Modal(document.getElementById('modalVerReviews'));
const frmAutor = document.getElementById('frmAutorReview');
const frmFechaReview = document.getElementById('frmFechaReview');
const frmPuntuacion = document.getElementById('frmPuntuacion');
const frmTexto = document.getElementById('frmTextoReview');

const botonVerReviews = document.getElementById('boton-ver-reviews');
const botonPonerReviews = document.getElementById('boton-poner-reviews');
const botonEditar = document.getElementById('boton-editar');


botonEditar.addEventListener('click', abrirModal);
botonPonerReviews.addEventListener('click', abrirModalPonerReviews);
botonVerReviews.addEventListener('click', abrirModalVerReviews);

function abrirModalPonerReviews() {
    if (selectedRow) {
        modalPonerReviews.show();
    }
}

function abrirModalVerReviews() {
    if (selectedRow) {
        cargarTablaReviews();
        modalVerReviews.show();
    }
}

/*Función para guardar la review*/
const botonGuardarReview = document.getElementById("boton-guardar-modal-review");
botonGuardarReview.addEventListener("click", async () => {
    modalPonerReviews.hide();

    const reviewData = {
        podcastId: selectedRow.dataset.id,
        autor: frmAutor.value,
        fecha: frmFechaReview.value,
        puntuacion: frmPuntuacion.value,
        texto: frmTexto.value,
    };

    await guardarReview(reviewData);
});

/*Función para enviar el fetch para la review*/
async function enviarFetchReview(url, metodo, body) {
    try {
        let req = {method: metodo};
        if (body) {
            req.body = JSON.stringify(body);
            req.headers = {"Content-type": "application/json"};
        }
        const respuesta = await fetch(url, req);
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
        if (respuesta.ok) {
            if (req.method === 'PUT') {
                showToast("Review editada con éxito");
            }
            if (req.method === 'POST') {
                showToast("Review guardada con éxito");
            }
            if (req.method === 'DELETE') {
                showToast("Review borrada con éxito");
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
async function guardarReview(reviewData) {
    return await enviarFetchReview("/reviews/", "POST", reviewData);
}

async function obtenerLasReviewsDeUnPodcast(podcastId) {
    return await enviarFetchReview(`/reviews?podcastId=${podcastId}`, "GET")
}


async function editarReview(id, reviewData) {
    return await enviarFetchReview(`/reviews/${id}`, "PUT", reviewData);
}

async function borrarReview(id) {
    return await enviarFetchReview(`/reviews/${id}`, "DELETE");
}


/*Función para cargar tabla de ver reviews*/
const tablaReviews = document.getElementById('cuerpo-tabla-reviews');

async function cargarTablaReviews() {
    let reviews;
    let reviewsConFechasJavaScript;
    if (selectedRow) {
        reviews = await obtenerLasReviewsDeUnPodcast(selectedRow.dataset.id);
        reviewsConFechasJavaScript = reviews.map(review => {
            let fecha = new Date(review.fecha);
            review.fechaFormateada = fecha.toLocaleDateString("es-ES", {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
            return review;
        });
        tablaReviews.innerHTML = plantillaReviews({reviews: reviewsConFechasJavaScript});
    }
}





