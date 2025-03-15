"use client";
import { PlayerFormModal } from "./Components/PlayerFormModal";
import { useState } from "react";
import { StartGame } from "./Components/StartGame";

export default function Home() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  return (
    <div>
      {!isGameStarted && (
        <PlayerFormModal
          handleSubmit={(players) => {
            setIsGameStarted(true);
            setPlayers(players);
          }}
        />
      )}
      {isGameStarted && <StartGame players={players} />}
    </div>
  );
}
