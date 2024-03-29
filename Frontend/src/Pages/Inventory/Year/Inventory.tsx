import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MyContext } from "../../../Components/MyContext";
import { IconButton, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import InventoryCard from "./InventoryCard";
import "./inventory.css";
import { IInventory, IMonth } from "../../../types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import { useNavigate } from "react-router-dom";
import AddCardIcon from "@mui/icons-material/AddCard";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

const Inventory = () => {
  const [loading, setLoading] = useState(false);
  const [showCreateInventory, setShowCreateInventory] = useState(false);
  const [year, setYear] = useState(2023);
  const {
    response,
    updateDataInventory,
    dataInventory,
    updateResponse,
    showMonths,
    updateShowMonths,
  } = useContext(MyContext);

  const navigator = useNavigate();

  const fetchInventories = async () => {
    await axios
      .get("http://localhost:1507/getInventories/")
      .then((r) => {
        updateDataInventory(r.data);
        setLoading(false);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  useEffect(() => {
    if (dataInventory.response === null) {
      setLoading(true);
      fetchInventories();
    }
  }, [response]);

  const createInventory = async () => {
    await axios
      .post("http://localhost:1507/setInventory", { year: year })
      .then((r) => {
        updateDataInventory({ response: null, error: false });
        updateResponse(r.data.response);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  const handleCancel = () => {
    setShowCreateInventory(false);
  };
  const handleAcept = () => {
    createInventory();
    setShowCreateInventory(false);
  };

  const handleResponse = () => {
    updateResponse("");
  };
  const handleYear = (e: any) => {
    setYear(e.$y);
  };

  return (
    <>
      <IconButton
        sx={{ color: "#000000" }}
        onClick={() => setShowCreateInventory(true)}
      >
        <AddCardIcon fontSize="large" />
      </IconButton>
      {showCreateInventory && (
        <div className="overlay">
          <div className="alert">
            <p>Seleccione el año</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <YearCalendar
                timezone="system"
                yearsPerRow={4}
                onChange={handleYear}
              />
            </LocalizationProvider>
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
                sx={{
                  color: "#0F9D58",
                  margin: "auto",
                }}
                onClick={handleAcept}
              >
                <DoneOutlineIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      {loading && <LinearProgress />}
      <div className="inventoryCards">
        {dataInventory.response ? (
          dataInventory.response.map((c: IInventory) => {
            return (
              <div key={c._id} className="showMonths">
                <InventoryCard
                  inventory={{
                    year: c.year,
                    _id: c._id,
                    months: c.months,
                    total: c.total,
                    payment: c.payment,
                    investment: c.investment,
                    tip: c.tip,
                    profit: c.profit,
                  }}
                />
                {showMonths === c._id && (
                  <div className="overlay">
                    <div className="alertInventory">
                      <h2 style={{ display: "flex", justifyContent: "center" }}>
                        Selecciona el Mes
                      </h2>
                      <div className="monthCard">
                        {c.months.map((m: IMonth) => {
                          return (
                            <Button
                              key={crypto.randomUUID()}
                              onClick={() => {
                                updateShowMonths("");
                                navigator(
                                  `/inventory/month/${c.year}/${m.name}/${m._id}`
                                );
                              }}
                              sx={{
                                color: "#000000",
                                border: "1px solid #000000",
                                ":hover": {
                                  backgroundColor: "#1c3435",
                                  color: "white",
                                },
                              }}
                            >
                              {m.name}
                            </Button>
                          );
                        })}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "20px",
                        }}
                      >
                        <IconButton
                          sx={{ color: "#DB4437" }}
                          onClick={() => updateShowMonths("")}
                        >
                          <CancelIcon fontSize="large" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>

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
    </>
  );
};
export default Inventory;
