const mongoose = require("mongoose");

const PodcastSchema = mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true, minLength: 3 },
        episodio: { type: Number, required: true },
        temporada: { type: Number, required: true },
        fecha: {type: Date, required:true},
        imagen: { type: String, required: true },
        audio: { type: String, required: true }
    }
);

const Podcast = new mongoose.model("Podcast", PodcastSchema);

exports.conectar = async function () {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0");
};
exports.cerrarConexion = async function () {
    await mongoose.disconnect();
};
exports.buscar = async function (params) {
    const consulta = Podcast.find();
    const palabras = params.titulo
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    if (palabras.length > 0) {
        let patrones = [];
        palabras.forEach((palabra) => {
            patrones.push({ titulo: new RegExp(palabra, "i") });
        });
        consulta.and(patrones);
    }
    return await consulta.exec();
};


exports.guardar = async function (podcastData) {
    try {
        const podcast = new Podcast(podcastData);
        const resultado = await podcast.save();
        return resultado;
    } catch (err) {
        return undefined;
    }
};

exports.encontrarPorId = async function (id) {
    return await Podcast.findById(id);
};

exports.editar = async function (id, podcastData) {
    try{
    const podcast = await exports.encontrarPorId(id); 
    console.log(podcast);
    if(podcast===null){
        return null;
    }
    await Object.assign(podcast, podcastData);
    await podcast.save();
    return podcast;
    }catch(err){
        return undefined;
    }
};

exports.borrar = async function (id) {
    return (await Podcast.deleteOne({ _id: id })).deletedCount == 1;
}