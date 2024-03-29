const { Week } = require("./services");

//Eliminar Semana
const delWeek = async (id) => {
  const weekCard = await Week.find({ _id: id });
  if (weekCard.length > 0) {
    await weekCard[0].deleteOne({ _id: id }).catch((e) => e);
  }
};

//SetWorker
const updateWeeksetWorker = async (wId, workers, rp) => {
  const oldWeek = await Week.find({ _id: wId });

  if (oldWeek.length > 0) {
    let newWorkers = [];
    for (let i = 0; i < workers.workers.length; i++) {
      const auxWorker = {
        name: workers.workers[i].name,
        ocupation: workers.workers[i].ocupation,
        urlImage: workers.workers[i].urlImage,
        total: 0,
        payment: 0,
        tip: 0,
        investment: 0,
        profit: 0,
        percentOf: workers.workers[i].percentOf,
      };
      newWorkers.push(auxWorker);
    }

    const newWeekWorkers = [...oldWeek[0].workers, ...newWorkers];

    oldWeek[0]
      .updateOne({
        workers: newWeekWorkers,
      })
      .then((r) => {
        rp.send({
          response:
            newWorkers.length > 1
              ? "Se agregaron los trabajadores correctamente"
              : "Se agregó al trabajador correctamente",
          error: false,
        });
      })
      .catch((e) =>
        rp.status(500).send({
          response: "Ocurrió un error al agregar el trabajador",
          error: true,
        })
      );
  } else {
    rp.send({ response: "No se encuentra esa semana", error: false });
    return;
  }
};

//Eliminar Trabajador
const delWorkerWeek = async (weekId, workerName, rp) => {
  const oldWeek = await Week.find({ _id: weekId });
  if (oldWeek.length > 0) {
    const newWorkers = oldWeek[0].workers.filter((w) => w.name !== workerName);
    let auxTotal = 0;
    let auxProfit = 0;
    let auxInvestment = 0;
    let auxPayment = 0;
    let auxTip = 0;
    for (let i = 0; i < newWorkers.length; i++) {
      auxTotal += newWorkers[i].total;
      auxInvestment += newWorkers[i].investment;
      auxProfit += newWorkers[i].profit;
      auxTip += newWorkers[i].tip;
      auxPayment += newWorkers[i].payment;
    }

    oldWeek[0]
      .updateOne({
        workers: newWorkers,
        total: auxTotal,
        payment: auxPayment,
        tip: auxTip,
        investment: auxInvestment,
        profit: auxProfit,
      })
      .then((r) => {
        rp.send({
          response: "Se eliminó al trabajador correctamente",
          error: false,
        });
      });
  } else {
    rp.send({ response: "No se encuentra esa semana", error: false });
  }
};

const updateWeekWorker = async (worker, wId, name, rp) => {
  const oldWeek = await Week.find({ _id: wId });
  if (oldWeek.length > 0) {
    const newWorkers = oldWeek[0].workers.filter((w) => w.name !== name);
    const oldWorker = oldWeek[0].workers.filter((w) => w.name === name);
    if (oldWorker.length > 0) {
      if (worker.total) {
        if (worker.percentOf.length > 0) {
          const actualWorker = {
            name: oldWorker[0].name,
            ocupation: oldWorker[0].ocupation,
            urlImage: oldWorker[0].urlImage,
            total: oldWorker[0].total + worker.total,
            payment:
              oldWorker[0].payment + worker.total * (worker.percentOf / 100),
            tip: oldWorker[0].tip,
            investment: oldWorker[0].investment + worker.total * 0.4,
            profit:
              oldWorker[0].profit +
              worker.total * ((60 - worker.percentOf) / 100),
            percentOf: oldWorker[0].percentOf,
          };
          newWorkers.push(actualWorker);
        } else {
          const actualWorker = {
            name: oldWorker[0].name,
            ocupation: oldWorker[0].ocupation,
            urlImage: oldWorker[0].urlImage,
            total: oldWorker[0].total + worker.total,
            payment: oldWorker[0].payment,
            tip: oldWorker[0].tip,
            investment: oldWorker[0].investment + worker.total * 0.4,
            profit: oldWorker[0].profit + worker.total * 0.6,
            percentOf: oldWorker[0].percentOf,
          };
          newWorkers.push(actualWorker);
        }
      }
      if (worker.tip) {
        const actualWorker = {
          name: oldWorker[0].name,
          ocupation: oldWorker[0].ocupation,
          urlImage: oldWorker[0].urlImage,
          total: oldWorker[0].total,
          payment: oldWorker[0].payment,
          tip: oldWorker[0].tip + worker.tip,
          investment: oldWorker[0].investment,
          profit: oldWorker[0].profit,
          percentOf: oldWorker[0].percentOf,
        };
        newWorkers.push(actualWorker);
      }
      let auxTotal = 0;
      let auxProfit = 0;
      let auxInvestment = 0;
      let auxPayment = 0;
      let auxTip = 0;
      for (let i = 0; i < newWorkers.length; i++) {
        auxTotal += newWorkers[i].total;
        auxInvestment += newWorkers[i].investment;
        auxProfit += newWorkers[i].profit;
        auxTip += newWorkers[i].tip;
        auxPayment += newWorkers[i].payment;
      }

      oldWeek[0]
        .updateOne({
          workers: newWorkers,
          total: auxTotal,
          payment: auxPayment,
          tip: auxTip,
          investment: auxInvestment,
          profit: auxProfit,
        })
        .then((r) => {
          rp.send({
            response: "Los datos se actualizaron correctamente",
            error: false,
          });
        });
    } else {
      rp.send({ response: "No se encuentra ese trabajador", error: false });
    }
  } else {
    rp.send({ response: "No se encuentra esa semana", error: false });
  }
};

module.exports = {
  delWeek,
  updateWeekWorker,
  delWorkerWeek,
  updateWeeksetWorker,
};
