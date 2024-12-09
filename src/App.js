import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./Components/MainPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import ModifyPage from "./Components/ModifyPage";

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
    // <>
    //   <Routes>
    //     <Route
    //       path="/dashboardPortal"
    //       element={<MainPage clientData={clientData} />}
    //     />
    //     <Route path="/" element={<ProtectedRoute />}>
    //       <Route path="modify" element={<ModifyPage />} />
    //     </Route>
    //   </Routes>
    // </>

    <>
      <Routes>
        {/* Redirect root path to dashboardPortal */}
        <Route path="/" element={<Navigate to="/dashboardPortal" replace />} />

        {/* Main page route */}
        <Route
          path="/dashboardPortal"
          element={<MainPage clientData={clientData} />}
        />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="modify" element={<ModifyPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
