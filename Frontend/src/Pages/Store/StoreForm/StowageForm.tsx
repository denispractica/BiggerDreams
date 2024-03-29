import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coin, History, IStowageCard } from "../../../types";
import { Grid, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./storeForm.css";
import { MyContext } from "../../../Components/MyContext";
import { resizeImage } from "../../../Components/Util/Funciones";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import Add from "@mui/icons-material/Add";

const StowageForm = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const navigator = useNavigate();
  const [formDown, setFormDown] = useState(false);
  const { updateResponse, updateData } = useContext(MyContext);
  const [exitForm, setExitForm] = useState(0);
  const [entranceForm, setEntranceForm] = useState(0);
  const [fileSend, setFileSend] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IStowageCard | History>();

  const handleSetEntrance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntranceForm(parseInt(e.target.value));
  };

  const handleSetExit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExitForm(parseInt(e.target.value));
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

  const sendData = async (data: IStowageCard | History) => {
    const newHistory = {
      data: "data" in data ? data.data : "",
      entrance: parseInt(("entrance" in data ? data.entrance : "0").toString()),
      exit: parseInt(("exit" in data ? data.exit : "0").toString()),
      end: parseInt(("end" in data ? data.end : "0").toString()),
      presentPrice: parseFloat(("price" in data ? data.price : 0).toString()),
      presentCoin: "coin" in data ? data.coin : "",
    };

    const send = {
      productName: "productName" in data ? data.productName : "",
      productSpecificity:
        "productSpecificity" in data ? data.productSpecificity : "",
      unitOfMeasurement:
        "unitOfMeasurement" in data ? data.unitOfMeasurement : "",
      price: parseFloat(("price" in data ? data.price : 0).toString()),
      coin: "coin" in data ? data.coin : "",
      history: newHistory.data !== "" ? [newHistory] : [],
    };

    const formData: FormData = new FormData();
    formData.append("data", JSON.stringify(send));
    if (fileSend) {
      const resizedFile = await resizeImage(fileSend).catch((e) =>
        console.log(e)
      );
      if (resizedFile) {
        formData.append("myFile", resizedFile);
      }
    }

    await axios
      .post("http://localhost:1507/setStowageCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => {
        updateResponse(r.data.response);
        updateData({ response: null, error: false });
        navigator("/store");
      })
      .catch((e) => console.log("Algo salió mal", e));
  };
  return (
    <>
      <h1 className="titleCard">Tarjeta de Estiba</h1>

      <form className="formContainer" onSubmit={handleSubmit(sendData)}>
        <Grid sx={{ margin: "auto" }} item>
          {!imagePreview && (
            <IconButton
              onClick={() => fileRef.current?.click()}
              sx={{ color: "white" }}
            >
              <AddAPhotoIcon fontSize="large" />
              <input
                style={{ display: "none" }}
                ref={fileRef}
                className="inpFile"
                aria-label="Agregar Imagen"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </IconButton>
          )}
          {imagePreview && (
            <div style={{ width: "128px", height: "128px" }}>
              <img className="customImage" alt="Producto" src={imagePreview} />
            </div>
          )}
        </Grid>

        <div className="formUp">
          <input
            className="inpFormUp"
            placeholder="Nombre del Producto"
            {...register("productName", { required: true })}
          />
          {"productName" in errors &&
            errors.productName?.type === "required" && (
              <div className="error">Asegúrate de llenar este campo</div>
            )}
          <input
            className="inpFormUp"
            placeholder="Tipo de Producto"
            {...register("productSpecificity", { required: true })}
          />
          {"productSpecificity" in errors &&
            errors.productSpecificity?.type === "required" && (
              <div className="error">Asegúrate de llenar este campo</div>
            )}
          <input
            className="inpFormUp"
            placeholder="Unidad de Medida"
            {...register("unitOfMeasurement", { required: true })}
          />
          {"unitOfMeasurement" in errors &&
            errors.unitOfMeasurement?.type === "required" && (
              <div className="error">Asegúrate de llenar este campo</div>
            )}
          <div>
            <input
              className="inpPrecio"
              placeholder="Precio Unitario"
              {...register("price", {
                required: true,
                pattern: /^[1-9][0-9]*$/,
              })}
            />
            {"price" in errors && errors.price?.type === "required" && (
              <div className="error">Asegúrate de llenar este campo</div>
            )}
            {"price" in errors && errors.price?.type === "pattern" && (
              <div className="error">Solo números mayor a 0</div>
            )}
            <select className="inpSelect" {...register("coin")}>
              <option value={Coin.cup}>cup</option>
              <option value={Coin.mlc}>mlc</option>
              <option value={Coin.usd}>usd</option>
            </select>
          </div>
        </div>
        {formDown && (
          <>
            <h3 className="titleCard">Sección de Seguimiento</h3>
            <table className="headTable">
              <thead>
                <tr>
                  <th
                    className="headFecha"
                    style={{ color: "white", cursor: "default" }}
                  >
                    Fecha
                  </th>
                  <th
                    className="headOthers"
                    style={{ color: "white", cursor: "default" }}
                  >
                    Entrada
                  </th>
                  <th
                    className="headOthers"
                    style={{ color: "white", cursor: "default" }}
                  >
                    Salida
                  </th>
                  <th
                    className="headOthers"
                    style={{ color: "white", cursor: "default" }}
                  >
                    Final
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="data">
                    <input
                      type="date"
                      className="dataFecha"
                      {...register("data", {
                        required: true,
                      })}
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      className="dataOthers"
                      value={entranceForm}
                      {...register("entrance", {
                        onChange: handleSetEntrance,
                        required: true,
                        min: 0,
                      })}
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      className="dataOthers"
                      value={exitForm}
                      {...register("exit", {
                        onChange: handleSetExit,
                        required: true,
                        min: 0,
                      })}
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      className="dataOthers"
                      value={entranceForm - exitForm}
                      {...register("end", {
                        value: entranceForm - exitForm,
                        required: true,
                        min: 0,
                      })}
                    />

                    {"data" in errors && errors.data?.type === "required" && (
                      <div className="error">
                        Asegúrate de escribir la fecha
                      </div>
                    )}
                    {"entrance" in errors &&
                      errors.entrance?.type === "min" && (
                        <div className="error">Entrada debe ser positivo</div>
                      )}
                    {"entrance" in errors &&
                      errors.entrance?.type === "required" && (
                        <div className="error">
                          Asegúrate de escribir la entrada
                        </div>
                      )}
                    {"exit" in errors && errors.exit?.type === "min" && (
                      <div className="error">Salida debe ser positivo</div>
                    )}
                    {"exit" in errors && errors.exit?.type === "required" && (
                      <div className="error">
                        Asegúrate de escribir la salida
                      </div>
                    )}
                    {"end" in errors && errors.end?.type === "required" && (
                      <div className="error">Asegúrate de tener final</div>
                    )}
                    {"end" in errors && errors.end?.type === "min" && (
                      <div className="error">Final debe ser positivo</div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        <div className="buttons">
          <IconButton
            onClick={() => navigator("/store")}
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
            type="submit"
          >
            <DoneOutlineIcon fontSize="large" />
          </IconButton>

          <IconButton
            sx={{
              color: "#F4B400",
              margin: "auto",
            }}
            onClick={() => setFormDown(!formDown)}
          >
            <Add fontSize="large" />
          </IconButton>
        </div>
      </form>
    </>
  );
};
export default StowageForm;
