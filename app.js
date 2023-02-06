require("dotenv").config();
const bd = require("./bd.js");
const express = require("express");
const app = express();
const PORT = process.env.PUERTO || 7000 || process.env.PORT;
app.use(express.json());
app.use(express.static('public'));


bd.conectar().then(() => {
    console.log("Conectado a la base de datos.");
    app.listen(PORT, () =>
        console.log(`Servidor escuchando en el puerto ${PORT}.`)
    );
}).catch(reason => console.log("Error al conectar a la base de datos" + reason));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

app.get("/podcasts", async (req, res) => {


    if (req.query.titulo) {
        let busqueda = req.query.titulo;

        res.json(await bd.buscar({titulo: busqueda}));
    } else {

        res.json(await bd.buscar({titulo:""}));
    }
});

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



