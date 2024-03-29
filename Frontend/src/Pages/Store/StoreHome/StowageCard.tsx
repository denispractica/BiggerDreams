import { IStowageCard } from "../../../types";
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
import { useNavigate } from "react-router-dom";
import Statistics from "../StoreStatistics/Statistics";
import "../StoreForm/storeForm.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import EditNoteIcon from "@mui/icons-material/EditNote";

type Props = {
  dataCard: IStowageCard;
};
const StowageCard: React.FC<Props> = ({ dataCard }) => {
  const navigator = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [activeStatistics, setActiveStatistics] = useState(false);
  const { updateResponse, updateData } = useContext(MyContext);

  const deleteCard = async (id: string) => {
    await axios
      .delete(`http://localhost:1507/delStowageCard/${id}`)
      .then((r) => {
        updateResponse(r.data.response);
        updateData({ response: null, error: false });
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  const handleAcept = () => {
    deleteCard(dataCard._id);
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
              width: "200px",
            }}
          >
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              component="div"
              variant="h4"
            >
              {dataCard.productName}
            </Typography>
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              variant="subtitle1"
              component="div"
            >
              Precio Unitario:
              <b>{" " + dataCard.price + " " + dataCard.coin}</b>
            </Typography>
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              variant="subtitle1"
              component="div"
            >
              Tipo:
              <b>{" " + dataCard.productSpecificity}</b>
            </Typography>
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              variant="subtitle1"
              component="div"
            >
              Unidad de Medida:
              <b>{" " + dataCard.unitOfMeasurement}</b>
            </Typography>
            <Typography
              sx={{ cursor: "default" }}
              color={"white"}
              variant="subtitle1"
              component="div"
            >
              Disponibles:
              <b>
                {dataCard.history.length > 0
                  ? " " +
                    dataCard.history[dataCard.history.length - 1].end +
                    " u"
                  : " " + 0 + " u"}
              </b>
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton
              sx={{ color: "#F4B400" }}
              aria-label="Editar"
              onClick={() =>
                navigator(`/store/stowageFormUpdate/${dataCard._id}`)
              }
            >
              <EditNoteIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={() => setActiveStatistics(true)}
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
          component="img"
          sx={{ height: 150, width: 150, borderRadius: "50%" }}
          image={
            dataCard.urlImage === "" ? "/img/noImage.png" : dataCard.urlImage
          }
          alt="Producto"
        />
      </Card>

      {showAlert && (
        <div className="overlay">
          <div className="alert">
            <p>¿Estás segura de que deseas eliminar la tarjeta?</p>
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
      {activeStatistics && (
        <Statistics
          props={{
            _id: dataCard._id,
            activeStatistics: setActiveStatistics,
            urlImage: dataCard.urlImage,
          }}
        />
      )}
    </>
  );
};

export default StowageCard;
