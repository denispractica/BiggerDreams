const { Month, Week } = require("./services");
const { delWeek } = require("./weeks");

const createWeek = async (name) => {
  let id = "";
  const newWeek = new Week({
    name: name,
    total: 0,
    payment: 0,
    tip: 0,
    investment: 0,
    profit: 0,
    workers: [],
  });
  await newWeek
    .save()
    .then((r) => (id = r.id))
    .catch((e) => console.log(e));

  return id;
};

//Actualiza Mes
const updateMonth = async (id, week, rp) => {
  const monthCard = await Month.find({ _id: id });
  if (monthCard.length > 0) {
    
    let newWeeks = monthCard[0].weeks;
    const newIdWeek = await createWeek(week.name);
    if (newIdWeek.length > 0) {
      newWeeks.push(newIdWeek);
      await monthCard[0]
        .updateOne({
          weeks: newWeeks,
        })
        .then((r) =>
          rp.send({
            response: "Se añadió la semana correctamente",
            erro: false,
          })
        )
        .catch((e) => rp.send({ response: "Algo salió mal", error: true }));
    } else {
      rp.status(500).send({ response: "Algo salió mal", error: true });
    }
  } else {
    rp.status(500).send({ response: "No se encuentra ese Mes", error: false });
  }
};

//Actualiza Mes Elimina Semana
const updateMonthDelWeek = async (mId, wId, week, rp) => {
  const monthCard = await Month.find({ _id: mId });
  if (monthCard.length > 0) {
    let newWeeks = monthCard[0].weeks;
    newWeeks = newWeeks.filter((w) => w.name !== week.name);
    await delWeek(wId).catch((e) =>
      rp.send({ response: "Algo salió mal", error: true })
    );
    await monthCard[0]
      .updateOne({
        weeks: newWeeks,
      })
      .then((r) =>
        rp.send({
          response: "Se eliminó la semana correctamente",
          erro: false,
        })
      )
      .catch((e) => rp.send({ response: "Algo salió mal", error: true }));
  } else {
    rp.status(500).send({
      response: "No se encuentra esa Semana",
      error: false,
    });
  }
};

//Obtener Todos los meses
const getMonths = async (id, rp) => {
  await Month.find({ _id: id })
    .populate({
      path: "weeks",
      populate: { path: "workers" },
    })
    .then((r) => rp.send({ response: r, error: false }))
    .catch((e) =>
      rp.status(400).send({ response: "Ocurrió un error", error: true })
    );
};

module.exports = {
  updateMonth,
  updateMonthDelWeek,
  getMonths,
};
