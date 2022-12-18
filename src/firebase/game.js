import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

export const setGameRoomData = ({ gameId, values }) =>
  setDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), values);

export const getGameRoomData = (id) =>
  getDoc(doc(db, "game_rooms_five_in_a_row", id));

export const onSnapshotGame = (id, func) =>
  onSnapshot(doc(db, "game_rooms_five_in_a_row", id), func);

// export const updateGameRoomData = (gameId, values) =>
//   updateDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), values);

export const addPlayer = (gameId, values) =>
  updateDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), {
    players_list: arrayUnion(values),
  });
