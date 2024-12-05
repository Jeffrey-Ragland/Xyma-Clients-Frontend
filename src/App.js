import React, { useEffect, useState } from "react";
import xymaLogo from "./Assets/xymalogo_white.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const App = () => {
  const [modifyOpen, setModifyOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    getXymaClients();

    const xymaInterval = setInterval(getXymaClients, 2000);

    return () => {
      clearInterval(xymaInterval);
    };
  }, []);

  const handleAddClients = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:4000/sensor/addXymaClients",
        {
          clientName,
          clientUrl,
        }
      );
      if (response.status === 200) {
        toast.success("Client added successfully!");
        setClientName("");
        setClientUrl("");
      } else {
        toast.error("Failed to add Client!");
        console.log("Failed to add client:", response);
      }
    } catch (error) {
      // toast.error("Server Error!");
      console.error("Error adding clients", error);
    }
  };

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
    <div className="relative xl:h-screen flex flex-col">
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
        className="flex-1 justify-start items-start p-4 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 overflow-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* <div className=" max-h-[50%] overflow-auto border border-black"> */}
        {clientData.map((client, index) => (
          <div
            key={index}
            className="border border-black flex flex-col gap-2 p-4"
          >
            <div>{client.ClientName}</div>
            <div>{client.ClientUrl}</div>
          </div>
        ))}
        {/* </div> */}
      </div>

      {/* modify popup */}
      {modifyOpen && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center">
          <form
            className="border border-black bg-white p-4 flex flex-col gap-4"
            onSubmit={handleAddClients}
          >
            <div className="relative px-2 border border-black">
              <div className="text-center">Add Client</div>
              <button
                className="absolute right-0 top-0 border border-black rounded-full p-1"
                onClick={() => setModifyOpen(false)}
              >
                X
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex flex-col gap-2">
                <label htmlFor="clientName">Enter Client Name</label>
                <label htmlFor="clientUrl">Enter Client URL</label>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="border border-black"
                  id="clientName"
                  required
                  autoComplete="off"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <input
                  type="text"
                  className="border border-black"
                  id="clientUrl"
                  required
                  autoComplete="off"
                  value={clientUrl}
                  onChange={(e) => setClientUrl(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="border border-black">
              Add
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
