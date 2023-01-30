/*
* TODO: El problema que estoy teniéndo es que el servicio de hosting de Render
*  está recibiendo el archivo plantillaPodcasts.js con un tipo MIME "text/html" y por eso
*  no lo está ejecutando como javascript, lo cual está haciendo que no se cargen las filas de la tabla.
*  He probado en el express.static a indicarle que si el archivo es .js lo envíe con la cabecera
*  'application/javascript' pero cuando vuelvo a levantar el servicio en la web, la consola del
*   navegador sigue diciendo que está recibiendo el archivo "plantillaPodcasts.js" como MIME text.*/

require("dotenv").config();
const bd = require("./bd.js");
const express = require("express");
const app = express();
const PORT = process.env.PUERTO || 7000 ||process.env.PORT;
app.use(express.json());
app.use(express.static('public', {
    setHeaders: function (res, path) {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));



bd.conectar().then(() => {
    console.log("Conectado a la base de datos.");
    app.listen(PORT, () =>
        console.log(`Servidor escuchando en el puerto ${PORT}.`)
    );
}).catch(reason => console.log("Error al conectar a la base de datos"+reason));


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



