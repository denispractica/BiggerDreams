import { useContext, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { MyContext } from "../../../Components/MyContext";
import axios from "axios";
import { IconButton } from "@mui/material";
import { IWorkerCard } from "../../../types";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

type Props = {
  wId: string;
  list: IWorkerCard[];
  setShowWorkerList: (arg: boolean) => void;
};

const WorkerList = ({ list, setShowWorkerList, wId }: Props) => {
  const { updateResponse, updateDataMonth } = useContext(MyContext);
  const [checked, setChecked] = useState<IWorkerCard[]>([]);

  const handleToggle = (value: IWorkerCard) => {
    const selectedIndex = checked.findIndex((item) => item.name === value.name);
    let newChecked = [];
    if (selectedIndex === -1) {
      newChecked = [...checked, value];
    } else {
      newChecked = checked.filter((item) => item.name !== value.name);
    }
    setChecked(newChecked);
  };

  const sendWorkers = async () => {
    if (checked.length > 0) {
      const workers = { workers: checked };
      await axios
        .patch(`http://localhost:1507/updateWeeksetWorker/${wId}`, workers)
        .then((r) => {
          updateDataMonth({ response: null, error: false });
          setShowWorkerList(false);
          updateResponse(r.data.response);
        })
        .catch((e) => console.log("Ocurrió un error", e));
    } else {
      updateResponse("Selecciona algún trabajador");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <List
        dense
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      >
        {list.length === 0 ? (
          <IconButton sx={{display:"flex", margin: "auto" }}>
            <SentimentVeryDissatisfiedIcon fontSize="large" />
          </IconButton>
        ) : (
          list.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value.name}`;
            return (
              <ListItem
                key={value.name}
                secondaryAction={
                  <Checkbox onChange={() => handleToggle(value)} edge="end" />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt="Avatar" src={value.urlImage} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={value.name} />
                </ListItemButton>
              </ListItem>
            );
          })
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            onClick={() => setShowWorkerList(false)}
            sx={{
              color: "#DB4437",
              margin: "auto",
            }}
          >
            <CancelIcon fontSize="large" />
          </IconButton>

          <IconButton
            onClick={() => sendWorkers()}
            sx={{
              color: "#4285F4",
              margin: "auto",
            }}
          >
            <ThumbUpAltIcon fontSize="large" />
          </IconButton>
        </div>
      </List>
    </div>
  );
};
export default WorkerList;
