export interface IContextType {
  password: string;
  authenticate: boolean;
  updatePassword: (arg: string) => void;
  updateAuthenticate: (arg: boolean) => void;
  response: string;
  updateResponse: (arg: string) => void;
  data: api;
  updateData: (arg: api) => void;
  dataInventory: apiInventory;
  updateDataInventory: (arg: apiInventory) => void;
  dataWorker: apiWorkerCard;
  updateDataWorker: (arg: apiWorkerCard) => void;
  showMonths: string;
  updateShowMonths: (arg: string) => void;
  dataMonth: apiMonth;
  updateDataMonth: (arg: apiMonth) => void;
}

export interface api {
  response: IStowageCard[] | null;
  error: boolean;
}
export interface apiInventory {
  response: IInventory[] | null;
  error: boolean;
}
export interface apiMonth {
  response: IMonth[] | null;
  error: boolean;
}
export interface apiWorkerCard {
  response: IWorkerCard[] | null;
  error: boolean;
}

export interface IInventory {
  _id: string;
  year: number;
  months: IMonth[];
  total: number;
  profit: number;
  investment: number;
  payment: number;
  tip: number;
}

export interface IMonth {
  _id: string;
  name: string;
  weeks: IWeek[] | [];
}

export interface IWeek {
  _id: string;
  name: string;
  total: number;
  profit: number;
  investment: number;
  payment: number;
  tip: number;
  workers: IWorker[];
}

export interface IWorker {
  name: string;
  ocupation: Ocupation;
  urlImage: string;
  total: number;
  profit: number;
  payment: number;
  tip: number;
  investment: number;
  percentOf: string;
}

export interface IWorkerCard {
  name: string;
  ocupation: Ocupation;
  percentOf: string;
  urlImage: string;
}

export enum Ocupation {
  jefe = "Jefe",
  empleado = "Empleado",
}

export interface IStowageCard {
  _id: string;
  productName: string;
  productSpecificity: string;
  unitOfMeasurement: string;
  price: number;
  coin: Coin;
  history: History[];
  urlImage: string;
  historyInversion: historyInversion[];
}
export interface historyInversion {
  data: string;
  price: number;
  inversion: number;
  unit: number;
  coin: Coin;
}

export enum Coin {
  usd = "usd",
  mlc = "mlc",
  cup = "cup",
}
export interface History {
  data: string;
  entrance: number;
  exit: number;
  end: number;
  presentPrice: number;
  presentCoin: string;
}
export interface Column {
  id: "Fecha" | "Entrada" | "Salida" | "Final";
}

export interface Update {
  history: History[];
  price: number;
  coin: Coin;
  urlImage: string;
}
export interface IStatistics {
  history: History[];
  price: number;
  coin: Coin;
  historyInversion: historyInversion[];
}
