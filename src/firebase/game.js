import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const setGameRoomData = ({ gameId, values }) =>
  setDoc(doc(db, `game_rooms_five_in_a_row/${gameId}`), values);
