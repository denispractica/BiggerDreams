const { Worker } = require("./services");
const fs = require("fs");
const path = require("path");

//Guardar Trabajador
const setWorker = async (worker, url, rp) => {
  const oldCard = await Worker.find({ name: worker.name });

  if (oldCard.length > 0) {
    rp.send({
      response: "Ya tienes un trabajador con ese nombre",
      error: false,
    });
    return;
  } else {
    const dbSave = new Worker({
      name: worker.name,
      ocupation: worker.ocupation,
      urlImage: url,
      percentOf: worker.percentOf,
    });
    await dbSave
      .save()
      .then((r) =>
        rp.send({
          response: `Se ha añadido correctamente a ${worker.name}`,
          error: false,
        })
      )
      .catch((e) =>
        rp.send({
          response: "Ocurrió un error al añadir el trabajador",
          error: true,
        })
      );
  }
};
//Eliminar Imagen de la tarjeta
const delImageWorker = async (worker) => {
  const delImageCard = await Worker.find({ name: worker.name });
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

//Eliminar Trabajador
const delWorker = async (name, rp) => {
  const workerCard = await Worker.find({ name: name });
  if (workerCard.length > 0) {
    let nameDelete = "";
    if (workerCard[0].urlImage !== "") {
      nameDelete = path.basename(workerCard[0].urlImage);
    }
    await Worker.deleteOne({ name: name })
      .then((r) => {
        if (nameDelete !== "") {
          const ruta = `./uploads/${nameDelete}`;
          fs.unlink(ruta, (e) => {
            if (e) {
              rp.status(500).send({
                response: "Ocurrió un error al eliminar el trabajador",
                error: true,
              });
            }
          });
        }
        rp.send({
          response: "Se ha eliminado correctamente el trabajador",
          error: false,
        });
      })
      .catch((e) =>
        rp.status(500).send({
          response: "Ocurrió un error al eliminar el trabajador",
          error: true,
        })
      );
  } else {
    rp.send({ response: "Ese trabajador no existe", error: false });
  }
};

//Obtener todos los trabajadores
const getWorkers = async (rp) => {
  await Worker.find({})
    .then((r) => rp.send({ response: r, error: false }))
    .catch((e) =>
      rp.status(400).send({ response: "Ocurrió un error", error: true })
    );
};

//Actualizar Trabajador
const updateWorker = async (worker, url, rp) => {
  const updateCard = await Worker.find({ name: worker.name });
  if (updateCard.length === 0) {
    rp.status(500).send({
      response: "No se encontró ese trabajador",
      error: true,
    });
    return;
  } else {
    let newUrlImage = updateCard[0].urlImage;

    if (url.length > 0) {
      newUrlImage = url;
    }

    await updateCard[0]
      .updateOne({
        ocupation: worker.ocupation,
        urlImage: newUrlImage,
        percentOf: worker.percentOf,
      })
      .then((r) =>
        rp.send({
          response: "Se ha actualizado correctamente al trabajador",
          error: false,
        })
      )
      .catch((e) =>
        rp.status(500).send({
          response: "Ocurrió un error al actualizar al trabajador",
          error: true,
        })
      );
  }
};

module.exports = {
  delWorker,
  setWorker,
  getWorkers,
  updateWorker,
  delImageWorker,
};
