import React from "react";
import { observer } from "mobx-react-lite";

import "./style.scss";

import gameStore from "../../store/game";
import { reset, setPoint, rotateBlock, playerWin } from "../../firebase/game";
import { chunkArray } from "../../helpers/chunkArray";
import {
  rotateClockwise,
  rotateCounterClockwise,
} from "../../helpers/matrixRotate";
import { getNextPlayerUid } from "../../helpers/getNextPlayerUid";
import Tooltip from "../../components/Tooltip";
import { checkWin } from "../../helpers/checkWin";

import { ReactComponent as ClickSvg } from "../../assets/click-icon.svg";
import { ReactComponent as RotateSvg } from "../../assets/rotate-left-svgrepo-com.svg";
import { ReactComponent as RotateRightSvg } from "../../assets/rotate-right-svgrepo-com.svg";
import { ReactComponent as ResetSvg } from "../../assets/remove-icon.svg";

const GameBlock = observer(({ id }) => {
  const currentPlayerColor = gameStore.playersList.find(
    (item) => item.uid === gameStore.currentPlayerUid
  ).color;

  const handleClick = async ({ point }) => {
    if (
      gameStore.points[point] === 0 &&
      gameStore.currentPlayerUid === gameStore.uuid &&
      gameStore.gameStage === "click"
    ) {
      await setPoint(id, point, currentPlayerColor, gameStore.points);
    }
  };

  const handleClickReset = async () => {
    await reset(id, gameStore.playersList[0].uid);
  };

  const handleRotate = async (right, block, blockIndex) => {
    const matrix = chunkArray(block, 3);

    let newRotatedMatrix = [];

    if (right) {
      newRotatedMatrix = rotateClockwise(matrix);
    } else {
      newRotatedMatrix = rotateCounterClockwise(matrix);
    }

    const nextPlayerUid = getNextPlayerUid(
      gameStore.playersList,
      gameStore.currentPlayerUid
    );

    const win = checkWin(
      gameStore.playersList.map((item) => item.color),
      {
        ...gameStore.gameBoard,
        [blockIndex]: newRotatedMatrix.flat(),
      },
      gameStore.points
    );

    if (win) {
      const winner = gameStore.playersList.find(
        (player) => player.color === win.color
      );

      await playerWin(
        id,
        {
          ...gameStore.gameBoard,
          [blockIndex]: newRotatedMatrix.flat(),
        },
        winner.uid,
        win.points
      );
    } else {
      await rotateBlock(id, nextPlayerUid, {
        ...gameStore.gameBoard,
        [blockIndex]: newRotatedMatrix.flat(),
      });
    }
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
                  gameStore.currentPlayerUid === gameStore.uuid &&
                  gameStore.gameStage === "click"
                    ? ""
                    : "without"
                } ${gameStore.winnerRow.includes(point) ? "win_point" : ""}`}
                onClick={() => handleClick({ point })}
              />
            ))}

            {gameStore.gameStage === "rotate" && (
              <div className="rotate_block">
                <div
                  className="rotate_btn"
                  onClick={() => handleRotate(0, block, blockIndex)}
                >
                  <RotateSvg />
                </div>
                <div
                  className="rotate_btn"
                  onClick={() => handleRotate(1, block, blockIndex)}
                >
                  <RotateRightSvg />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="info_block">
        <ClickSvg
          className={`click_btn ${gameStore.gameStage === "click" ? "on" : ""}`}
        />
        <RotateSvg
          className={`rotate_btn ${
            gameStore.gameStage === "rotate" ? "on" : ""
          }`}
        />
        {gameStore.isHost && gameStore.ongoingGame && (
          <Tooltip text="RESET GAME">
            <ResetSvg className="reset_btn" onClick={handleClickReset} />
          </Tooltip>
        )}
      </div>
    </div>
  );
});

export default GameBlock;
