import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./Components/MainPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import ModifyPage from "./Components/ModifyPage";

const App = () => {
  const [clientData, setClientData] = useState([]);
  const [clientCredentials, setClientCredentials] = useState([]);

  useEffect(() => {
    getXymaClients();
  }, []);

  useEffect(() => {
    getXymaCredentials();

    const interval = setInterval(getXymaCredentials, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getXymaClients = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:4000/sensor/getXymaClients"
        "http://43.204.133.45:4000/sensor/getXymaClients"
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

  const getXymaCredentials = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:4000/sensor/getXymaCredentials"
        "http://43.204.133.45:4000/sensor/getXymaCredentials"
      );
      if (response.status === 200) {
        setClientCredentials(response.data.data);
      }
    } catch (error) {
      console.error("Error getting credentials", error);
    }
  };

  // console.log("client data", clientData);
  // console.log("credentials", clientCredentials);

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
          <Route
            path="modify"
            element={
              <ModifyPage
                clientData={clientData}
                clientCredentials={clientCredentials}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
