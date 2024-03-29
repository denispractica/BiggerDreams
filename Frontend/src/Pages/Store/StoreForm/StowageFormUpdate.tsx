import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Column, History, Update } from "../../../types";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import "./storeForm.css";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { useForm } from "react-hook-form";
import { MyContext } from "../../../Components/MyContext";
import LinearProgress from "@mui/material/LinearProgress";
import { resizeImage } from "../../../Components/Util/Funciones";
import EditIcon from "@mui/icons-material/Edit";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CancelIcon from "@mui/icons-material/Cancel";

const columns: readonly Column[] = [
  { id: "Fecha" },
  { id: "Entrada" },
  { id: "Salida" },
  { id: "Final" },
];

const StowageFormUpdate = () => {
  //Constantes
  const { response, updateResponse, updateData } = useContext(MyContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<History>();

  const { id } = useParams();
  const navigator = useNavigate();
  const [update, setUpdate] = useState<Update | undefined>(undefined);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState(update?.history);
  const [page, setPage] = useState(0);
  const [addActive, setAddActive] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [changePrice, setChangePrice] = useState(false);
  const [changeImage, setChangeImage] = useState(false);
  const [newPrice, setNewPrice] = useState(0);
  const [newCoin, setNewCoin] = useState("");
  const [historyDelete, setHistoryDelete] = useState<History>({
    data: "",
    entrance: 0,
    exit: 0,
    end: 0,
    presentPrice: newPrice,
    presentCoin: newCoin,
  });
  const [exitForm, setExitForm] = useState(0);
  const [entranceForm, setEntranceForm] = useState(0);

  const [lastEnd, setLastEnd] = useState(0);
  const [endForm, setEndForm] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [errorDate, setErrorDate] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const [fileSend, setFileSend] = useState<File | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  //Metodos handles
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleSetEntrance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = parseInt(e.target.value);

    setEntranceForm(element);
    setEndForm(lastEnd + element - exitForm);
  };

  const handleSetExit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = parseInt(e.target.value);

    setExitForm(element);
    setEndForm(lastEnd + entranceForm - element);
  };

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = parseInt(e.target.value);
    if (element <= 0) return;
    else {
      setNewPrice(element);
    }
  };

  const handleActive = () => {
    setAddActive(!addActive);
  };

  const handleResponse = () => {
    updateResponse("");
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleDeleteHistory = (e: React.MouseEvent<HTMLButtonElement>) => {
    const data =
      e.currentTarget.parentElement?.parentElement?.parentElement?.childNodes[0]
        .textContent;

    const entrance =
      e.currentTarget.parentElement?.parentElement?.parentElement?.childNodes[1]
        .textContent;

    const exit =
      e.currentTarget.parentElement?.parentElement?.parentElement?.childNodes[2]
        .textContent;

    const end =
      e.currentTarget.parentElement?.parentElement?.parentElement?.childNodes[3]
        .textContent;

    setHistoryDelete({
      data: data ? data : "",
      entrance: entrance ? parseInt(entrance) : 0,
      exit: exit ? parseInt(exit) : 0,
      end: end ? parseInt(end) : 0,
      presentPrice: newPrice,
      presentCoin: newCoin,
    });

    setShowAlert(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileSend(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeCoin = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCoin(event.target.value);
  };

  const compareDate = (fecha: string) => {
    if (lastDate.length > 0) {
      const fecha1 = lastDate.split("-");
      const fecha2 = fecha.split("-");

      const fecha1Obj = new Date(
        parseInt(fecha1[0]),
        parseInt(fecha1[1]) - 1,
        parseInt(fecha1[2])
      );
      const fecha2Obj = new Date(
        parseInt(fecha2[0]),
        parseInt(fecha2[1]) - 1,
        parseInt(fecha2[2])
      );

      if (fecha1Obj < fecha2Obj) {
        return false;
      }
      return true;
    }
    return false;
  };

  //Envios a la DB
  const handleAcept = async () => {
    const deleteHistory = update?.history
      .reverse()
      .filter((e) => e.data !== historyDelete.data);
    const stowageCard = {
      history: deleteHistory,
    };

    await axios
      .patch(`http://localhost:1507/updateStowageCard/${id}`, stowageCard)
      .then((r) => {
        updateResponse(r.data.response);
        updateData({ response: null, error: false });
      })
      .catch((e) => console.log("Ocurrió un error", e));

    setShowAlert(false);
  };

  const handleSendNewHistory = async (data: History) => {
    const dataForCompare = "data" in data ? data.data : "";
    if (compareDate(dataForCompare)) {
      setErrorDate(true);
      setTimeout(() => {
        setErrorDate(false);
      }, 4000);
      return;
    }
    const newHistory = {
      data: "data" in data ? data.data : "",
      entrance: parseInt(("entrance" in data ? data.entrance : "0").toString()),
      exit: parseInt(("exit" in data ? data.exit : "0").toString()),
      end: parseInt(("end" in data ? data.end : "0").toString()),
      presentPrice: newPrice,
      presentCoin: newCoin,
    };

    const updateHistory = update?.history.reverse();
    updateHistory?.push(newHistory);

    const stowageCard = {
      history: updateHistory,
    };

    await axios
      .patch(`http://localhost:1507/updateStowageCard/${id}`, stowageCard)
      .then((r) => {
        updateResponse(r.data.response);
        updateData({ response: null, error: false });
        setAddActive(!addActive);
        setEntranceForm(0);
        setExitForm(0);
      })
      .catch((e) => console.log("Algo salió mal", e));
  };

  const updatePrice = async () => {
    const stowageCard = {
      price: newPrice,
      coin: newCoin,
    };
    await axios
      .patch(`http://localhost:1507/updateStowageCard/${id}`, stowageCard)
      .then((r) => {
        {
          updateResponse(r.data.response);
          updateData({ response: null, error: false });
          setChangePrice(!changePrice);
        }
      })
      .catch((e) => console.log("Algo salió mal", e));
  };

  const updateImage = async () => {
    const formData: FormData = new FormData();
    if (fileSend) {
      const resizedFile = await resizeImage(fileSend).catch((e) =>
        console.log(e)
      );
      if (resizedFile) {
        formData.append("myFile", resizedFile);
      }
    }

    await axios
      .patch(`http://localhost:1507/updateStowageCard/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => {
        updateResponse(r.data.response);
        updateData({ response: null, error: false });
        setChangeImage(!changeImage);
      })
      .catch((e) => console.log("Algo salió mal", e));
  };
  const getUpdate = async () => {
    await axios
      .get(`http://localhost:1507/getStowageCard/${id}`)
      .then((r) => {
        setUpdate(r.data.response);
        setRows(r.data.response.history.reverse());
        setCount(r.data.response.history.length);
        setNewPrice(r.data.response.price);
        setNewCoin(r.data.response.coin);
        if (r.data.response.history.length > 0) {
          setLastEnd(r.data.response.history[0].end);
          setEndForm(r.data.response.history[0].end);
          setLastDate(r.data.response.history[0].data);
          resetField("data");
        }
        setLoading(false);
      })
      .catch((e) => console.log("Algo salió mal", e));
  };

  useEffect(() => {
    setLoading(true);
    getUpdate();
  }, [response]);

  return (
    <>
      <IconButton
        sx={{ color: "#000000", margin: "auto" }}
        onClick={() => navigator("/store")}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <div className="formContainer ">
        <h3 className="titleCard">Sección de Seguimiento</h3>
        {loading && <LinearProgress />}
        <TableContainer sx={{ margin: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((c) => (
                  <TableCell
                    sx={{ fonstSize: "2px", cursor: "default" }}
                    key={c.id}
                  >
                    <div className="centerTableHeadF">{c.id}</div>
                  </TableCell>
                ))}

                <TableCell>
                  <div className="centerTableHeadF">
                    <IconButton onClick={handleActive}>
                      <EditIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addActive && (
                <TableRow>
                  <TableCell>
                    <div className="centerTableF">
                      <input
                        type="date"
                        {...register("data", {
                          required: true,
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="centerTableF">
                      <input
                        style={{ color: "white" }}
                        type="number"
                        className="dataOthersUpdate"
                        value={entranceForm}
                        {...register("entrance", {
                          onChange: handleSetEntrance,
                          value: entranceForm,
                          required: true,
                          min: 0,
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="centerTableF">
                      <input
                        style={{ color: "white" }}
                        type="number"
                        className="dataOthersUpdate"
                        value={exitForm}
                        {...register("exit", {
                          onChange: handleSetExit,
                          value: exitForm,
                          required: true,
                          min: 0,
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="centerTableF">
                      <input
                        style={{ color: "white", cursor: "default" }}
                        type="number"
                        className="dataOthersUpdate"
                        value={endForm}
                        {...register("end", {
                          value: endForm,
                          required: true,
                          min: 0,
                        })}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="centerTableF">
                      <IconButton
                        sx={{ color: "#0F9D58" }}
                        onClick={handleSubmit(handleSendNewHistory)}
                      >
                        <DoneOutlineIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {rows?.slice(page * 3, page * 3 + 3).map((r) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={crypto.randomUUID()}
                  >
                    <TableCell>
                      <div
                        className="centerTableF"
                        style={{ color: "white", cursor: "default" }}
                      >
                        {r.data}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="centerTableF"
                        style={{ color: "white", cursor: "default" }}
                      >
                        {r.entrance}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="centerTableF"
                        style={{ color: "white", cursor: "default" }}
                      >
                        {r.exit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="centerTableF"
                        style={{ color: "white", cursor: "default" }}
                      >
                        {r.end}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="centerTableF">
                        <IconButton
                          sx={{ color: "#DB4437" }}
                          onClick={handleDeleteHistory}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[3]}
          component="div"
          count={count}
          rowsPerPage={3}
          page={page}
          onPageChange={handleChangePage}
        />
        {changeImage && (
          <div
            style={{
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {!imagePreview && (
              <>
                <input
                  aria-label="Agregar Imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </>
            )}
            {imagePreview && (
              <div style={{ width: "128px", height: "128px" }}>
                <img
                  className="customImage"
                  alt="Producto"
                  src={imagePreview}
                />
              </div>
            )}
            {fileSend && (
              <IconButton
                sx={{
                  color: "#0F9D58",
                  margin: "auto",
                  marginTop: "5px",
                }}
                onClick={updateImage}
              >
                <DoneOutlineIcon />
              </IconButton>
            )}
          </div>
        )}
        {changePrice && (
          <div className="buttons">
            <input
              value={newPrice}
              onChange={handleChangePrice}
              className="newPrice"
              type="number"
            />
            <select className="inpSelect" onChange={changeCoin} value={newCoin}>
              <option value={"cup"}>cup</option>
              <option value={"mlc"}>mlc</option>
              <option value={"usd"}>usd</option>
            </select>
            <IconButton
              sx={{
                color: "#0F9D58",
                width: "100px",
                height: "40px",
                margin: "auto",
                marginRight: "3px",
              }}
              onClick={updatePrice}
            >
              <DoneOutlineIcon />
            </IconButton>
          </div>
        )}
        {"data" in errors && errors.data?.type === "required" && addActive && (
          <div className="error">Asegúrate de escribir la fecha</div>
        )}
        {"entrance" in errors &&
          errors.entrance?.type === "min" &&
          addActive && <div className="error">Entrada debe ser positivo</div>}
        {"entrance" in errors &&
          errors.entrance?.type === "required" &&
          addActive && (
            <div className="error">Asegúrate de escribir la entrada</div>
          )}
        {"exit" in errors && errors.exit?.type === "min" && addActive && (
          <div className="error">Salida debe ser positivo</div>
        )}
        {"exit" in errors && errors.exit?.type === "required" && addActive && (
          <div className="error">Asegúrate de escribir la salida</div>
        )}
        {"end" in errors && errors.end?.type === "required" && addActive && (
          <div className="error">Asegúrate de tener final</div>
        )}
        {"end" in errors && errors.end?.type === "min" && addActive && (
          <div className="error">Final debe ser positivo</div>
        )}
        {errorDate && (
          <div className="error">
            No puedes agregar un historial con un día que ya pasó
          </div>
        )}
        <div className="buttons">
          <IconButton
            sx={{ color: "#000000", margin: "auto" }}
            onClick={() => {
              if (!changeImage) setChangePrice(!changePrice);
            }}
          >
            <MonetizationOnIcon fontSize="large" />
          </IconButton>
          <IconButton
            sx={{ color: "#000000", margin: "auto" }}
            onClick={() => {
              if (!changePrice) {
                setChangeImage(!changeImage);
                if (!changeImage) {
                  setFileSend(undefined);
                  setImagePreview(undefined);
                }
              }
            }}
          >
            <FlipCameraIosIcon fontSize="large" />
          </IconButton>
        </div>
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
      {showAlert && (
        <div className="overlay">
          <div className="alert">
            <p>¿Estás segura de que deseas eliminar este dato?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
    </>
  );
};
export default StowageFormUpdate;
