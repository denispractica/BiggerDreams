import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../../Store/StoreHome/store.css";
import { IWorkerCard } from "../../../types";
import { IconButton } from "@mui/material";
import { MyContext } from "../../../Components/MyContext";
import LinearProgress from "@mui/material/LinearProgress";
import WorkerCard from "./WorkerCard";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkerForm from "../WorkerForm/WorkerForm";

const Worker = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { response, dataWorker, updateDataWorker, updateResponse } =
    useContext(MyContext);

  const fetchWorkers = async () => {
    await axios
      .get("http://localhost:1507/getWorkers/")
      .then((r) => {
        updateDataWorker(r.data);
        setLoading(false);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  useEffect(() => {
    if (dataWorker.response === null) {
      setLoading(true);
      fetchWorkers();
    }
  }, [response]);

  const handleResponse = () => {
    updateResponse("");
  };

  return (
    <>
      <IconButton sx={{ color: "#000000" }} onClick={() => setShowForm(true)}>
        <PersonAddIcon fontSize="large" />
      </IconButton>

      {loading && <LinearProgress />}
      <div className="storeCards">
        {dataWorker.response ? (
          dataWorker.response.map((w: IWorkerCard) => {
            return (
              <WorkerCard
                key={w.name}
                worker={{
                  name: w.name,
                  ocupation: w.ocupation,
                  urlImage: w.urlImage,
                  percentOf: w.percentOf,
                }}
              />
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
            <div className="btnYear">
              <IconButton sx={{ color: "#4285F4" }} onClick={handleResponse}>
                <ThumbUpAltIcon fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="overlay">
          <div className="alert">
            <WorkerForm setShowForm={setShowForm} />
          </div>
        </div>
      )}
    </>
  );
};
export default Worker;
