const { Inventory, Month, Week } = require("./services");

const createMonths = async () => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  let idMonths = [];
  for (let i = 0; i < 12; i++) {
    const m = new Month({
      name: `${months[i]}`,
      weeks: [],
    });
    await m
      .save()
      .then((r) => {
        idMonths.push(r.id);
      })
      .catch((e) => console.log(e));
  }
  return idMonths;
};

//Guardar Inventario
const setInventory = async (inventory, rp) => {
  const oldInventories = await Inventory.find({ year: inventory.year });
  if (oldInventories.length > 0) {
    rp.send({ response: "Ya tienes un inventario con ese año", error: false });
    return;
  } else {
    const idMonths = await createMonths();
    const dbInventoriesSave = new Inventory({
      year: inventory.year,
      months: idMonths,
    });
    await dbInventoriesSave
      .save()
      .then((r) =>
        rp.send({
          response: "Se ha creado correctamente el inventario",
          error: false,
        })
      )
      .catch((e) => {
        rp.send({
          response: "Ocurrió un error al crear el inventario",
          error: true,
          e,
        });
        console.log(e);
      });
  }
};

//Obtener Todos los inventarios
const getInventories = async (rp) => {
  await Inventory.find({})
    .populate({
      path: "months",
      populate: {
        path: "weeks",
        populate: { path: "workers" },
      },
    })
    .then((r) => rp.send({ response: r, error: false }))
    .catch((e) =>
      rp.status(400).send({ response: "Ocurrió un error", error: true })
    );
};

//Eliminar Inventario
const delInventory = async (id, rp) => {
  const delInventoryCard = await Inventory.find({ _id: id });
  if (delInventoryCard.length > 0) {
    const months = delInventoryCard[0].months;
    for (let i = 0; i < months.length; i++) {
      const monthsId = await Month.findById(months[i]);
      await Week.deleteMany({ _id: { $in: monthsId.weeks } });
    }
    await Month.deleteMany({ _id: { $in: delInventoryCard[0].months } });
    await delInventoryCard[0]
      .deleteOne({ _id: id })
      .then((r) => {
        rp.send({
          response: "Se ha eliminado correctamente el inventario",
          error: false,
        });
      })
      .catch((e) =>
        rp.status(500).send({
          response: "Ocurrió un error al eliminar la tarjeta",
          error: true,
          e,
        })
      );
  } else {
    rp.send({ response: "Ese inventario no existe", error: false });
  }
};

module.exports = {
  delInventory,
  getInventories,
  setInventory,
};
