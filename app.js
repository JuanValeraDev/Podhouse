const bd = require("./bd.js");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.listen(80, () => console.log("Servicio escuchando"));
bd.conectar();


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
    if (podcast) res.location(`/podcasts/${podcast._id}`).status(201);
    else res.status(400);
});

app.put("/podcasts/:id", async (req, res) => {
    const podcastEditado = await bd.editar(req.params.id, req.body)
    if (podcastEditado === null) {
        res.status(404);
    } else if (podcastEditado === undefined) {
        res.status(400);
    } else {
        res.location(`/podcasts/${podcastEditado._id}`).status(201);
    }
});

app.delete("/podcasts/:id", async (req, res) => {
    if (await bd.borrar(req.params.id)) {
        res.status(204);
    } else {
        res.sendStatus(404);
    }
});