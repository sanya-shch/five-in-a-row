import React from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header_block">
      <div className="title" onClick={() => navigate("/")}>
        FIVE IN A ROW
      </div>
    </div>
  );
};

export default Header;
