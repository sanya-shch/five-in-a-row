import React from "react";

import "./style.scss";

import gameStore from "../../store/game";
import { observer } from "mobx-react-lite";
import { reset, setPoint } from "../../firebase/game";

const GameBlock = observer(({ id }) => {
  const currentPlayerColor = gameStore.playersList.find(
    (item) => item.uid === gameStore.currentPlayerUid
  ).color;

  const handleClick = async ({ point }) => {
    if (
      gameStore.points[point] === 0 &&
      gameStore.currentPlayerUid === gameStore.uuid
    ) {
      await setPoint(id, point, currentPlayerColor, gameStore.points);
    }
  };

  const handleClickReset = async () => {
    await reset(id, gameStore.playersList[0].uid);
  };

  return (
    <div className={`game_block ${currentPlayerColor}`}>
      <div className="game_board">
        {Object.values(gameStore.gameBoard).map((block, blockIndex) => (
          <div key={`matrix-${blockIndex}`} className="block">
            {block.map((point, pointIndex) => (
              <div
                key={`point-${pointIndex}`}
                className={`point ${
                  gameStore.points[point] !== 0 ? gameStore.points[point] : ""
                } ${
                  gameStore.currentPlayerUid === gameStore.uuid ? "" : "without"
                }`}
                onClick={() => handleClick({ point })}
              />
            ))}
          </div>
        ))}
      </div>

      {gameStore.isHost && gameStore.ongoingGame && (
        <div className="info_block">
          <button onClick={handleClickReset}>RESET GAME</button>
        </div>
      )}
    </div>
  );
});

export default GameBlock;
