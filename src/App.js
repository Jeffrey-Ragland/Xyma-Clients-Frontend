import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Components/MainPage";

const App = () => {
  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    getXymaClients();
  }, []);

  const getXymaClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/sensor/getXymaClients"
      );
      if (response.status === 200) {
        // console.log("data from db", response.data.data);
        setClientData(response.data.data);
      }
    } catch (error) {
      // toast.error("Server Error!");
      console.error("Error getting clients", error);
    }
  };

  console.log("client data", clientData);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage clientData={clientData} />} />
      </Routes>
    </>
  );
};

export default App;
