/*

TODO: Al pinchar en una fila de la tabla ya seleccionada, que se deseleccione
*/


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
      row.style.backgroundColor = '#251749';
      row.style.color = '#FFFBEB';
      if (selectedRow) {
        selectedRow.style.backgroundColor = '';
        selectedRow.style.color = ''
      }
      selectedRow = row;
    }
  }
});






// ---- Modal -----
const modal = new bootstrap.Modal(document.getElementById('informacion-podcast'));


document.getElementById('boton-editar').addEventListener('click', abrirModal);
document.getElementById('boton-insertar').addEventListener('click', abrirModal);
function abrirModal(evt) {
  modal.show();
}
  
