import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import "./style.scss";

import gameStore from "../../store/game";
import {
  banPlayer,
  deleteGameRoom,
  removePlayer,
  startGame,
  updateGameRoomData,
} from "../../firebase/game";
import { updateGameCodesById } from "../../firebase/gameCodes";

const StartBlock = observer(({ id }) => {
  const navigate = useNavigate();

  const handleBan = async (uid) => {
    await banPlayer(
      id,
      uid,
      gameStore.playersList.filter((player) => player.uid !== uid)
    );
  };

  const handleOut = async (uid) => {
    const player = gameStore.playersList.find((arr) => arr.uid === uid);

    await removePlayer(id, player);
  };

  let sourceElement = null;

  const setPlayersList = async (list) => {
    await updateGameRoomData(id, {
      players_list: list,
    });
  };

  const handleDragStart = (event) => {
    event.target.style.opacity = 0.5;
    sourceElement = event.target;
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (event) => {
    event.target.classList.add("over");
  };

  const handleDragLeave = (event) => {
    event.target.classList.remove("over");
  };

  const handleDrop = (event) => {
    event.stopPropagation();

    if (sourceElement !== event.target) {
      const list = gameStore.playersList.filter(
        (item, index) => index.toString() !== sourceElement.id
      );

      const removed = gameStore.playersList[sourceElement.id];

      let insertAt = Number(event.target.id);

      let tempList = [];

      if (insertAt >= list.length) {
        tempList = list.slice(0).concat(removed);
        console.log({
          tempList,
          removed,
          list,
          playersList: gameStore.playersList,
        });
        setPlayersList(tempList);

        event.target.classList.remove("over");
      } else if (insertAt < list.length) {
        tempList = list.slice(0, insertAt).concat(removed);

        const newList = tempList.concat(list.slice(insertAt));

        setPlayersList(newList);
        event.target.classList.remove("over");
      }
    } else console.log("nothing happened");
    event.target.classList.remove("over");
  };

  const handleDragEnd = (event) => {
    event.target.style.opacity = 1;
  };

  const handleClickStart = async () => {
    if (gameStore.playersList.length >= 2) {
      await startGame(id, gameStore.playersList[0].uid);
    } else {
      // setToast({
      //   type: "danger",
      //   text: "At least 2 players are required",
      // });
    }
  };

  const handleClickDelete = async () => {
    // await updateDoc(doc(db, "game_rooms_poker", id), {
    //   game_room_closed: true,
    // });
    await deleteGameRoom(id);
    await updateGameCodesById(id);

    navigate("/");
  };

  const handleClickLeave = async () => {
    const player = gameStore.playersList.find(
      (arr) => arr.uid === gameStore.uuid
    );

    await removePlayer(id, player);

    navigate("/");
  };

  return (
    <div className="start_block">
      {gameStore.playersList.map((player, index) => (
        <div
          key={player?.uid}
          className={`player_item ${gameStore.isHost ? "dnd-list" : ""} ${
            player?.uid === gameStore.uuid ? "current" : ""
          } ${player.color}`}
          draggable={gameStore.isHost}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          id={index}
        >
          <p>{player.username}</p>

          {gameStore.isHost && player?.uid !== gameStore.uuid && (
            <>
              <button type="button" onClick={() => handleBan(player?.uid)}>
                Ban
              </button>
              <button type="button" onClick={() => handleOut(player?.uid)}>
                Out
              </button>
            </>
          )}
        </div>
      ))}

      {gameStore.isHost ? (
        <div className="btn-block">
          <button onClick={handleClickDelete}>Delete Room</button>
          <button onClick={handleClickStart}>Start Game</button>
        </div>
      ) : (
        <div className="btn-block">
          <button onClick={handleClickLeave}>Leave</button>
        </div>
      )}
    </div>
  );
});

export default StartBlock;
