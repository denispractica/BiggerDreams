import "./month.css";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import Week from "../Week/Week";
import { MyContext } from "../../../Components/MyContext";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { IMonth, IWeek } from "../../../types";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StatisticsWeek from "../Week/StatisticsWeek";
import StatisticsMonth from "./StatisticsMonth";

const Month = () => {
  const addWeeks = ["Semana1", "Semana2", "Semana3", "Semana4", "Semana5"];
  const { year, month, mId } = useParams();
  const navigator = useNavigate();
  const [lastNameWeek, setLastNameWeek] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStatistics, setActiveStatistics] = useState(false);
  const [activeStatisticsWeek, setActiveStatisticsWeek] = useState(false);

  const [weeksName, setWeeksName] = useState<string[]>([]);
  const [totalMonth, setTotalMonth] = useState<number[]>([]);
  const [profitMonth, setProfitMonth] = useState<number[]>([]);
  const [investmentMonth, setInvestmentMonth] = useState<number[]>([]);
  const [paymentMonth, setPaymentMonth] = useState<number[]>([]);
  const [tipMonth, setTipMonth] = useState<number[]>([]);

  const [workersName, setWorkersName] = useState<string[]>([]);
  const [totalWeek, setTotalWeek] = useState<number[]>([]);
  const [profitWeek, setProfitWeek] = useState<number[]>([]);
  const [investmentWeek, setInvestmentWeek] = useState<number[]>([]);
  const [paymentWeek, setPaymentWeek] = useState<number[]>([]);
  const [tipWeek, setTipWeek] = useState<number[]>([]);
  const {
    response,
    updateResponse,
    updateDataInventory,
    updateDataMonth,
    dataMonth,
  } = useContext(MyContext);
  const [weeks, setWeeks] = useState<IWeek[]>([]);
  const [lastWeek, setLastWeek] = useState<IWeek>({
    _id: "",
    name: "",
    total: 0,
    profit: 0,
    investment: 0,
    payment: 0,
    tip: 0,
    workers: [],
  });
  const calculateMonth = (data: IMonth) => {
    let auxName = [];
    let auxTotal = [];
    let auxProfit = [];
    let auxInvestment = [];
    let auxPayment = [];
    let auxTip = [];
    for (let i = 0; i < data.weeks.length; i++) {
      auxName.push(data.weeks[i].name);
      auxTotal.push(data.weeks[i].total);
      auxProfit.push(data.weeks[i].profit);
      auxInvestment.push(data.weeks[i].investment);
      auxPayment.push(data.weeks[i].payment);
      auxTip.push(data.weeks[i].tip);
    }
    setWeeksName(auxName);
    setTotalMonth(auxTotal);
    setProfitMonth(auxProfit);
    setInvestmentMonth(auxInvestment);
    setPaymentMonth(auxPayment);
    setTipMonth(auxTip);
  };
  const calculateWeek = (data: IWeek) => {
    let auxName = [];
    let auxTotal = [];
    let auxProfit = [];
    let auxInvestment = [];
    let auxPayment = [];
    let auxTip = [];
    for (let i = 0; i < data.workers.length; i++) {
      auxName.push(data.workers[i].name);
      auxTotal.push(data.workers[i].total);
      auxProfit.push(data.workers[i].profit);
      auxInvestment.push(data.workers[i].investment);
      auxPayment.push(data.workers[i].payment);
      auxTip.push(data.workers[i].tip);
    }
    setTotalWeek(auxTotal);
    setProfitWeek(auxProfit);
    setInvestmentWeek(auxInvestment);
    setPaymentWeek(auxPayment);
    setTipWeek(auxTip);
    setWorkersName(auxName);
  };

  const sortWeek = (array: IWeek[]) => {
    return array.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  };

  const fetchMonth = async () => {
    await axios
      .get(`http://localhost:1507/getMonths/${mId}`)
      .then((r) => {
        setLastNameWeek(
          r.data.response[0].weeks.length > 0
            ? r.data.response[0].weeks[r.data.response[0].weeks.length - 1].name
            : ""
        );
        setWeeks(r.data.response[0].weeks);
        if (r.data.response[0].weeks.length > 0) {
          setLastWeek(
            r.data.response[0].weeks[r.data.response[0].weeks.length - 1]
          );
        }
        updateDataMonth(r.data);
        calculateMonth(r.data.response[0]);
        if (r.data.response[0].weeks.length > 0) {
          calculateWeek(
            r.data.response[0].weeks[r.data.response[0].weeks.length - 1]
          );
        }

        setLoading(false);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  const noFetch = () => {
    if (dataMonth.response) {
      setLastNameWeek(
        dataMonth.response[0].weeks.length > 0
          ? dataMonth.response[0].weeks[dataMonth.response[0].weeks.length - 1]
              .name
          : ""
      );
      setWeeks(dataMonth.response[0].weeks);
      if (dataMonth.response[0].weeks.length > 0) {
        setLastWeek(
          dataMonth.response[0].weeks[dataMonth.response[0].weeks.length - 1]
        );
      }
      calculateMonth(dataMonth.response[0]);
      if (dataMonth.response[0].weeks.length > 0) {
        calculateWeek(
          dataMonth.response[0].weeks[dataMonth.response[0].weeks.length - 1]
        );
      }
      setLoading(false);
    }
  };
  const handleDeleteWeek = async () => {
    await axios
      .patch(
        `http://localhost:1507/updateMonthDelWeek/${mId}/${lastWeek._id}`,
        {
          name: lastNameWeek,
        }
      )
      .then((r) => {
        updateDataInventory({ response: null, error: false });
        updateDataMonth({ response: null, error: false });
        updateResponse(r.data.response);
      })
      .catch((e) => console.log("Algo salió mal", e));
  };

  const handleAcept = () => {
    handleDeleteWeek();
    setShowAlert(false);
  };
  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleResponse = () => {
    updateResponse("");
  };

  const createWeek = async () => {
    let addName = "";
    const arrName = weeks.map((w) => w.name);
    for (let i = 0; i < addWeeks.length; i++) {
      if (!arrName.includes(addWeeks[i])) {
        addName = addWeeks[i];
        break;
      }
    }

    await axios
      .patch(`http://localhost:1507/updateMonth/${mId}`, {
        name: addName.length > 0 ? addName : `Semana${weeks.length + 1}`,
      })
      .then((r) => {
        updateDataInventory({ response: null, error: false });
        updateDataMonth({ response: null, error: false });
        updateResponse(r.data.response);
      })
      .catch((e) => console.log("Algo salió mal", e));
  };

  const changeWeek = (name: string) => {
    setLastNameWeek(name);
    setLastWeek(weeks.filter((w) => w.name === name)[0]);
    calculateWeek(weeks.filter((w) => w.name === name)[0]);
  };
  useEffect(() => {
    if (
      dataMonth.response === null ||
      dataMonth.response[0].name !== month ||
      dataMonth.response[0]._id !== mId
    ) {
      setLoading(true);
      fetchMonth();
    } else {
      setLoading(true);
      noFetch();
    }
  }, [response]);

  return (
    <>
      <IconButton
        sx={{ color: "#000000" }}
        onClick={() => navigator("/inventory")}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <div className="title">
        <div style={{ display: "flex" }}>
          <h1>{`Inventario del año ${year}, mes: ${month}`}</h1>
          <IconButton
            onClick={() => setActiveStatistics(true)}
            sx={{ color: "#0F9D58" }}
            aria-label="Estadísticas"
          >
            <QueryStatsIcon />
          </IconButton>
        </div>

        {loading && <LinearProgress />}
        <IconButton
          sx={{ color: "#000000" }}
          onClick={() => createWeek()}
          disabled={weeks.length === 5 ? true : false}
        >
          Agregar Semana
        </IconButton>

        {weeks.length > 0 ? (
          <div style={{ display: "flex" }}>
            <select
              value={lastNameWeek}
              className="inpSelect"
              onChange={(e) => changeWeek(e.target.value)}
            >
              {sortWeek(weeks).map((w) => {
                return (
                  <option value={w.name} key={w._id}>
                    {w.name}
                  </option>
                );
              })}
            </select>
            <IconButton
              onClick={() => setActiveStatisticsWeek(true)}
              sx={{ color: "#0F9D58" }}
              aria-label="Estadísticas"
            >
              <QueryStatsIcon />
            </IconButton>
            <IconButton
              sx={{ color: "#DB4437" }}
              onClick={() => setShowAlert(true)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <></>
        )}
      </div>
      {lastNameWeek.length > 0 && (
        <>
          <Week key={lastNameWeek} week={lastWeek} />
        </>
      )}
      {response.length > 0 && (
        <div className="overlay">
          <div className="alert">
            <p>{response}</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconButton sx={{ color: "#4285F4" }} onClick={handleResponse}>
                <ThumbUpAltIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      {showAlert && (
        <div className="overlay">
          <div className="alert">
            <p>{`¿Estás segura de que deseas eliminar la ${lastNameWeek}?`}</p>
            <div className="btnYear">
              <IconButton
                onClick={handleCancel}
                sx={{
                  color: "#DB4437",
                  margin: "auto",
                }}
              >
                <CancelIcon fontSize="large" />
              </IconButton>

              <IconButton
                onClick={handleAcept}
                sx={{
                  color: "#4285F4",
                  margin: "auto",
                }}
              >
                <ThumbUpAltIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      {activeStatistics && (
        <div className="overlay">
          <div className="title">
            <StatisticsMonth
              weeks={weeksName}
              total={totalMonth}
              profit={profitMonth}
              payment={paymentMonth}
              tip={tipMonth}
              investment={investmentMonth}
            />
            
            <IconButton
              onClick={() => setActiveStatistics(false)}
              sx={{
                color: "#4285F4",
                margin: "auto",
              }}
            >
              <ThumbUpAltIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      )}
      {activeStatisticsWeek && (
        <div className="overlay">
          <div className="title">
            <StatisticsWeek
              workers={workersName}
              total={totalWeek}
              payment={paymentWeek}
              profit={profitWeek}
              investment={investmentWeek}
              tip={tipWeek}
            />
            <IconButton
              onClick={() => setActiveStatisticsWeek(false)}
              sx={{
                color: "#4285F4",
                margin: "auto",
              }}
            >
              <ThumbUpAltIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
};

export default Month;
