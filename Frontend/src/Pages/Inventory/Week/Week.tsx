import { IWeek, IWorker, IWorkerCard } from "../../../types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useContext, useEffect, useState } from "react";
import "./week.css";
import { IconButton } from "@mui/material";
import { MyContext } from "../../../Components/MyContext";
import axios from "axios";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ValidateInput from "./ValidateInput";
import LinearProgress from "@mui/material/LinearProgress";
import WorkerList from "./WorkerList";

type Props = {
  week: IWeek;
};

const Week = ({ week }: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    response,
    updateResponse,
    updateDataWorker,
    dataWorker,
    updateDataMonth,
  } = useContext(MyContext);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [worName, setWorName] = useState("");
  const columns = [
    { id: "Trabajador" },
    { id: "Cargo" },
    { id: "Total" },
    { id: "Propina" },
    { id: "Inversión" },
    { id: "Ganancia" },
    { id: "Pago" },
    { id: "Eliminar" },
  ];
  const [filterWorkers, setFilterWorkers] = useState<IWorkerCard[]>([]);
  const [showWorkerList, setShowWorkerList] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleResponse = () => {
    updateResponse("");
  };

  const filterList = (a: IWorkerCard[], b: IWorker[]) => {
    const result: IWorkerCard[] = [];

    for (let i = 0; i < a.length; i++) {
      const object1 = a[i];
      const found = b.some((object2) => object2.name === object1.name);

      if (!found) {
        result.push(object1);
      }
    }

    return result;
  };

  const handleDeleteWorker = async () => {
    await axios
      .patch(`http://localhost:1507/delWorkerWeek/${week._id}/${worName}`)
      .then((r) => {
        updateResponse(r.data.response);
        updateDataMonth({ response: null, error: false });
      })
      .catch((e) => console.log("Algo salió mal", e));
  };
  const fetchWorkerCard = async () => {
    await axios
      .get("http://localhost:1507/getWorkers/")
      .then((r) => {
        updateDataWorker(r.data);
        setFilterWorkers(filterList(r.data.response, week.workers));
        setLoading(false);
      })
      .catch((e) => console.log("Ocurrió un error", e));
  };
  const handleAcept = () => {
    handleDeleteWorker();
    setShowAlertDelete(false);
  };
  const handleCancel = () => {
    setShowAlertDelete(false);
  };

  useEffect(() => {
    if (dataWorker.response === null) {
      setLoading(true);
      fetchWorkerCard();
    } else {
      setFilterWorkers(filterList(dataWorker.response, week.workers));
    }
  }, [response]);

  return (
    <>
      <div key={week._id} className="formContainerWeek">
        {loading && <LinearProgress />}
        <TableContainer sx={{ margin: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.id} sx={{ cursor: "default" }}>
                    <div className="centerTableHead">
                      {c.id === "Trabajador" ? (
                        <>
                          Trabajador
                          <IconButton
                            sx={{ color: "#000000" }}
                            onClick={() => setShowWorkerList(true)}
                          >
                            <GroupAddIcon />
                          </IconButton>
                        </>
                      ) : (
                        c.id
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {week.workers.slice(page * 4, page * 4 + 4).map((worker) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={crypto.randomUUID()}
                  >
                    <TableCell>
                      <div className="centerTable">
                        <ListItemAvatar>
                          <Avatar alt="Avatar" src={worker.urlImage} />
                        </ListItemAvatar>
                        {worker.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="centerTable">{worker.ocupation}</div>
                      {worker.ocupation === "Empleado" ? (
                        <div className="centerTable">
                          Pago al {worker.percentOf}%
                        </div>
                      ) : (
                        <></>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="columnTP">
                        <div className="centerTable">{worker.total}</div>
                        <div>
                          <ValidateInput
                            
                            wId={week._id}
                            name={worker.name}
                            tipo="total"
                            pago={worker.percentOf}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="columnTP">
                        <div className="centerTable">{worker.tip}</div>
                        <div>
                          <ValidateInput
                           
                            wId={week._id}
                            name={worker.name}
                            tipo="tip"
                            pago=""
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="centerTable">{worker.investment}</div>
                    </TableCell>
                    <TableCell>
                      <div className="centerTable">{worker.profit}</div>
                    </TableCell>
                    <TableCell>
                      <div className="centerTable">
                        {worker.ocupation === "Empleado" ? worker.payment : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="centerTable">
                        <IconButton
                          sx={{ color: "#DB4437" }}
                          onClick={() => {
                            setShowAlertDelete(true);
                            setWorName(worker.name);
                          }}
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
          sx={{ backgroundColor: "white" }}
          rowsPerPageOptions={[4]}
          component="div"
          count={week.workers.length}
          rowsPerPage={4}
          page={page}
          onPageChange={handleChangePage}
        />
      </div>
      {showWorkerList && (
        <div className="overlay">
          <div className="alertInventory">
            <h2>Trabajadores disponibles para la semana</h2>
            <WorkerList
              wId={week._id}
              list={filterWorkers}
              setShowWorkerList={setShowWorkerList}
            />
          </div>
        </div>
      )}
      {showAlertDelete && (
        <div className="overlay">
          <div className="alert">
            <p>{`¿Estás segura de que deseas eliminar este trabajador?`}</p>
            <div className="btnYear">
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
export default Week;
