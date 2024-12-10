import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import xymaLogo from "../Assets/xymalogo_white.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiCloseFill } from "react-icons/ri";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MainPage = ({ clientData }) => {
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        // "http://localhost:4000/sensor/verifyXymaClientsPassword",
        "http://43.204.133.45:4000/sensor/verifyXymaClientsPassword",
        { username, password }
      );
      if (response.status === 200) {
        if (response.data.success === true) {
          localStorage.setItem("Token", response.data.token);
          navigate(response.data.redirectUrl);
        } else if (response.data.success === false) {
          toast.error("Invalid Credentials");
        }
      }
    } catch (error) {
      console.error("Error verifying password", error);
    }
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div
        className="relative p-2 text-white font-medium"
        style={{
          background: "linear-gradient(90deg, #00133D 0%, #01285C 100%)",
        }}
      >
        <img
          src={xymaLogo}
          className="max-w-[75px] md:max-w-[100px] 2xl:max-w-[125px]"
        />
        <div className="absolute inset-0 flex items-center justify-center font-semibold text-base md:text-xl 2xl:text-2xl">
          XYMA Clients
        </div>
      </div>
      <div
        className="h-2"
        style={{
          background: "linear-gradient(90deg, #FE6F17 0%, #FE9D1C 101.48%)",
        }}
      />
      <div className="flex justify-end items-center p-2 gap-2">
        <button
          className="px-4 py-1 rounded-md text-sm 2xl:text-base font-semibold text-white hover:scale-110 duration-200"
          style={{
            background: "linear-gradient(90deg, #FE6F17 0%, #FE9D1C 101.48%)",
          }}
          onClick={() => setPasswordPopup(true)}
        >
          Modify
        </button>
      </div>

      {/* main content */}
      <div
        className="justify-start items-start p-4 md:p-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-9 overflow-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {clientData.map((client) => (
          <div
            key={client.id}
            className="relative flex flex-col items-center justify-center gap-2 px-4 py-2 border border-[#E0E1E6] rounded-lg bg-[#F9F9FB] shadow-lg hover:scale-105 duration-200 cursor-pointer h-[125px] xl:h-[150px] 2xl:h-[200px]"
            onClick={() => window.open(`${client.ClientUrl}`, "_blank")}
            data-tooltip-id="tooltip-style"
            data-tooltip-content={`Go to -> ${client.ClientUrl}`}
          >
            {client.ClientLogo && (
              <img
                src={`data:${client.LogoContentType};base64, ${client.ClientLogo}`}
                className="max-h-[75px] xl:max-h-[100px] 2xl:max-h-[150px]"
                alt="logo"
              />
            )}
            <div className="font-semibold text-sm 2xl:text-base">
              {client.ClientName}
            </div>
          </div>
        ))}
      </div>

      {/* password popup */}
      {passwordPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            className="relative bg-white rounded-xl px-4 md:px-8 py-3 md:py-6 flex flex-col gap-4 md:gap-6 text-sm md:text-base"
            onSubmit={handleVerifyPassword}
          >
            <div className="">
              <div className="text-center font-semibold text-lg md:text-xl">
                Verify Password
              </div>
              <button
                className="absolute right-3 top-3 rounded-full p-1 text-xl text-white bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => {
                  setPasswordPopup(false);
                  setPassword("");
                  setUsername("");
                }}
              >
                <RiCloseFill />
              </button>
            </div>

            <div className="flex items-center">
              <label htmlFor="username" className="w-1/2">
                Enter Username <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="username..."
                id="username"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="password" className="w-1/2">
                Enter Password <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="password"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="password..."
                id="password"
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white py-1 px-4 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer />

      <ReactTooltip
        id="tooltip-style"
        style={{
          backgroundColor: "black",
          color: "#F9F9FB",
          fontSize: "0.75rem",
        }}
      />
    </div>
  );
};

export default MainPage;
