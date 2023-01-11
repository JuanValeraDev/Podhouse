const mongoose = require("mongoose");

const PodcastSchema = mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true, minLength: 3 },
        episodio: { type: Number, required: true },
        temporada: { type: Number, required: true },
        fecha: Date,
        imagen: { type: String, required: true },
        audio: { type: String, required: true }
    }
);

const PodCast = new mongoose.model("PodCast", PodcastSchema);

exports.conectar = async function () {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0");
};
exports.cerrarConexion = async function () {
    await mongoose.disconnect();
};
exports.buscar = async function (args) {
    const consulta = PodCast.find();
    const palabras = args.busqueda
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    if (palabras.length > 0) {
        let patrones = [];
        palabras.forEach((palabra) => {
            patrones.push({ name: new RegExp(palabra, "i") });
        });
        consulta.and(patrones);
    }
};
exports.encontrarPorId = async function (id) {
    return await PodCast.findByID(id);
};

exports.guardar = async function (podcastData) {
    try {
        const podcast = new Podcast(podcastData);
        return await podcast.save();
    } catch (err) {
        return undefined;
    }
};

exports.reemplazarDatos = async function (podcastData) {
    this.titulo=podcastData.titulo;
    this.episodio=podcastData.episodio;
    this.temporada=podcastData.temporada;
    this.fecha=podcastData.fecha;
    this.imagen=podcastData.imagen;
};

exports.editar = async function (id, podcastData) {
    const podcast = await encontrarPorId(id);
    podcast.reemplazarDatos(podcastData);
    podcast.save();
};


exports.borrar = async function (id) {
    const resultado = PodCast.deleteOne({ _id: id });
    return resultado;
}