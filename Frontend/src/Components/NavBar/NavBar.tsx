import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import BadgeIcon from "@mui/icons-material/Badge";
import "./navbar.css";

const NavBar = () => {
  const navigator = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className="navBar">
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ style: { backgroundColor: "white" } }}
        textColor="inherit"
        variant="fullWidth"
      >
        <Tab icon={<InventoryIcon />} onClick={() => navigator("/inventory")} />
        <Tab icon={<BadgeIcon />} onClick={() => navigator("/workers")} />
        <Tab icon={<StoreIcon />} onClick={() => navigator("/store")} />
      </Tabs>
    </div>
  );
};

export default NavBar;
