import { makeAutoObservable } from "mobx";

import { snakeToCamel } from "../helpers/snakeToCamel";
import { getUserId } from "../helpers/getUserId";

class GameStore {
  hostUid = null;
  gameRoomClosed = false;
  bannedPlayersUidList = [];
  currentPlayerUid = null;
  playersList = [];
  midgamePlayerUidList = [];
  ongoingGame = false;

  isStartModalOpen = false;
  isWaitStart = false;

  uuid = getUserId();

  constructor() {
    makeAutoObservable(this);
  }

  // addPlayer(player) {
  //   this.playersList.push(player);
  // }

  setIsStartModalOpen(value) {
    this.isStartModalOpen = value;
  }

  setGameData(gameData, navigate) {
    const convertedData = Object.entries(gameData).reduce(
      (acc, [key, value]) => {
        const newKey = snakeToCamel(key);

        acc[newKey] = value;

        return acc;
      },
      {}
    );

    Object.entries(convertedData).forEach(([key, value]) => {
      // console.log(key);
      this[key] = value;
    });

    // checkIfUserExists
    let userExists = false;
    this.playersList.forEach((element) => {
      if (this.uuid === element.uid) {
        userExists = true;
      }
    });
    if (!userExists) {
      this.isStartModalOpen = true;
      this.isWaitStart = false;
    } else if (this.playersList.length >= 4) {
      // "There are too many players in this game"
      navigate("/");
    } else {
      this.isWaitStart = true;
    }
  }
}

export default new GameStore();
