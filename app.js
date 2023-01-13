
const bd = require("./bd.js");
const express = require("express");
const app = express();



app.use(express.json());


app.use(express.static("public"));
app.listen(80, () => console.log("Servicio escuchando"));


async function main() {
  await bd.conectar();
  /*
  const podcast1 = await bd.guardar({
      titulo: "Las noches de Ortega", episodio: 4, temporada: 5,
      fecha: new Date(2020,02,03), imagen: "img/AHD.jpg", audio: "audios/AHD 1x98 22_12_2022.mp3"
  })
  console.log(podcast1);*/

  /*  const editado= await bd.editar("63bff5cdd2122dd4b54775a1",  {titulo: "jeje", episodio: 4, temporada: 5,
    fecha: "21/05/2021", imagen: "x", audio: "x"})
    console.log(editado)*/
  /*const busqueda=await bd.buscar({titulo:"dragones"});
    console.log(busqueda)
*/
 /* const podcast3 = await bd.editar("63c063d9e31da87b7fdbbf29", {
    titulo: "ahoraEditado",
    episodio: 2,
    temporada: 3,
    fecha: new Date(2020, 03, 03),
    imagen: "si",
    audio: "no"
  })
  console.log(podcast3);
*//*
  const podcast4=await bd.borrar("63c063d9e31da87b7fdbbf29")
  console.log(podcast4);*/

  const resultados =await bd.buscar();
  const tabla = document.getElementById("cuerpo-tabla");
/*Aquí falta compilar los datos en la plantilla*/

  await bd.cerrarConexion();
}
main()