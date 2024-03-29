import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StowageCard from "./StowageCard";
import "./store.css";
import { IStowageCard } from "../../../types";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../Components/MyContext";
import LinearProgress from "@mui/material/LinearProgress";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PostAddIcon from '@mui/icons-material/PostAdd';

const Store = () => {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const { response, data, updateData, updateResponse } = useContext(MyContext);

  const fetchCard = async () => {
    await axios
      .get("http://localhost:1507/getStowageCard/")
      .then((r) => {
        updateData(r.data);
        setLoading(false);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };

  useEffect(() => {
    if (data.response === null) {
      setLoading(true);
      fetchCard();
    }
  }, [response]);

  const handleResponse = () => {
    updateResponse("");
  };
  return (
    <>
      <IconButton
        sx={{ color: "#000000" }}
        onClick={() => navigator("/store/StowageForm")}
      >
        <PostAddIcon fontSize="large" />
      </IconButton>

      {loading && <LinearProgress />}
      <div className="storeCards">
        {data.response ? (
          data.response.map((c: IStowageCard) => {
            return (
              <StowageCard
                key={c._id}
                dataCard={{
                  _id: c._id,
                  productName: c.productName,
                  productSpecificity: c.productSpecificity,
                  unitOfMeasurement: c.unitOfMeasurement,
                  price: c.price,
                  coin: c.coin,
                  history: c.history,
                  urlImage: c.urlImage,
                  historyInversion: c.historyInversion,
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
export default Store;
