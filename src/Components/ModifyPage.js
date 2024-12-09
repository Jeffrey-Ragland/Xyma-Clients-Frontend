import React from "react";
import { useNavigate } from "react-router-dom";

const ModifyPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      modify here
      <button
        className="border border-black"
        onClick={() => {
          localStorage.clear();
          navigate("/dashboardPortal");
        }}
      >
        back
      </button>
    </div>
  );
};

export default ModifyPage;
