import { useState, createContext, ReactNode } from "react";
import {
  IContextType,
  api,
  apiInventory,
  apiMonth,
  apiWorkerCard,
} from "../types";

export const MyContext = createContext<IContextType>({
  password: "",
  authenticate: false,

  updatePassword: (arg: string) => {},
  updateAuthenticate: (arg: boolean) => {},
  response: "",
  updateResponse: (arg: string) => {},
  data: { response: null, error: false },
  updateData: (arg: api) => {},
  dataInventory: { response: null, error: false },
  updateDataInventory: (arg: apiInventory) => {},
  dataWorker: { response: null, error: false },
  updateDataWorker: (arg: apiWorkerCard) => {},
  showMonths: "",
  updateShowMonths: (arg: string) => {},
  dataMonth: { response: null, error: false },
  updateDataMonth: (arg: apiMonth) => {},
});

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [password, setPassword] = useState("");
  const [authenticate, setAuthenticate] = useState(false);
  const [response, setResponse] = useState("");
  const [data, setData] = useState<api>({ response: null, error: false });
  const [dataInventory, setDataInventory] = useState<apiInventory>({
    response: null,
    error: false,
  });
  const [dataMonth, setDataMonth] = useState<apiMonth>({
    response: null,
    error: false,
  });
  const [dataWorker, setDataWorker] = useState<apiWorkerCard>({
    response: null,
    error: false,
  });
  const [showMonths, setShowMonths] = useState("");

  const updateShowMonths = (arg: string) => {
    setShowMonths(arg);
  };

  const updateResponse = (resp: string) => {
    setResponse(resp);
  };

  const updatePassword = (passw: string) => {
    setPassword(passw);
  };

  const updateAuthenticate = (auth: boolean) => {
    setAuthenticate(auth);
  };

  const updateData = (argData: api) => {
    setData(argData);
  };
  const updateDataInventory = (argData: apiInventory) => {
    setDataInventory(argData);
  };
  const updateDataMonth = (argData: apiMonth) => {
    setDataMonth(argData);
  };
  const updateDataWorker = (argData: apiWorkerCard) => {
    setDataWorker(argData);
  };

  return (
    <MyContext.Provider
      value={{
        password,
        updatePassword,
        authenticate,
        updateAuthenticate,
        response,
        updateResponse,
        data,
        updateData,
        dataInventory,
        updateDataInventory,
        showMonths,
        updateShowMonths,
        dataWorker,
        updateDataWorker,
        dataMonth,
        updateDataMonth,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
