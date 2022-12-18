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

export const startGame = (id, newCurrentPlayerUid) =>
  updateDoc(doc(db, "game_rooms_five_in_a_row", id), {
    ongoing_game: true,
    current_player_uid: newCurrentPlayerUid,
  });
