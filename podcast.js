/*
TODO: La busqueda no funciona bien, devuelve siempre array vacío.
Faltan comprobar el resto de métodos. El alta sí lo hace bien.
*/

const bd = require(".\\bd.js");



async function main() {
    await bd.conectar();
    /*const podcast1 = await bd.guardar({
        titulo: "jjajajaaj", episodio: 4, temporada: 5,
        fecha: "21/05/2021", imagen: "img/AHD.jpg", audio: "audios/AHD 1x98 22_12_2022.mp3"
    })*/
    

    const busqueda = await bd.buscar({titulo:"dragones"});
    for (resultado in busqueda){
        console.log(resultado);
    }

}
main()