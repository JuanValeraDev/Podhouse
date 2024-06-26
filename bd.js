const mongoose = require("mongoose");

const PodcastSchema = mongoose.Schema(
    {
        titulo: {type: String, required: true, trim: true, minLength: 3},
        duracion: {type: String, required: true},
        episodio: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
            validate: function (value) {
                if (value < 0) {
                    throw new Error();
                }
                return true;
            }
        },
        temporada: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
            default: 1,
            validate: function (value) {
                if (value < 0) {
                    throw new Error();
                }
                return true;
            }
        },
        fecha: {type: Date, required: true},
        imagen: {type: String, required: true},
        audio: {type: String, required: true}
    }
);

const ReviewSchema = mongoose.Schema({
    podcastId: {type: String, required: true},
    autor: {type: String, required: true},
    fecha: {type: Date},
    puntuacion: {type: Number, required: true},
    texto: {type: String}
})
PodcastSchema.methods.siguienteEpisodio = async function () {
    let titulo = this.titulo
    let episodio = this.episodio + 1;
    let temporada = this.temporada;
    let resultado = await Podcast.findOne({
        titulo, episodio, temporada
    });
    if (resultado === undefined) {
        throw new Error("No se ha encontrado el siguiente podcast")
    }
    return resultado;
};


const Podcast = new mongoose.model("Podcast", PodcastSchema);
const Review = new mongoose.model("Review", ReviewSchema);

exports.conectar = async function () {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URL);
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
            patrones.push({titulo: new RegExp(palabra, "i")});
        });
        consulta.and(patrones);
    }
    return await consulta.exec();
};


exports.guardar = async function (podcastData) {
    try {
        const podcast = new Podcast(podcastData);
        return await podcast.save();
    } catch (err) {
        return undefined;
    }
};

exports.encontrarPorId = async function (id) {
    try {
        const podcast = Podcast.findById(id);
        if (podcast === null) {
            return null;
        }
        return podcast;
    } catch (e) {
        return undefined;
    }
};

exports.editar = async function (id, podcastData) {
    try {
        const podcast = await exports.encontrarPorId(id);
        if (podcast === null) {
            return null;
        }
        await Object.assign(podcast, podcastData);
        await podcast.save();
        return podcast;
    } catch (err) {
        return undefined;
    }
};

exports.borrar = async function (id) {
    return (await Podcast.deleteOne({_id: id})).deletedCount === 1;
}
exports.buscarReview = async function (params) {
    const consulta = Review.find();
    const podcastId = {podcastId: params.podcastId};
    consulta.and(podcastId);
    return await consulta.exec();
};



exports.guardarReview = async function (reviewData) {
    try {
        const review = new Review(reviewData);
        return await review.save();
    } catch (err) {
        return undefined;
    }
};

exports.encontrarReviewPorId = async function (id) {
    try {
        const review = Review.findById(id);
        if (review === null) {
            return null;
        }
        return review;
    } catch (e) {
        return undefined;
    }
};

exports.editarReview = async function (id, reviewData) {
    try {
        const review = await exports.encontrarReviewPorId(id);
        if (review === null) {
            return null;
        }
        await Object.assign(review, reviewData);
        await review.save();
        return review;
    } catch (err) {
        return undefined;
    }
};

exports.borrarReview = async function (id) {
    return (await Review.deleteOne({_id: id})).deletedCount === 1;
}

