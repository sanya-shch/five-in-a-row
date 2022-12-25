import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";

export const setGameRoomData = ({ gameId, values }) =>
  setDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), values);

export const getGameRoomData = (id) =>
  getDoc(doc(db, "game_rooms_five_in_a_row", id));

export const onSnapshotGame = (id, func) =>
  onSnapshot(doc(db, "game_rooms_five_in_a_row", id), func);

export const updateGameRoomData = (gameId, values) =>
  updateDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), values);

export const addPlayer = (gameId, values) =>
  updateDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), {
    players_list: arrayUnion(values),
  });

export const removePlayer = (id, values) =>
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    players_list: arrayRemove(values),
  });

export const banPlayer = (id, banned_player_uid, players_list) =>
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    banned_player_uid: arrayUnion(banned_player_uid),
    players_list: players_list,
  });

export const deleteGameRoom = (id) =>
  deleteDoc(doc(db, "game_rooms_five_in_a_row", id));

export const startGame = (id, newCurrentPlayerUid) => {
  const points = {};
  const gameBoard = {};

  for (let i = 0, pointIdx = 0; i < 9; i++) {
    const matrix = [];

    for (let y = 0; y < 9; y++) {
      matrix.push(`point-${pointIdx}`);

      points[`point-${pointIdx}`] = 0;
      pointIdx++;
    }

    gameBoard[i] = matrix;
  }

  return updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    ongoing_game: true,
    current_player_uid: newCurrentPlayerUid,
    game_stage: "click",
    game_board: gameBoard,
    points,
  });
};

export const reset = (id, currentPlayerUid) => {
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    current_player_uid: currentPlayerUid,
    ongoing_game: false,
    game_board: {},
    points: {},
    game_stage: "click",
  });
};

export const setPoint = (id, pointId, color, points) => {
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    points: { ...points, [pointId]: color },
    game_stage: "rotate",
  });
};

export const rotateBlock = (id, newCurrentPlayerUid, gameBoard) => {
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    current_player_uid: newCurrentPlayerUid,
    game_stage: "click",
    game_board: gameBoard,
  });
};

export const playerWin = (id, gameBoard) => {
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    game_stage: "",
    game_board: gameBoard,
  });
};
