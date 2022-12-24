import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import {
  setGameCodes,
  updateGameCodes,
  getGameCodes,
} from "../../firebase/gameCodes";
import { setGameRoomData } from "../../firebase/game";
import { getUserId } from "../../helpers/getUserId";
import { getSixLetterCode } from "../../helpers/getSixLetterCode";
import MainInput from "../../components/MainInput";

import "./style.scss";

const HomePage = observer(({ gameId, setGameId }) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    setGameId(getSixLetterCode());
  }, [setGameId]);

  const navigate = useNavigate();
  const uuid = getUserId();

  const handleClickCreateGame = async () => {
    try {
      let codeArr = [];
      const codesDoc = await getGameCodes();

      if (codesDoc.exists()) {
        codesDoc.data().codes.forEach((element) => {
          codeArr.push(element);
        });
        while (codeArr.indexOf(gameId) !== -1) {
          setGameId(getSixLetterCode());
        }
        codeArr.push(gameId);
        await updateGameCodes({
          codes: codeArr,
        });
      } else {
        codeArr.push(gameId);
        await setGameCodes({
          codes: codeArr,
        });
      }

      await setGameRoomData({
        gameId,
        values: {
          host_uid: uuid,
          players_list: [],
          banned_players_uid_list: [],
          midgame_player_uid_list: [],
          current_player_uid: uuid,
          game_room_closed: false,
          ongoing_game: false,
          game_board: {},
          game_stage: "click",
        },
      });

      navigate(`/game/${gameId}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleClickJoinToGame = async () => {
    if (code !== "") {
      const codesDoc = await getGameCodes();

      if (codesDoc.data().codes.indexOf(code) !== -1) {
        navigate(`/game/${code}`);
      } else {
        // setToast({
        //   type: "danger",
        //   text: "Please enter a valid code",
        // });
      }
    } else {
      // setToast({
      //   type: "danger",
      //   text: "Please enter a code",
      // });
    }
  };

  const handleChange = (value) => {
    setCode(value.toUpperCase());
  };

  return (
    <div>
      FIVE IN A ROW
      <button onClick={handleClickCreateGame}>Create Game</button>
      <MainInput
        label="Enter Game Code"
        btnText="Join"
        maxLength={6}
        value={code}
        onChange={handleChange}
        onClick={handleClickJoinToGame}
      />
    </div>
  );
});

export default HomePage;
