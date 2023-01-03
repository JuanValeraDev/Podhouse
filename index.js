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
document.getElementById('botonScroll').addEventListener('click', function() {
  document.getElementById('tabla').scrollIntoView({behavior:'smooth'});
});


const tabla = document.getElementById("tabla");
let selectedRow;

for (let i = 0; i < tabla.rows.length; i++) {
  tabla.rows[i].addEventListener("click", function() {
    // Si ya hay una fila seleccionada, restaura su color original
    if (selectedRow) {
      selectedRow.style.backgroundColor = "";
      selectedRow.style.color="";
    }
    // Establece el color de fondo de la fila seleccionada
    this.style.backgroundColor = "rgb(37, 23, 73)";
    this.style.color="rgb(255, 251, 235)";
    // Almacena el id de la fila seleccionada
    selectedRow = this;
  });
}


