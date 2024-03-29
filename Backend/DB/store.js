const { newStore } = require("./services");
const fs = require("fs");
const path = require("path");

//Guardar Tarjeta
const setStowageCard = async (stowageCard, url, rp) => {
  const oldCard = await newStore.find({ productName: stowageCard.productName });

  if (oldCard.length > 0) {
    rp.send({ response: "Ya tienes una tarjeta con ese nombre", error: false });
    return;
  } else {
    const dbSave = new newStore({
      productName: stowageCard.productName,
      productSpecificity: stowageCard.productSpecificity,
      unitOfMeasurement: stowageCard.unitOfMeasurement,
      price: stowageCard.price,
      coin: stowageCard.coin,
      history: stowageCard.history,
      urlImage: url,
      historyInversion:
        stowageCard.history.length > 0
          ? [
              {
                data: stowageCard.history[0].data,
                inversion: stowageCard.price * stowageCard.history[0].entrance,
                coin: stowageCard.coin,
                price: stowageCard.price,
                unit: stowageCard.history[0].entrance,
              },
            ]
          : [],
    });
    await dbSave
      .save()
      .then((r) =>
        rp.send({
          response: "Se ha guardado correctamente la tarjeta",
          error: false,
        })
      )
      .catch((e) =>
        rp.send({
          response: "Ocurrió un error al guardar la tarjeta",
          error: true,
        })
      );
  }
};

//Actualizar Tarjeta
const updateStowageCard = async (stowageCard, id, rp) => {
  const updateCard = await newStore.find({ _id: id });
  if (updateCard.length === 0) {
    rp.status(500).send({
      response: "No se encontró esa tarjeta",
      error: true,
    });
    return;
  } else {
    let newHistory = updateCard[0].history;
    let newPrice = updateCard[0].price;
    let newCoin = updateCard[0].coin;
    let newUrlImage = updateCard[0].urlImage;
    let newHistoryInversion = updateCard[0].historyInversion;
    if (stowageCard.history) {
      newHistory = stowageCard.history;
      if (newHistory.length > 0) {
        newHistoryInversion = [];
        for (let i = 0; i < newHistory.length; i++) {
          if (newHistory[i].entrance > 0) {
            newHistoryInversion.push({
              data: newHistory[i].data,
              inversion: newHistory[i].presentPrice * newHistory[i].entrance,
              coin: newHistory[i].presentCoin,
              price: newHistory[i].presentPrice,
              unit: newHistory[i].entrance,
            });
          }
        }
      }
    }
    if (stowageCard.price) {
      newPrice = stowageCard.price;
      newCoin = stowageCard.coin;
    }
    if (stowageCard.urlImage) {
      newUrlImage = stowageCard.urlImage;
    }

    await newStore
      .updateOne(
        { _id: id },
        {
          price: newPrice,
          coin: newCoin,
          history: newHistory,
          urlImage: newUrlImage,
          historyInversion: newHistoryInversion,
        }
      )
      .then((r) =>
        rp.send({
          response: "Se ha actualizado correctamente la tarjeta",
          error: false,
        })
      )
      .catch((e) =>
        rp.status(500).send({
          response: "Ocurrió un error al actualizar la tarjeta",
          error: true,
        })
      );
  }
};

//Eliminar Imagen de la tarjeta
const deleteImageStore = async (id) => {
  const delImageCard = await newStore.find({ _id: id });
  if (delImageCard.length > 0) {
    let nameDelete = "";

    if (delImageCard[0].urlImage !== "") {
      nameDelete = path.basename(delImageCard[0].urlImage);
    }
    if (nameDelete !== "") {
      const ruta = `./uploads/${nameDelete}`;
      fs.unlink(ruta, (e) => {
        if (e) {
          rp.status(500).send({
            response: "Ocurrió un error al eliminar la imagen",
            error: true,
          });
        }
      });
    }
  }
};

//Eliminar Tarjeta
const delStowageCard = async (id, rp) => {
  const delCard = await newStore.find({ _id: id });
  if (delCard.length > 0) {
    let nameDelete = "";
    if (delCard[0].urlImage !== "") {
      nameDelete = path.basename(delCard[0].urlImage);
    }

    await newStore
      .deleteOne({ _id: id })
      .then((r) => {
        if (nameDelete !== "") {
          const ruta = `./uploads/${nameDelete}`;
          fs.unlink(ruta, (e) => {
            if (e) {
              rp.status(500).send({
                response: "Ocurrió un error al eliminar la tarjeta",
                error: true,
              });
            }
          });
        }

        rp.send({
          response: "Se ha eliminado correctamente la tarjeta",
          error: false,
        });
      })
      .catch((e) =>
        rp.status(500).send({
          response: "Ocurrió un error al eliminar la tarjeta",
          error: true,
        })
      );
  } else {
    rp.send({ response: "Esa tarjeta no existe", error: false });
  }
};

//Obtener todas las tarjetas
const getStowageCard = async (rp) => {
  await newStore
    .find({})
    .then((r) => rp.send({ response: r, error: false }))
    .catch((e) =>
      rp.status(400).send({ response: "Ocurrió un error", error: true })
    );
};

//Obtener Tarjeta por id
const getStowageCardId = async (id, rp) => {
  await newStore
    .find({ _id: id })
    .then((r) => {
      const update = {
        history: r[0].history,
        price: r[0].price,
        coin: r[0].coin,
        urlImage: r[0].urlImage,
        historyInversion: r[0].historyInversion,
      };
      rp.send({ response: update, error: false });
    })
    .catch((e) =>
      rp.status(400).send({ response: "Ocurrió un error", error: true })
    );
};

module.exports = {
  setStowageCard,
  updateStowageCard,
  deleteImageStore,
  delStowageCard,
  getStowageCard,
  getStowageCardId,
};
