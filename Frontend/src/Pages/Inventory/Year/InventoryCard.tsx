import {
  Typography,
  Card,
  Box,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { MyContext } from "../../../Components/MyContext";
import "./inventory.css";
import { IInventory } from "../../../types";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StatisticsYear from "./StatisticYear";

type Props = {
  inventory: IInventory;
};

const InventoryCard: React.FC<Props> = ({ inventory }) => {
  const [MonthsName, setMonthsName] = useState<string[]>([]);
  const [total, setTotal] = useState<number[]>([]);
  const [profit, setProfit] = useState<number[]>([]);
  const [investment, setInvestment] = useState<number[]>([]);
  const [payment, setPayment] = useState<number[]>([]);
  const [tip, setTip] = useState<number[]>([]);

  const [activeStatistics, setActiveStatistics] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const {
    updateResponse,
    updateDataInventory,
    updateShowMonths,
    updateDataMonth,
    showMonths,
  } = useContext(MyContext);
  const calculateYear = () => {
    let auxName = [];
    let auxTotal = [];
    let auxProfit = [];
    let auxInvestment = [];
    let auxPayment = [];
    let auxTip = [];

    for (let i = 0; i < inventory.months.length; i++) {
      auxName.push(inventory.months[i].name);
      let auxTotalMonth = 0;
      let auxProfitMonth = 0;
      let auxInvestmentMonth = 0;
      let auxPaymentMonth = 0;
      let auxTipMonth = 0;
      for (let j = 0; j < inventory.months[i].weeks.length; j++) {
        auxTotalMonth += inventory.months[i].weeks[j].total;
        auxProfitMonth += inventory.months[i].weeks[j].profit;
        auxInvestmentMonth += inventory.months[i].weeks[j].investment;
        auxPaymentMonth += inventory.months[i].weeks[j].payment;
        auxTipMonth += inventory.months[i].weeks[j].tip;
      }
      auxTotal.push(auxTotalMonth);
      auxProfit.push(auxProfitMonth);
      auxInvestment.push(auxInvestmentMonth);
      auxPayment.push(auxPaymentMonth);
      auxTip.push(auxTipMonth);
    }
    setMonthsName(auxName);
    setTotal(auxTotal);
    setProfit(auxProfit);
    setInvestment(auxInvestment);
    setPayment(auxPayment);
    setTip(auxTip);
  };

  const deleteCard = async (id: string) => {
    await axios
      .delete(`http://localhost:1507/delInventory/${id}`)
      .then((r) => {
        updateDataInventory({ response: null, error: false });
        updateDataMonth({ response: null, error: false });
        updateResponse(r.data.response);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  const handleAcept = () => {
    deleteCard(inventory._id);
    setShowAlert(false);
  };
  const handleCancel = () => {
    setShowAlert(false);
  };

  return (
    <>
      <Card
        sx={{
          padding: "10px",
          display: "flex",
          backgroundImage:
            "linear-gradient(90deg, #1c3435 0, #182a29 16.67%, #121b1a 33.33%, #000000 50%, #000000 66.67%, #000000 83.33%, #000000 100%)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent
            sx={{
              flex: "1 0 auto",
              width: "120px",
            }}
          >
            <Typography
              component="div"
              sx={{ cursor: "default" }}
              variant="h3"
              color={"white"}
            >
              {inventory.year}
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton
              onClick={() => {
                calculateYear();
                setActiveStatistics(true);
              }}
              sx={{ color: "#0F9D58" }}
              aria-label="Estadísticas"
            >
              <QueryStatsIcon fontSize="large" />
            </IconButton>
            <IconButton
              sx={{ color: "#DB4437" }}
              aria-label="Eliminar"
              onClick={() => setShowAlert(true)}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
        <CardMedia
          onClick={() =>
            updateShowMonths(showMonths === inventory._id ? "" : inventory._id)
          }
          component="img"
          sx={{ height: 150, width: 150, cursor: "pointer" }}
          image="/img/inventory.webp"
          alt="Inventario"
        />
      </Card>

      {showAlert && (
        <div className="overlay">
          <div className="alert">
            <p>¿Estás segura de que deseas eliminar el Inventario?</p>
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
            <StatisticsYear
              months={MonthsName}
              investment={investment}
              total={total}
              payment={payment}
              profit={profit}
              tip={tip}
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
    </>
  );
};

export default InventoryCard;
