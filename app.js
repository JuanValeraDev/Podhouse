
const bd = require("./bd.js");
const express = require("express");
const app = express();



app.use(express.json());


app.use(express.static("public"));
app.listen(80, () => console.log("Servicio escuchando"));


bd.conectar();

/*Pasar fecha a String */
let date = new Date(2020, 01, 02);
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
let fechaString = `${year}-${month}-${day}`;
//Función para meter cuatro podcast a piñón.

// async function borrarEstaFuncion() {
//   const resultado = await bd.guardar({
//     titulo: "Las noches de Ortega",
//     episodio: 2,
//     temporada: 3,
//     fecha: fechaString,
//     imagen: "/img/Ortega.png",
//     audio: "/audios/Ortega.mp3"
//   });
//   console.log(resultado);
//   const resultado2 = await bd.guardar({
//     titulo: "Movidas Minusculas",
//     episodio: 2,
//     temporada: 3,
//     fecha: fechaString,
//     imagen: "/img/MM.jpg",
//     audio: "/audios/MM.mp3"
//   });
//   console.log(resultado2);
//   const resultado3 = await bd.guardar({
//     titulo: "Comedia Perpetua",
//     episodio: 2,
//     temporada: 3,
//     fecha: fechaString,
//     imagen: "/img/CP.jpg",
//     audio: "/audios/CP.mp3"
//   });
//   console.log(resultado3);
//   const resultado4 = await bd.guardar({
//     titulo: "Aquí hay dragones",
//     episodio: 2,
//     temporada: 3,
//     fecha: fechaString,
//     imagen: "/img/AHD.jpg",
//     audio: "/audios/AHD.mp3"
//   });
//   console.log(resultado4);
// }
// borrarEstaFuncion();



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
});

app.get("/podcasts", async (req, res) => {
  res.json(await bd.buscar({ titulo: "" }));
});

app.get("/podcasts/:id", async (req, res) => {
  const podcast = await bd.encontrarPorId(req.params.id);
  if (podcast) res.json(podcast);
  else res.status(404).send(`No existe un podcast con ID=${req.params.id}.`);
});

app.post("/podcasts", async (req, res) => {
  const podcast = await bd.guardar(req.body);
  if (podcast) res.location(`/podcasts/${podcast._id}`).status(201).send("Podcast creado");
  else res.status(400).send("Error, has introducido valores incorrectos.");
});

app.put("/podcasts/:id", async (req, res) => {
  const podcastEditado = await bd.editar(req.params.id, req.body)
  if (podcastEditado) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/podcasts/:id", async (req, res) => {
  if (await bd.borrar(req.params.id)) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404);
  }
});