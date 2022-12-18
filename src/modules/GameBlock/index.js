import React from "react";

import "./style.scss";

import gameStore from "../../store/game";
import { observer } from "mobx-react-lite";

const GameBlock = observer(({ id }) => {
  const currentPlayerColor = gameStore.playersList.find(
    (item) => item.uid === gameStore.currentPlayerUid
  ).color;

  const handleClick = () => {
    console.log("handleClick");
  };

  return (
    <div className={`game_block ${currentPlayerColor}`}>
      <div className="game_board">
        {Object.values(gameStore.gameBoard).map((block, blockIndex) => (
          <div key={`block-${blockIndex}`} className="block">
            {block.map((item, itemIndex) => (
              <div key={`item-${itemIndex}`} className="item">
                {item.map((point, pointIndex) => (
                  <div
                    key={`point-${pointIndex}`}
                    className={`point ${point.color ? point.color : ""}`}
                    onClick={() => !point.color && handleClick()}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default GameBlock;
