import React, { useCallback, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import "./style.scss";

import { getGameRoomData, onSnapshotGame } from "../../firebase/game";
import gameStore from "../../store/game";

const StartModal = lazy(() => import("../../modules/StartModal"));

const GamePage = observer(() => {
  let { id } = useParams();
  id = id.toUpperCase();

  const navigate = useNavigate();

  const checkIfGameExists = useCallback(async () => {
    const docSnap = await getGameRoomData(id);
    if (!docSnap.exists()) {
      navigate("/");
    }
  }, [navigate, id]);

  useEffect(() => {
    checkIfGameExists();
    const unsubscribe = onSnapshotGame(id, (doc) => {
      // setGameData(doc.data());
      // setDataLoaded(true);

      gameStore.setGameData(doc.data(), navigate);
    });
    return () => {
      unsubscribe();
    };
  }, [checkIfGameExists, id, navigate]);

  return (
    <div>
      <div>{gameStore.isStartModalOpen ? "true" : "false"}</div>
      {gameStore.isStartModalOpen && (
        <Suspense fallback="loading">
          <StartModal
            isOpen={gameStore.isStartModalOpen}
            handleClose={() => gameStore.setIsStartModalOpen(false)}
            id={id}
          />
        </Suspense>
      )}
    </div>
  );
});

export default GamePage;
