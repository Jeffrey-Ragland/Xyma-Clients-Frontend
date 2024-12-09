import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import xymaLogo from "../Assets/xymalogo_white.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiCloseFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MainPage = ({ clientData }) => {
  const [modifyOpen, setModifyOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [clientLogo, setClientLogo] = useState(null);
  const [clientHovered, setClientHovered] = useState(null);
  const [deletPopup, setDeletePopup] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
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
        "http://localhost:4000/sensor/verifyXymaClientsPassword",
        { username, password }
      );
      if (response.status === 200) {
        if (response.data.success === true) {
          localStorage.setItem("Token", response.data.token);
          console.log("url", response.data.redirectUrl);
          navigate(response.data.redirectUrl);
        } else if (response.data.success === false) {
          toast.error("Invalid Credentials");
        }
      }
    } catch (error) {
      console.error("Error verifying password", error);
    }
  };

  const handleAddClients = async (e) => {
    e.preventDefault();

    if (!clientLogo) {
      toast.warning("Please upload client logo");
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(clientLogo.type)) {
      toast.warning("Please upload a valid image file (JPG, PNG, GIF, WEBP).");
      setClientLogo(null);

      const fileInput = document.getElementById("clientLogo");
      if (fileInput) {
        fileInput.value = null;
      }
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (clientLogo.size > maxSizeInBytes) {
      toast.warning("Please upload an image smaller than 5MB.");
      setClientLogo(null);

      const fileInput = document.getElementById("clientLogo");
      if (fileInput) {
        fileInput.value = null;
      }
      return;
    }

    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("clientUrl", clientUrl);
    formData.append("clientLogo", clientLogo);

    try {
      const response = await axios.post(
        "http://localhost:4000/sensor/addXymaClients",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Client added successfully!");
        setClientName("");
        setClientUrl("");
        setClientLogo(null);

        const fileInput = document.getElementById("clientLogo");
        if (fileInput) {
          fileInput.value = null;
        }
      } else {
        toast.error("Failed to add Client!");
        console.log("Failed to add client:", response);
      }
    } catch (error) {
      // toast.error("Server Error!");
      console.error("Error adding clients", error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    console.log("client id", clientId);
    try {
      const response = await axios.post(
        "http://localhost:4000/sensor/deleteXymaClients",
        { clientId }
      );
      if (response.status === 200) {
        toast.success("Client deleted successfully!");
      } else {
        toast.error("Failed to delete Client!");
        console.log("Failed to delete client:", response);
      }
    } catch (error) {
      console.error("Error deleting clients", error);
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
        <img src={xymaLogo} className="max-w-[100px] 2xl:max-w-[125px]" />
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
        {/* <button
          className="px-4 py-1 rounded-md text-sm 2xl:text-base font-semibold text-white hover:scale-110 duration-200"
          style={{
            background: "linear-gradient(90deg, #FE6F17 0%, #FE9D1C 101.48%)",
          }}
          onClick={() => setModifyOpen(true)}
        >
          Credentials
        </button>

        <button
          className="px-4 py-1 rounded-md text-sm 2xl:text-base font-semibold text-white hover:scale-110 duration-200"
          style={{
            background: "linear-gradient(90deg, #FE6F17 0%, #FE9D1C 101.48%)",
          }}
          onClick={() => setModifyOpen(true)}
        >
          Add Clients
        </button> */}

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
            onMouseEnter={() => setClientHovered(client.id)}
            onMouseLeave={() => setClientHovered(null)}
            data-tooltip-id="tooltip-style"
            data-tooltip-content={`Go to -> ${client.ClientUrl}`}
          >
            {/* <div>{client.ClientUrl}</div> */}
            {client.ClientLogo && (
              <img
                src={`data:${client.LogoContentType};base64, ${client.ClientLogo}`}
                className="max-h-[75px] xl:max-h-[100px] 2xl:max-h-[150px]"
                alt="logo"
              />
            )}
            <div className="font-medium text-sm 2xl:text-base">
              {client.ClientName}
            </div>

            {clientHovered === client.id && (
              <div
                className="absolute top-2 right-2 text-[#FE6F17] text-2xl 2xl:text-3xl"
                onClick={(e) => {
                  setDeleteClientId(client.id);
                  setDeletePopup(true);
                  e.stopPropagation();
                }}
              >
                <FaTrashAlt />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* add popup */}
      {modifyOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            className="bg-white rounded-xl p-6 flex flex-col gap-4"
            onSubmit={handleAddClients}
          >
            <div className="relative px-2">
              <div className="text-center font-semibold text-xl">
                Add Client
              </div>
              <button
                className="absolute right-0 top-0 rounded-full p-1 text-xl text-white bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => {
                  setModifyOpen(false);
                  setClientName("");
                  setClientUrl("");
                  setClientLogo(null);

                  const fileInput = document.getElementById("clientLogo");
                  if (fileInput) {
                    fileInput.value = null;
                  }
                  window.location.reload();
                }}
              >
                <RiCloseFill />
              </button>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-col gap-4 font-medium">
                <label htmlFor="clientName" className="">
                  Enter Client Name <span className="text-[#CE2C31]">*</span>
                </label>
                <label htmlFor="clientUrl">
                  Enter Client URL <span className="text-[#CE2C31]">*</span>
                </label>
                <label htmlFor="clientLogo">
                  Upload Client Logo <span className="text-[#CE2C31]">*</span>
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 "
                  placeholder="client name..."
                  id="clientName"
                  required
                  autoComplete="off"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <input
                  type="text"
                  className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600"
                  placeholder="client url..."
                  id="clientUrl"
                  required
                  autoComplete="off"
                  value={clientUrl}
                  onChange={(e) => setClientUrl(e.target.value)}
                />
                <input
                  type="file"
                  className="focus:outline-none focus:border-gray-600 text-sm"
                  id="clientLogo"
                  onChange={(e) => setClientLogo(e.target.files[0])}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white py-1 px-8 rounded-lg focus:outline-none focus:shadow-outline hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* delete popup */}
      {deletPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 flex flex-col gap-6">
            <div className="font-medium">
              Are you sure you want to delete this client?
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="text-gray-600 py-1 px-4 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gray-300"
                onClick={() => setDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="text-white py-1 px-4 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => {
                  handleDeleteClient(deleteClientId);
                  setDeletePopup(false);
                  window.location.reload();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* password popup */}
      {passwordPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            className="relative bg-white rounded-xl px-8 py-6 flex flex-col gap-6"
            onSubmit={handleVerifyPassword}
          >
            <div className="">
              <div className="text-center font-semibold text-xl">
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
