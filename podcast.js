/*
TODO: La busqueda no funciona bien, devuelve siempre array vacío.
Faltan comprobar el resto de métodos. El alta sí lo hace bien.
*/

const bd = require(".\\bd.js");



async function main() {
    await bd.conectar();
   /* const podcast1 = await bd.guardar({
        titulo: "JOJOJOJOJO", episodio: 4, temporada: 5,
        fecha: "21/05/2021", imagen: "img/AHD.jpg", audio: "audios/AHD 1x98 22_12_2022.mp3"
    })*/
 
  /*  const editado= await bd.editar("63bff5cdd2122dd4b54775a1",  {titulo: "jeje", episodio: 4, temporada: 5,
    fecha: "21/05/2021", imagen: "x", audio: "x"})
    console.log(editado)*/
    const busqueda=await bd.buscar({titulo:"dragones"});
    console.log(busqueda)

    await bd.cerrarConexion();

}
main()