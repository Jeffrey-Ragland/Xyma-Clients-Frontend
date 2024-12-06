import React, { useState } from "react";
import xymaLogo from "../Assets/xymalogo_white.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiCloseFill } from "react-icons/ri";

const MainPage = ({ clientData }) => {
  const [modifyOpen, setModifyOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [clientLogo, setClientLogo] = useState(null);

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
        window.location.reload();
      } else {
        toast.error("Failed to add Client!");
        console.log("Failed to add client:", response);
      }
    } catch (error) {
      // toast.error("Server Error!");
      console.error("Error adding clients", error);
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
        <img src={xymaLogo} className="max-w-[100px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          XYMA Clients
        </div>
      </div>
      <div
        className="h-2"
        style={{
          background: "linear-gradient(90deg, #FE6F17 0%, #FE9D1C 101.48%)",
        }}
      />
      <div className="flex justify-end items-center p-2">
        <button
          className="px-2 py-1 rounded-md text-sm font-medium text-white hover:scale-110 duration-200"
          style={{
            background: "linear-gradient(90deg, #FE6F17 0%, #FE9D1C 101.48%)",
          }}
          onClick={() => setModifyOpen(true)}
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
            className="flex flex-col items-center justify-center gap-2 px-4 py-2 border border-[#E0E1E6] rounded-lg bg-[#F9F9FB] shadow-lg hover:scale-105 duration-200 cursor-pointer h-[125px] xl:h-[150px] 2xl:h-[200px]"
            onClick={() => window.open(`${client.ClientUrl}`, "_blank")}
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
          </div>
        ))}
      </div>

      {/* modify popup */}
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
      <ToastContainer />
    </div>
  );
};

export default MainPage;
