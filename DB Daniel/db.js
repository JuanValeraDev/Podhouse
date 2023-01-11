require("dotenv").config();
const mongoose = require("mongoose");

const WineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minLength: 1 },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Tinto", "Blanco", "Rosado"],
    },
    year: { type: Number, min: 1800, max: new Date().getFullYear() },
    scores: [Number],
  },
  {
    methods: {
      rate: async function (score) {
        this.scores.push(score);
        return await this.save();
      },
    },
    virtuals: {
      averageScore: {
        get() {
          if (this.scores.length > 0)
            return (
              this.scores.reduce((acc, value) => acc + value, 0) /
              this.scores.length
            ).toFixed(1);
          else return NaN;
        },
      },
    },
    toJSON: { virtuals: true },
  }
);

const Wine = new mongoose.model("Wine", WineSchema);

exports.connect = async function () {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGODB_URL);
};

exports.close = async function () {
  await mongoose.disconnect();
};

exports.find = async function (params) {
  const query = Wine.find()
    .where("year")
    .gte(Number(params.desde))
    .where("year")
    .lte(Number(params.hasta))
    .where("type")
    .in(params.tipos);
  const palabras = params.busqueda
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (palabras.length > 0) {
    let patrones = [];
    palabras.forEach((palabra) => {
      patrones.push({ name: new RegExp(palabra, "i") });
    });
    query.or(patrones);
  }
  return await query.exec();
};

exports.findById = async function (wineId) {
  return await Wine.findById(wineId);
};

exports.save = async function (wineData) {
  try {
    const wine = new Wine(wineData);
    return await wine.save();
  } catch (err) {
    return undefined;
  }
};

exports.rate = async function (wineId, score) {
  const wine = await Wine.findById(wineId);
  if (wine) return await wine.rate(score);
  else return undefined;
};

exports.delete = async function (wineId) {
  return (await Wine.deleteOne({ _id: wineId })).deletedCount == 1;
};
