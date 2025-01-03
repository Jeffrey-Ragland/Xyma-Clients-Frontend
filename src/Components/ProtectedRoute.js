import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("Token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          //   "http://localhost:4000/sensor/xymaClientsValidateToken",
          "http://43.204.133.45:4000/sensor/xymaClientsValidateToken",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.status === 200 && response.data?.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error validating token:", error);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading ...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboardPortal" replace />;
  }

  return <Outlet />;

  //   return isAuthenticated ? <Outlet /> : <Navigate to="/dashboardPortal" />;
};

export default ProtectedRoute;
