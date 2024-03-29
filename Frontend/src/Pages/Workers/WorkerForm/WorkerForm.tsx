import { useContext, useRef, useState } from "react";
import { IWorker, Ocupation } from "../../../types";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../Store/StoreForm/storeForm.css";
import { MyContext } from "../../../Components/MyContext";
import "./workerForm.css";
import { resizeImage } from "../../../Components/Util/Funciones";
import { IconButton, Grid } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

type Props = {
  setShowForm: (arg: boolean) => void;
};

const WorkerForm = ({ setShowForm }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [percentOf, setPercentOf] = useState("Jefe");
  const { updateResponse, updateDataWorker } = useContext(MyContext);
  const [fileSend, setFileSend] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWorker>();

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

  const sendData = async (data: IWorker) => {
    const send = {
      name: "name" in data ? data.name : "",
      ocupation: percentOf,
      percentOf: "percentOf" in data ? data.percentOf : "",
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
      .post(`http://localhost:1507/setWorker`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => {
        updateResponse(r.data.response);
        setShowForm(false);
        updateDataWorker({ response: null, error: false });
      })
      .catch((e) => console.log("Algo salió mal", e));
  };
  return (
    <>
      <form className="formContainerWorker" onSubmit={handleSubmit(sendData)}>
        <Grid sx={{ margin: "auto" }} item>
          {!imagePreview && (
            <IconButton
              onClick={() => inputRef.current?.click()}
              sx={{ color: "white" }}
            >
              <AddAPhotoIcon fontSize="large" />
              <input
                ref={inputRef}
                style={{ display: "none" }}
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
            placeholder="Nombre del Trabajador"
            {...register("name", { required: true, maxLength: 9 })}
          />
          {"name" in errors && errors.name?.type === "required" && (
            <div className="error">Asegúrate de llenar este campo</div>
          )}
          {"name" in errors && errors.name?.type === "maxLength" && (
            <div className="error">Máximo 9 caracteres</div>
          )}
          <select
            className="inpSelect"
            onChange={(e) => setPercentOf(e.target.value)}
          >
            <option value={Ocupation.jefe}>Jefe</option>
            <option value={Ocupation.empleado}>Empleado</option>
          </select>
          {percentOf === "Empleado" ? (
            <>
              <input
                className="inpFormUp"
                placeholder="%"
                {...register("percentOf", {
                  required: true,
                  max: 100,
                  min: 1,
                  pattern: /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/,
                })}
              />
              {"percentOf" in errors &&
                errors.percentOf?.type === "pattern" && (
                  <div className="error">Solo números</div>
                )}
              {"percentOf" in errors &&
                errors.percentOf?.type === "required" && (
                  <div className="error">Asegúrate de llenar este campo</div>
                )}
              {"percentOf" in errors && errors.percentOf?.type === "max" && (
                <div className="error">Máximo 100%</div>
              )}
              {"percentOf" in errors && errors.percentOf?.type === "min" && (
                <div className="error">Mínimo 1%</div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="buttonsWorkers">
          <IconButton
            onClick={() => setShowForm(false)}
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
        </div>
      </form>
    </>
  );
};
export default WorkerForm;
