import React, { useState, useEffect, useContext } from "react";
import { IStatistics, historyInversion, Coin } from "../../../types";
import { MyContext } from "../../../Components/MyContext";
import "./statistics.css";
import {  IconButton } from "@mui/material";
import SetHistoryInversion from "./InversionGraph/SetHistoryInversion";
import AverageGraph from "./AverageGraph/AverageGraph";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

interface Props {
  props: {
    _id: string;
    activeStatistics: React.Dispatch<React.SetStateAction<boolean>>;
    urlImage: string;
  };
}

const Statistics: React.FC<Props> = ({ props }) => {
  const { data } = useContext(MyContext);
  const [showInversion, setShowInversion] = useState(false);
  const [average] = useState<number[]>([]);
  const [finalAverage, setFinalAverage] = useState(0);
  const [restDays, setRestDays] = useState<number>(0);
  const [buyDate, setBuyDate] = useState<string>("");
  const [historyInversion, setHistoryInversion] = useState<historyInversion[]>([
    {
      data: "",
      price: 0,
      inversion: 0,
      unit: 0,
      coin: Coin.cup,
    },
  ]);
  useEffect(() => {
    const newStatistics = new Promise<IStatistics>((resolve, reject) => {
      const auxData = data.response?.filter((r) => r._id === props._id);
      if (auxData) {
        resolve({
          history: auxData[0].history,
          price: auxData[0].price,
          coin: auxData[0].coin,
          historyInversion: auxData[0].historyInversion,
        });
      } else {
        reject("No se encontraron datos");
      }
    });
    newStatistics
      .then((r) => {
        calculatePerformance(r);
        if (r.historyInversion.length > 0) {
          setHistoryInversion(r.historyInversion);
          setShowInversion(true);
        }
      })
      .catch((e) => console.log("Algo salió mal", e));
  }, []);

  const calculatePerformance = (statistics: IStatistics) => {
    let dia2 = new Date(0, 0, 0);
    let dia1 = new Date(0, 0, 0);
    for (let i = 0; i < statistics.history.length; i++) {
      if (statistics.history[i].exit > 0) {
        if (dia2.getTime() < 0) {
          let aux = statistics.history[i].data.split("-");
          dia2 = new Date(
            parseInt(aux[0]),
            parseInt(aux[1]) - 1,
            parseInt(aux[2])
          );
        } else if (dia2.getTime() > 0 && dia1.getTime() < 0) {
          let aux = statistics.history[i].data.split("-");
          dia1 = new Date(
            parseInt(aux[0]),
            parseInt(aux[1]) - 1,
            parseInt(aux[2])
          );
          let dias = Math.floor(
            (dia1.getTime() - dia2.getTime()) / (1000 * 60 * 60 * 24)
          );
          average.push(dias);
          dia2 = dia1;
          dia1 = new Date(0, 0, 0);
        }

        if (statistics.history[i].exit > 1) {
          let aux = statistics.history[i].exit;
          while (aux > 1) {
            average.push(1);
            aux--;
          }
        }
      }
    }
    if (average.length > 0) {
      let aux = 0;

      for (let i = 0; i < average.length; i++) {
        aux += average[i];
      }
      setFinalAverage(Math.floor(aux / average.length));
      setRestDays(
        Math.floor(aux / average.length) *
          statistics.history[statistics.history.length - 1].end
      );
      calculateDays(
        Math.floor(aux / average.length) *
          statistics.history[statistics.history.length - 1].end
      );
    }
  };

  const calculateDays = (days: number) => {
    let time = days * (1000 * 60 * 60 * 24);
    let today = new Date();
    let totalTime = time + today.getTime();

    today.setTime(totalTime);

    setBuyDate(
      `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
    );
  };

  return (
    <>
      <div className="statistics">
        <div className="statisticsInside">
          {showInversion && (
            <SetHistoryInversion historyInversion={historyInversion} />
          )}

          {average.length > 0 && (
            <AverageGraph
              buyDate={buyDate}
              restDays={restDays}
              finalAverage={finalAverage}
              average={average}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <IconButton
            onClick={() => props.activeStatistics(false)}
            sx={{
              color: "#4285F4",
              margin: "auto",
            }}
          >
            <ThumbUpAltIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Statistics;
