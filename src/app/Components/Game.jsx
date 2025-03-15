import { useState } from "react";
import styles from "../styles.module.css";
import { Board } from "./Board";
import { Dice } from "./Dice";
import { PlayersHeader } from "./PlayersHeader";


export const Game = ({ coreSAL, boardGenerator }) => {
  const [gameState, setGameState] = useState(coreSAL.getState());
  const [isDiceDisabled, setIsDiceDisabled] = useState(false);
  const [diceValues, setDiceValues] = useState([]);
  const [players, setPlayers] = useState(gameState.prevPlayers);

  const onBoardTransitionComplete = () => {
    setIsDiceDisabled(false);
    setDiceValues([]);
    setPlayers(gameState.players);
  };

  const updateStates = (newState) => {
    setGameState(newState);
    setPlayers(newState.prevPlayers);
  };

  const onRoll = (diceValue) => {
    const newDiceValues = [...diceValues, diceValue];
    setDiceValues(newDiceValues);
    if (!coreSAL.canRollMore(newDiceValues)) {
      setIsDiceDisabled(true);
      updateStates(coreSAL.playMove(newDiceValues));
    }
  };

  return (
    <div className={styles.game}>
      {gameState.winner && <WinnerBanner winner={gameState.winner} />}
      <Board
        moves={gameState.moves}
        boardGenerator={boardGenerator}
        onBoardTransitionComplete={onBoardTransitionComplete}
      />
      <div className={styles.playerInformation}>
        <PlayersHeader players={players} />
        <Dice
          onRoll={onRoll}
          randomGenerator={Math.random}
          isDisabled={isDiceDisabled}
        />
        <h2
          className={`text-2xl font-bold mt-4 bg-gray-200 px-4 py-2 rounded-lg shadow-md ${styles.totalScore}`}
        >
          Dice Roll Sum :{" "}
          <span className="text-blue-600">
            {diceValues.reduce((acc, curr) => acc + curr, 0)}
          </span>
        </h2>
      </div>
    </div>
  );
};
