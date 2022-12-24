import React from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";

import gameStore from "../../store/game";
import { observer } from "mobx-react-lite";
import Tooltip from "../../components/Tooltip";

const Header = observer(() => {
  const navigate = useNavigate();

  const currentPlayerColor = gameStore.playersList.find(
    (item) => item.uid === gameStore.currentPlayerUid
  ).color;

  return (
    <div
      className={`header_block ${
        gameStore.ongoingGame ? currentPlayerColor : ""
      }`}
    >
      <div className="title" onClick={() => navigate("/")}>
        FIVE IN A ROW
      </div>

      {gameStore.ongoingGame && (
        <div className="players_list">
          {gameStore.playersList.map((item) => (
            <Tooltip key={item.color} text={`player_item ${item.username}`}>
              <div className={`player_item ${item.color}`} />
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
});

export default Header;
