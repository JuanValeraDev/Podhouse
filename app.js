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
    try {
        if (req.query.titulo) {
            let busqueda = req.query.titulo;
            res.set("Content-type", "application/json").status(200).json(await bd.buscar({titulo: busqueda}));
        } else {
            res.set("Content-type", "application/json").status(200).json(await bd.buscar({titulo: ""}));
        }
    } catch (e) {
        res.status(400).send();
    }
});

app.get("/podcasts/:id", async (req, res) => {
    try {
        const podcastEncontrado = await bd.encontrarPorId(req.params.id);
        if (podcastEncontrado) {
            res.status(200).json(podcastEncontrado);
        } else {
            res.status(400).send();
        }
    } catch (e) {
        res.status(400).send();
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
        res.status(204).send();
    }
});

app.delete("/podcasts/:id", async (req, res) => {
    if (await bd.borrar(req.params.id)) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});


app.get("/reviews", async (req, res) => {
    try {
        res.status(200).json(await bd.buscarReview({podcastId: req.query.podcastId}));
    } catch (e) {
        res.status(404).send();
    }
});

app.get("/reviews/:id", async (req, res) => {
    try {
        const reviewEncontrada = await bd.encontrarReviewPorId(req.params.id);
        if (reviewEncontrada) {
            res.status(200).json(reviewEncontrada);
        } else {
            res.status(400).send();
        }
    } catch (e) {
        res.status(400).send();
    }
});

app.post("/reviews", async (req, res) => {
    const review = await bd.guardarReview(req.body);
    if (review) res.location(`/reviews/${review._id}`).status(201).send();
    else res.status(400).send();
});

app.put("/reviews/:id", async (req, res) => {
    const reviewEditada = await bd.editarReview(req.params.id, req.body)
    if (reviewEditada === null) {
        res.status(404).send();
    } else if (reviewEditada === undefined) {
        res.status(400).send();
    } else {
        res.status(204).send();
    }
});

app.delete("/reviews/:id", async (req, res) => {
    if (await bd.borrarReview(req.params.id)) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});



