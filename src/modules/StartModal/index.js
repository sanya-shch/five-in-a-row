import React, { useState, useMemo } from "react";

import "./style.scss";

import ReactPortal from "../../components/ReactPortal";
import Input from "../../components/Input";
import { observer } from "mobx-react-lite";
import gameStore from "../../store/game";
import { addPlayer } from "../../firebase/game";

const colorsList = ["green", "blue", "red", "yellow"];

const StartModal = observer(({ isOpen, handleClose, id }) => {
  const usersColorsList = useMemo(
    () => gameStore.playersList.map((item) => item.color),
    [gameStore.playersList]
  );
  const filteredColorsList = useMemo(
    () => colorsList.filter((item) => !usersColorsList.includes(item)),
    [usersColorsList]
  );

  const [checkedColor, setCheckedColor] = useState(filteredColorsList[0]);
  const [username, setUsername] = useState("");

  const handleClick = () => {
    if (checkedColor && username) {
      addPlayer(id, {
        username,
        color: checkedColor,
        uid: gameStore.uuid,
        points: 0,
      });

      // if (ongoingGame) {
      //   // updateDoc(doc(db, "game_rooms_poker", id), {
      //   //   midgame_player_uid: arrayUnion(uuid),
      //   // });
      // }

      handleClose();
    } else {
      if (!username) {
        // setToast({
        //   type: "danger",
        //   text: "Enter your username",
        // });
      }
      if (!checkedColor) {
        // setToast({
        //   type: "danger",
        //   text: "Select the icon",
        // });
      }
    }
  };

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  // React.useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden";
  //   }
  //
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-start-modal">
      <div className="start-modal">
        <div className="modal-content">
          <div className="input_name_block">
            <Input
              maxLength={12}
              value={username}
              onChange={handleChange}
              autofocus
            />
          </div>
          <div className="content_block">
            <div className="colors_block">
              {filteredColorsList.map((item) => (
                <div
                  key={`color-${item}`}
                  className={`${item} ${
                    item === checkedColor ? "checked" : ""
                  }`}
                  onClick={() => setCheckedColor(item)}
                />
              ))}
            </div>
          </div>
          <div className="btn_block">
            <button className="main_button" onClick={handleClick}>
              Join
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
});

export default StartModal;
