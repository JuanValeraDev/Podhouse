
const bd = require("./bd.js");
const express = require("express");
const app = express();



app.use(express.json());


app.use(express.static("public"));
app.listen(80, () => console.log("Servicio escuchando"));


bd.connect().then(() => {
  app.listen(80);
});

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