import { useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";
import axios from "axios";

import { useContext } from "react";
import { MyContext } from "../../../Components/MyContext";

type FormValue = {
  validateInp: string;
};
type Props = {
  pago: string;
  tipo: string;
  wId: string;
  name: string;
};

const ValidateInput = ({ pago, tipo, wId, name }: Props) => {
  const { updateResponse, updateDataMonth } = useContext(MyContext);
  
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<FormValue>();

  const sendData = async (data: FormValue) => {
    const value = "validateInp" in data ? data.validateInp : "";
    if (value !== "") {
      if (tipo === "total") {
        if (pago.length > 0) {
          const total = parseFloat(value);
          const totalData = {
            total: total,
            percentOf: pago,
          };
          await axios
            .patch(
              `http://localhost:1507/updateWeekWorker/${wId}/${name}`,
              totalData
            )
            .then((r) => {
              updateResponse(r.data.response);
              updateDataMonth({ response: null, error: false });
            
            })
            .catch((e) => console.log("Algo salió mal", e));
        } else {
          const total = parseFloat(value);
          const totalData = {
            total: total,
            percentOf: "",
          };

          await axios
            .patch(
              `http://localhost:1507/updateWeekWorker/${wId}/${name}`,
              totalData
            )
            .then((r) => {
              updateResponse(r.data.response);
              updateDataMonth({ response: null, error: false });
             
            })
            .catch((e) => console.log("Algo salió mal", e));
        }
      } else {
        const tip = parseFloat(value);
        const tipData = {
          tip: tip,
        };
        await axios
          .patch(
            `http://localhost:1507/updateWeekWorker/${wId}/${name}`,
            tipData
          )
          .then((r) => {
            updateResponse(r.data.response);
            updateDataMonth({ response: null, error: false });
            
          })
          .catch((e) => console.log("Algo salió mal", e));
      }
      resetField("validateInp");
    } else return;
  };

  return (
    <form onSubmit={handleSubmit(sendData)}>
      <input
        placeholder="0"
        {...register("validateInp", {
          required: true,
          pattern: /^[1-9][0-9]*$/,
        })}
      />
      <IconButton type="submit" sx={{ color: "#0F9D58" }}>
        <Add />
      </IconButton>
      {"validateInp" in errors && errors.validateInp?.type === "pattern" && (
        <div className="error">Solo números mayor a 0</div>
      )}
    </form>
  );
};
export default ValidateInput;
