import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getGameCodes = () =>
  getDoc(doc(db, "game_room_codes_five_in_a_row", "code_array"));

export const updateGameCodes = (values) =>
  updateDoc(doc(db, "game_room_codes_five_in_a_row/code_array"), values);

export const setGameCodes = (values) =>
  setDoc(doc(db, "game_room_codes_five_in_a_row/code_array"), values);
