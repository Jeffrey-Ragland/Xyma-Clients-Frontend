import React, { useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import xymaLogo from "../Assets/xymalogo_white.png";
import axios from "axios";
import { RiCloseFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

const ModifyPage = ({ clientData, clientCredentials }) => {
  const [modifyOpen, setModifyOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [clientLogo, setClientLogo] = useState(null);
  const [deletPopup, setDeletePopup] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [credentialsPopup, setCredentialsPopup] = useState(false);
  const [addCredentialsPopup, setAddCredentialsPopup] = useState(false);
  const [credentialsClientName, setCredentialsClientName] = useState("");
  const [credentialsProjectName, setCredentialsProjectName] = useState("");
  const [credentialsEmail, setCredentialsEmail] = useState("");
  const [credentialsPassword, setCredentialsPassword] = useState("");
  const [deleteCredentialsId, setDeleteCredentialsId] = useState(null);
  const [deleteCredentialsPopup, setDeleteCredentialsPopup] = useState(false);

  //   console.log("client id", deleteClientId);

  const navigate = useNavigate();

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
        // "http://localhost:4000/sensor/addXymaClients",
        "http://43.204.133.45:4000/sensor/addXymaClients",
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
    // console.log("client id", clientId);
    try {
      const response = await axios.post(
        // "http://localhost:4000/sensor/deleteXymaClients",
        "http://43.204.133.45:4000/sensor/deleteXymaClients",
        { clientId }
      );
      if (response.status === 200) {
        toast.success("Client deleted successfully!");
      } else {
        toast.error("Failed to delete Client!");
        console.log("Failed to delete client:", response);
      }
      setDeleteClientId(null);
    } catch (error) {
      console.error("Error deleting clients", error);
    }
  };

  const handleAddCredentials = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        // "http://localhost:4000/sensor/addXymaCredentials",
        "http://43.204.133.45:4000/sensor/addXymaCredentials",
        {
          credentialsClientName,
          credentialsProjectName,
          credentialsEmail,
          credentialsPassword,
        }
      );
      if (response.status === 200) {
        toast.success("Credentials added successfully!");
        setCredentialsClientName("");
        setCredentialsProjectName("");
        setCredentialsEmail("");
        setCredentialsPassword("");
      } else {
        toast.error("Failed to add Client!");
        console.log("Failed to add client:", response);
      }
    } catch (error) {
      console.error("Error adding credentials", error);
    }
  };

  const handleDeleteCredential = async (credentialId) => {
    try {
      const response = await axios.post(
        // "http://localhost:4000/sensor/deleteXymaCredentials",
        "http://43.204.133.45:4000/sensor/deleteXymaCredentials",
        { credentialId }
      );
      if (response.status === 200) {
        toast.success("Credential deleted successfully!");
      } else {
        toast.error("Failed to delete credential!");
        console.log("Failed to delete credential:", response);
      }
      setDeleteCredentialsId(null);
    } catch (error) {
      console.error("Error deleting credentials", error);
    }
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div
        className="relative p-2 text-white font-medium flex justify-between items-center"
        style={{
          background: "linear-gradient(90deg, #00133D 0%, #01285C 100%)",
        }}
      >
        <img
          src={xymaLogo}
          className="max-w-[75px] md:max-w-[100px] 2xl:max-w-[125px]"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base md:text-xl 2xl:text-2xl">
          XYMA Clients / Modify
        </div>
        <button
          className="bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C] px-4 py-1 rounded-md text-sm 2xl:text-base font-semibold text-white hover:scale-110 duration-200"
          onClick={() => {
            localStorage.clear();
            navigate("/dashboardPortal");
          }}
        >
          Back
        </button>
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
          onClick={() => setCredentialsPopup(true)}
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
        </button>
      </div>

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

            <div
              className="absolute top-2 right-2 text-[#FE6F17] text-base md:text-2xl 2xl:text-3xl"
              onClick={(e) => {
                setDeleteClientId(client.id);
                setDeletePopup(true);
                e.stopPropagation();
              }}
            >
              <FaTrashAlt />
            </div>
          </div>
        ))}
      </div>

      {/* add popup */}
      {modifyOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <form
            className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 text-sm md:text-base mx-4"
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

            <div className="flex items-center">
              <label htmlFor="clientName" className="w-1/2">
                Enter Client Name <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="client name..."
                id="clientName"
                required
                autoComplete="off"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="clientUrl" className="w-1/2">
                Enter Client URL <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="client url..."
                id="clientUrl"
                required
                autoComplete="off"
                value={clientUrl}
                onChange={(e) => setClientUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="clientLogo" className="w-1/2">
                Upload Client Logo <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="file"
                className="focus:outline-none focus:border-gray-600 text-sm w-1/2"
                id="clientLogo"
                onChange={(e) => setClientLogo(e.target.files[0])}
              />
            </div>

            {/* <div className="flex gap-2">
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
            </div> */}

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
          <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 md:gap-6">
            <div className="font-medium">
              Are you sure you want to delete this client?
            </div>
            <div className="flex justify-end gap-2 md:gap-4">
              <button
                className="text-gray-600 py-1 px-4 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gray-300"
                onClick={() => {
                  setDeletePopup(false);
                  setDeleteClientId(null);
                }}
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

      {/* credentials popup */}
      {credentialsPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center ">
          <div className="relative bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 w-[90%] md:w-[75%] h-[75%]">
            <div>
              <div className="text-center font-semibold text-xl">
                Login Credentials
              </div>
              <button
                className="absolute right-3 top-3 rounded-full p-1 text-xl text-white bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => {
                  setCredentialsPopup(false);
                  setCredentialsClientName("");
                  setCredentialsProjectName("");
                  setCredentialsEmail("");
                  setCredentialsPassword("");
                }}
              >
                <RiCloseFill />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white py-1 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => setAddCredentialsPopup(true)}
              >
                Add Credentials
              </button>
            </div>

            {clientCredentials.length > 0 ? (
              <div className="h-full overflow-auto flex flex-col gap-4 px-2">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-center border border-[#E0E1E6] bg-[#F9F9FB] font-medium text-sm 2xl:text-base w-1/5">
                        Client Name
                      </th>
                      <th className="px-4 py-2 text-center border border-[#E0E1E6] bg-[#F9F9FB] font-medium text-sm 2xl:text-base w-1/5">
                        Project Name
                      </th>
                      <th className="px-4 py-2 text-center border border-[#E0E1E6] bg-[#F9F9FB] font-medium text-sm 2xl:text-base w-1/5">
                        Email
                      </th>
                      <th className="px-4 py-2 text-center border border-[#E0E1E6] bg-[#F9F9FB] font-medium text-sm 2xl:text-base w-1/5">
                        Password
                      </th>
                      <th className="px-4 py-2 text-center border border-[#E0E1E6] bg-[#F9F9FB] font-medium text-sm 2xl:text-base w-1/5">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientCredentials.map((credential) => (
                      <tr
                        key={credential._id}
                        className="bg-white border-b border-[#E0E1E6]"
                      >
                        <td className="px-4 py-2 text-sm 2xl:text-base">
                          {credential.ClientName}
                        </td>
                        <td className="px-4 py-2 text-sm 2xl:text-base">
                          {credential.ProjectName}
                        </td>
                        <td className="px-4 py-2 text-sm 2xl:text-base">
                          {credential.Email}
                        </td>
                        <td className="px-4 py-2 text-sm 2xl:text-base">
                          {credential.Password}
                        </td>
                        <td
                          className="px-4 py-2 bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C] text-white rounded-md cursor-pointer flex items-center justify-center hover:scale-110 duration-200"
                          onClick={() => {
                            setDeleteCredentialsId(credential._id);
                            setDeleteCredentialsPopup(true);
                          }}
                        >
                          <FaTrashAlt />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-full flex justify-center items-center text-gray-700">
                No credentials Available
              </div>
            )}
          </div>
        </div>
      )}

      {/* delete credentials popup */}
      {deleteCredentialsPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 md:gap-6">
            <div className="font-medium">
              Are you sure you want to delete this credential?
            </div>
            <div className="flex justify-end gap-2 md:gap-4">
              <button
                className="text-gray-600 py-1 px-4 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gray-300"
                onClick={() => {
                  setDeleteCredentialsPopup(false);
                  setDeleteCredentialsId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="text-white py-1 px-4 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => {
                  handleDeleteCredential(deleteCredentialsId);
                  setDeleteCredentialsPopup(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* add credentials popup */}
      {addCredentialsPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center text-sm md:text-base">
          <form
            className="relative bg-white rounded-xl p-4 md:p-6 flex flex-col gap-4 md:min-w-[400px] mx-4"
            onSubmit={handleAddCredentials}
          >
            <div>
              <div className="text-center font-semibold text-xl">
                Add Credentials
              </div>
              <button
                className="absolute right-2 top-2 rounded-full p-1 text-xl text-white bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
                onClick={() => setAddCredentialsPopup(false)}
              >
                <RiCloseFill />
              </button>
            </div>

            <div className="flex items-center">
              <label htmlFor="credentialsClientName" className="w-1/2">
                Enter Client Name <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="client name..."
                id="credentialsClientName"
                required
                autoComplete="off"
                value={credentialsClientName}
                onChange={(e) => setCredentialsClientName(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="credentialsProjectName" className="w-1/2">
                Enter Project Name <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="project name..."
                id="credentialsProjectName"
                required
                autoComplete="off"
                value={credentialsProjectName}
                onChange={(e) => setCredentialsProjectName(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="credentialsEmail" className="w-1/2">
                Enter Email <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="client name..."
                id="credentialsEmail"
                required
                autoComplete="off"
                value={credentialsEmail}
                onChange={(e) => setCredentialsEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="credentialsPassword" className="w-1/2">
                Enter Password <span className="text-[#CE2C31]">*</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 rounded-sm px-1 text-gray-800 focus:outline-none focus:border-gray-600 w-1/2"
                placeholder="client name..."
                id="credentialsPassword"
                required
                autoComplete="off"
                value={credentialsPassword}
                onChange={(e) => setCredentialsPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white py-1 px-8 rounded-lg hover:scale-110 duration-200 text-sm 2xl:text-base font-semibold bg-gradient-to-r from-[#FE6F17] to-[#FE9D1C]"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      <ReactTooltip
        id="tooltip-style"
        style={{
          backgroundColor: "black",
          color: "#F9F9FB",
          fontSize: "0.75rem",
        }}
      />

      <ToastContainer />
    </div>
  );
};

export default ModifyPage;
