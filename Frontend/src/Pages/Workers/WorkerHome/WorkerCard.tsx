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
import "../../Inventory/Year/inventory.css";
import { IWorkerCard } from "../../../types";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WorkerFormUpdate from "../WorkerForm/WorkerFormUpdate";

type Props = {
  worker: IWorkerCard;
};
const WorkerCard: React.FC<Props> = ({ worker }) => {
  const [showAlert, setShowAlert] = useState(false);
  const { updateResponse, updateDataWorker } = useContext(MyContext);
  const [showFormUpdate, setShowFormUpdate] = useState(false);

  const deleteCard = async (id: string) => {
    await axios
      .delete(`http://localhost:1507/delWorker/${id}`)
      .then((r) => {
        updateDataWorker({ response: null, error: false });
        updateResponse(r.data.response);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  const handleAcept = () => {
    deleteCard(worker.name);
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
              width: "180px",
            }}
          >
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              component="div"
              variant="h4"
            >
              {worker.name}
            </Typography>
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              variant="subtitle1"
              component="div"
            >
              {worker.ocupation}
            </Typography>

            {worker.ocupation === "Empleado" ? (
              <Typography
                sx={{ cursor: "default" }}
                color={"white"}
                variant="subtitle1"
                component="div"
              >
                Pago {worker.percentOf}%
              </Typography>
            ) : (
              <></>
            )}
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton
              sx={{ color: "#F4B400" }}
              aria-label="Editar"
              onClick={() => setShowFormUpdate(true)}
            >
              <EditNoteIcon fontSize="large" />
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
          component="img"
          sx={{ height: 150, width: 150, borderRadius: "50%" }}
          image={worker.urlImage === "" ? "/img/noImage.png" : worker.urlImage}
          alt="Worker"
        />
      </Card>

      {showAlert && (
        <div className="overlay">
          <div className="alert">
            <p>¿Estás segura de que deseas eliminar el trabajador?</p>
            <div className="btnDel">
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
      {showFormUpdate && (
        <div className="overlay">
          <div className="alert">
            <WorkerFormUpdate
              setShowFormUpdate={setShowFormUpdate}
              name={worker.name}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WorkerCard;
