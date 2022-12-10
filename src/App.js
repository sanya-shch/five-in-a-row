import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../src/screens/Home";
import GamePage from "../src/screens/Game";

function App() {
  const [gameId, setGameId] = useState("");

  return (
    <Routes>
      <Route
        index
        element={<HomePage gameId={gameId} setGameId={setGameId} />}
      />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  );
}

export default App;
