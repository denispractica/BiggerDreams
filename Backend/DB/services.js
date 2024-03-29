const db = require("mongoose");

//Conexión----------------------------------
const url = `mongodb://localhost:27017/dataBase`;

db.connect(process.env.MONGODB_URI || url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((r) => console.log("Conexión Exitosa a la DB"))
  .catch((e) => console.log("Ocurrió un error", e));

//Creación del Schema------------------------------------------
const { Schema } = db;

const store = new Schema({
  productName: String,
  productSpecificity: String,
  unitOfMeasurement: String,
  price: Number,
  coin: String,
  history: [],
  urlImage: String,
  historyInversion: [],
});

const workerShema = new Schema({
  name: String,
  ocupation: String,
  urlImage: String,
  percentOf: String,
});

const weekSchema = new Schema({
  name: String,
  total: Number,
  payment: Number,
  tip: Number,
  investment: Number,
  profit: Number,
  workers: [],
});

const monthSchema = new Schema({
  name: String,
  weeks: [
    {
      type: db.Schema.Types.ObjectId,
      ref: "Week",
    },
  ],
});

const inventorySchema = new Schema({
  year: Number,
  months: [
    {
      type: db.Schema.Types.ObjectId,
      ref: "Month",
    },
  ],
});

//Nombre de la tabla de la BD---------------------------------------
const newStore = db.model("store", store);
const Inventory = db.model("Inventory", inventorySchema);
const Month = db.model("Month", monthSchema);
const Week = db.model("Week", weekSchema);
const Worker = db.model("Worker", workerShema);
module.exports = {
  newStore,
  Week,
  Month,
  Inventory,
  Worker,
};
