import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MyProvider } from "../MyContext";
import NavBar from "../NavBar/NavBar";
import Store from "../../Pages/Store/StoreHome/Store";
import StowageForm from "../../Pages/Store/StoreForm/StowageForm";
import Inventory from "../../Pages/Inventory/Year/Inventory";
import "./myroutes.css";
import StowageFormUpdate from "../../Pages/Store/StoreForm/StowageFormUpdate";
import Month from "../../Pages/Inventory/Month/Month";
import Workers from "../../Pages/Workers/WorkerHome/Workers";

export const MyRoutes = () => {
  return (
    <MyProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/stowageForm" element={<StowageForm />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route
            path="/inventory/month/:year/:month/:mId"
            element={<Month />}
          />
          <Route
            path="/store/stowageFormUpdate/:id"
            element={<StowageFormUpdate />}
          />
          <Route path="/workers" element={<Workers />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
};
