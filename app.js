require("dotenv").config();
const bd = require("./bd.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || process.env.PUERTO || 80;
app.use(express.json());
app.use(express.static("public"));

bd.conectar(process.env.MONGODB_URL);
app.listen(80, () => console.log("Servicio escuchando"));
/*bd.conectar().then(() => {
    console.log("Conectado a la base de datos.");
    app.listen(PORT, () =>
        console.log(`Servidor escuchando en el puerto ${PORT}.`)
    );
});*/


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

app.get("/podcasts", async (req, res) => {
    res.json(await bd.buscar({titulo: ""}));
});

/* app.get("/podcasts/:id", async (req, res) => {
   const podcast = await bd.encontrarPorId(req.params.id);
   if (podcast) res.json(podcast);
   else res.status(404);
 });*/

app.post("/podcasts", async (req, res) => {
    const podcast = await bd.guardar(req.body);
    if (podcast) res.location(`/podcasts/${podcast._id}`).status(201).send();
    else res.status(400).send();
});

app.put("/podcasts/:id", async (req, res) => {
    const podcastEditado = await bd.editar(req.params.id, req.body)
    if (podcastEditado === null) {
        res.status(404).send();
    } else if (podcastEditado === undefined) {
        res.status(400).send();
    } else {
        res.location(`/podcasts/${podcastEditado._id}`).status(201).send();
    }
});

app.delete("/podcasts/:id", async (req, res) => {
    if (await bd.borrar(req.params.id)) {
        res.status(204).send();
    } else {
        res.sendStatus(404).send();
    }
});