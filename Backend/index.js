const express = require("express");
const cors = require("cors");
const app = express();
//Store
const {
  setStowageCard,
  updateStowageCard,
  getStowageCard,
  delStowageCard,
  getStowageCardId,
  deleteImageStore,
} = require("./DB/store");
//Inventory
const {
  setInventory,
  getInventories,
  delInventory,
} = require("./DB/inventory");
//Week
const {
  updateWeekWorker,
  delWorkerWeek,
  updateWeeksetWorker,
} = require("./DB/weeks");
//Month
const { updateMonth, getMonths, updateMonthDelWeek } = require("./DB/months");
//Worker
const {
  setWorker,
  updateWorker,
  getWorkers,
  delImageWorker,
  delWorker,
} = require("./DB/workers");

const { upload } = require("./Util/upload");
app.listen(process.env.PORT || 1507, () =>
  console.log("App activa en http://localhost:1507")
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.static("uploads"));

//Store-----------------------------------
app.post("/setStowageCard", upload, (rq, rp) => {
  const domain = rq.get("host");
  const protocol = rq.protocol;
  const nameImage = rq.file?.filename;
  const data = JSON.parse(rq.body.data);
  if (nameImage) {
    const fullUrl = `${protocol}://${domain}/${nameImage}`;
    setStowageCard(data, fullUrl, rp);
  } else {
    setStowageCard(data, "", rp);
  }
});

app.patch("/updateStowageCard/:id", upload, (rq, rp) => {
  const domain = rq.get("host");
  const protocol = rq.protocol;
  const nameImage = rq.file?.filename;
  if (nameImage) {
    deleteImageStore(rq.params.id);
    const fullUrl = `${protocol}://${domain}/${nameImage}`;
    const stowageCard = {
      urlImage: fullUrl,
    };
    updateStowageCard(stowageCard, rq.params.id, rp);
  } else {
    updateStowageCard(rq.body, rq.params.id, rp);
  }
});

app.get("/getStowageCard", (rq, rp) => {
  getStowageCard(rp);
});

app.get("/getStowageCard/:id", (rq, rp) => {
  getStowageCardId(rq.params.id, rp);
});

app.delete("/delStowageCard/:id", (rq, rp) => {
  delStowageCard(rq.params.id, rp);
});
//------------------------------------------------------------------

//Weeks-----------------------------------------
app.patch("/delWorkerWeek/:id/:name", (rq, rp) => {
  delWorkerWeek(rq.params.id, rq.params.name, rp);
});
app.patch("/updateWeeksetWorker/:id", (rq, rp) => {
  updateWeeksetWorker(rq.params.id, rq.body, rp);
});

app.patch("/updateWeekWorker/:id/:name", (rq, rp) => {
  updateWeekWorker(rq.body, rq.params.id, rq.params.name, rp);
});
//--------------------------------------------------------------
//Months-----------------------------------------
app.patch("/updateMonth/:id", (rq, rp) => {
  updateMonth(rq.params.id, rq.body, rp);
});
app.get("/getMonths/:id", (rq, rp) => {
  getMonths(rq.params.id, rp);
});
app.patch("/updateMonthDelWeek/:mId/:wId", (rq, rp) => {
  updateMonthDelWeek(rq.params.mId, rq.params.wId, rq.body, rp);
});
//--------------------------------------------------------------------
//Inventory---------------------------------------
app.post("/setInventory", (rq, rp) => {
  setInventory(rq.body, rp);
});

app.get("/getInventories", (rq, rp) => {
  getInventories(rp);
});

app.delete("/delInventory/:id", (rq, rp) => {
  delInventory(rq.params.id, rp);
});
//-----------------------------------------------------
//Worker-------------------------------------------------
app.get("/getWorkers", (rq, rp) => {
  getWorkers(rp);
});
app.post("/setWorker", upload, (rq, rp) => {
  const domain = rq.get("host");
  const protocol = rq.protocol;
  const nameImage = rq.file?.filename;
  const data = JSON.parse(rq.body.data);
  if (nameImage) {
    const fullUrl = `${protocol}://${domain}/${nameImage}`;
    setWorker(data, fullUrl, rp);
  } else {
    setWorker(data, "", rp);
  }
});
app.delete("/delWorker/:name", (rq, rp) => {
  delWorker(rq.params.name, rp);
});
app.patch("/updateWorker", upload, (rq, rp) => {
  const domain = rq.get("host");
  const protocol = rq.protocol;
  const nameImage = rq.file?.filename;
  const data = JSON.parse(rq.body.data);
  if (nameImage) {
    delImageWorker(data);
    const fullUrl = `${protocol}://${domain}/${nameImage}`;
    updateWorker(data, fullUrl, rp);
  } else {
    updateWorker(data, "", rp);
  }
});
//-----------------------------------------------
