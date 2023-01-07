/*
TODO: Que al hacer hover sobre una fila de la tabla aparezca un dialogo con la imagen y una descripción del programa.
Que solo se pueda abrir el modal de editar teniendo seleccionada una fila.
El modal de edición debe abrirse con los datos de esa fila.

*/


const botonCerrar = document.querySelector('.boton-cerrar-reproductor');
const reproductorCompleto = document.getElementById('reproductor-completo');
const reproductor = document.querySelector('.reproductor');

botonCerrar.addEventListener('click', () => {
  reproductor.pause();
  reproductorCompleto.style.display = 'none';
  console.log(`Display del reproductor: ${reproductorCompleto.style.display}`);

});



const botonesPlay = document.querySelectorAll('.play-button-table');
for (const boton of botonesPlay) {
  boton.addEventListener('click', () => {
    reproductorCompleto.style.display = 'flex';

  });
}
document.getElementById('botonScroll').addEventListener('click', function () {
  document.getElementById('tabla').scrollIntoView({ behavior: 'smooth' });
});



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


const modal = new bootstrap.Modal(document.getElementById('informacion-podcast'));

document.getElementById('boton-editar').addEventListener('click', abrirModal);
document.getElementById('boton-insertar').addEventListener('click', abrirModal);
const inputSubida = document.getElementById('input-subida');

function abrirModal(evt) {
  if (evt.target.classList.contains('boton-insertar')) {
    inputSubida.classList.remove("d-none");
    modal.show();
  } else {
    inputSubida.classList.add("d-none");
    modal.show();
  }

}



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


