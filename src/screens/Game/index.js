import React, { useCallback, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import "./style.scss";

import { getGameRoomData, onSnapshotGame } from "../../firebase/game";
import gameStore from "../../store/game";
import GameBlock from "../../modules/GameBlock";
import StartBlock from "../../modules/StartBlock";
import Header from "../../modules/Header";

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
      gameStore.setGameData(doc.data(), navigate);
    });
    return () => {
      unsubscribe();
    };
  }, [checkIfGameExists, id, navigate]);

  return (
    <div className="game_page">
      {gameStore.isStartModalOpen && (
        <Suspense fallback="loading">
          <StartModal
            isOpen={gameStore.isStartModalOpen}
            handleClose={() => gameStore.setIsStartModalOpen(false)}
            id={id}
          />
        </Suspense>
      )}

      {gameStore.isWaitStart && <Header />}

      {gameStore.isWaitStart &&
        (gameStore.ongoingGame ? (
          <GameBlock id={id} />
        ) : (
          <StartBlock id={id} />
        ))}
    </div>
  );
});

export default GamePage;
