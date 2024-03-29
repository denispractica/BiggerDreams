import { useContext, useRef, useState } from "react";
import axios from "axios";
import "../../Store/StoreForm/storeForm.css";
import { MyContext } from "../../../Components/MyContext";
import "./workerForm.css";
import { resizeImage } from "../../../Components/Util/Funciones";
import { IconButton, Grid } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import { IWorkerCard } from "../../../types";
import { useForm } from "react-hook-form";

type Props = {
  name: string;
  setShowFormUpdate: (arg: boolean) => void;
};

const WorkerFormUpdate = ({ name, setShowFormUpdate }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWorkerCard>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateResponse, updateDataWorker } = useContext(MyContext);
  const [fileSend, setFileSend] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const [ocupation, setOcupation] = useState("Jefe");
  const [percentOf, setPercentOf] = useState("");
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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOcupation(e.target.value);
  };
  const handleChangePercentOf = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPercentOf(e.target.value);
  };

  const updateData = async () => {
    const send = {
      name: name,
      ocupation: ocupation,
      percentOf: percentOf,
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
      .patch(`http://localhost:1507/updateWorker`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => {
        updateResponse(r.data.response);
        setShowFormUpdate(false);
        updateDataWorker({ response: null, error: false });
      })
      .catch((e) => console.log("Algo salió mal", e));
  };

  return (
    <>
      <h1 className="titleCard">{`Editando a ${name}`}</h1>
      <div className="formContainerWorker">
        <Grid sx={{ margin: "auto" }} item>
          {!imagePreview && (
            <IconButton
              onClick={() => inputRef.current?.click()}
              sx={{ color: "white" }}
            >
              <FlipCameraIosIcon fontSize="large" />
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
          <select className="inpSelect" onChange={handleChange}>
            <option value={"Jefe"}>Jefe</option>
            <option value={"Empleado"}>Empleado</option>
          </select>
          {ocupation === "Empleado" ? (
            <>
              <input
                className="inpFormUp"
                placeholder="%"
                {...register("percentOf", {
                  required: true,
                  onChange: handleChangePercentOf,
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
            onClick={() => setShowFormUpdate(false)}
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
            onClick={handleSubmit(updateData)}
          >
            <DoneOutlineIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </>
  );
};
export default WorkerFormUpdate;
