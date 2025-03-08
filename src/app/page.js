"use client";
import { useEffect, useState } from "react";
import { CoreSAL } from "./CoreSAL";
import { BoardGenerator } from "./BoardGenerator";
import styles from "./styles.module.css";
import Confetti from "react-confetti-boom";
import Image from "next/image";

const Dice = ({ onRoll, randomGenerator, isDisabled }) => {
  const [diceValue, setDiceValue] = useState(1);
  const getDiceValue = () => {
    return Math.floor(randomGenerator() * 6) + 1;
  };
  const color = isDisabled ? "gray" : "antiquewhite";
  const cursor = isDisabled ? "not-allowed" : "pointer";
  return (
    <div
      className="flex flex-col items-center justify-around"
      style={{ width: "200px", height: "100px" }}
    >
      <h2>Click to Roll Dice</h2>
      <div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: color,
          borderRadius: "15%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: cursor,
        }}
        onClick={() => {
          if (isDisabled) {
            return;
          }
          const value = getDiceValue();
          setDiceValue(value);
          onRoll(value);
        }}
      >
        {diceValue}
      </div>
    </div>
  );
};

const Cell = ({ players, cellPosition }) => {
  return (
    <div
      key={cellPosition}
      id={cellPosition}
      className={`${styles.cell} flex justify-around items-center`}
    >
      {players.map((player, playerIndex) => {
        return <PlayerToken key={playerIndex} player={player} size={15} />;
      })}
    </div>
  );
};

const Board = ({ moves, boardGenerator, onBoardTransitionComplete }) => {
  const [board, setBoard] = useState(boardGenerator.getBoard());
  useEffect(() => {
    const boards = boardGenerator.generateBoards(moves);
    if (boards.length === 0) {
      onBoardTransitionComplete();
      return;
    }
    const timeoutIds = boards.map((newBoard, i) => {
      return setTimeout(() => {
        setBoard(newBoard.board);
        if (!newBoard.transitioning) {
          onBoardTransitionComplete();
        }
      }, 500 * i);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [moves]);

  return (
    <div className={styles.boardContainer}>
      <div
        className={`grid grid-cols-10 gap-x-0 gap-y-0] ${styles.board} -z-10`}
      >
        {board.map(({ players, cellPosition }) => {
          return (
            <Cell
              players={players}
              key={cellPosition}
              cellPosition={cellPosition}
            />
          );
        })}
      </div>
      <Image
        alt="board"
        src="/board.jpg"
        className={styles.boardImage}
        fill={true}
      />
    </div>
  );
};

const PlayerToken = ({ player, size }) => {
  const ping = player.isPlaying ? "animate-ping" : "";
  return (
    <span className="relative flex">
      <span
        className={`absolute inline-flex ${ping} opacity-85`}
        style={{
          backgroundColor: player.color,
          width: size,
          height: size,
          borderRadius: "50%",
        }}
      ></span>
      <span
        className="opacity-80"
        style={{
          backgroundColor: player.color,
          width: size,
          height: size,
          borderRadius: "50%",
        }}
      ></span>
    </span>
  );
};

const PlayersHeader = ({ players }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1>Players</h1>
      <div className="flex justify-around w-full">
        {players.map((player, playerIndex) => {
          return (
            <div
              key={playerIndex}
              className="flex flex-col items-center justify-around h-24"
            >
              <h4>{player.name}</h4>
              <PlayerToken player={player} size={30} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WinnerBanner = ({ winner }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-1/3 z-10 absolute"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <h1 className="text-4xl text-white mb-4">Winner: {winner.name}</h1>
      <PlayerToken player={winner} size={50} />
      <Confetti
        mode="fall"
        particleCount={500}
        colors={["#ff577f", "#ff884b", "#ffd384", "#fff9b0"]}
      />
    </div>
  );
};
const Game = ({ coreSAL, boardGenerator }) => {
  const [gameState, setGameState] = useState(coreSAL.getState());
  const [isDiceDisabled, setIsDiceDisabled] = useState(false);
  const [diceValues, setDiceValues] = useState([]);
  const onBoardTransitionComplete = () => {
    setIsDiceDisabled(false);
    setDiceValues([]);
  };

  const onRoll = (diceValue) => {
    const newDiceValues = [...diceValues, diceValue];
    setDiceValues(newDiceValues);
    if (!coreSAL.canRollMore(newDiceValues)) {
      setIsDiceDisabled(true);
      setGameState(coreSAL.playMove(newDiceValues));
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
        <PlayersHeader players={gameState.players} />
        <Dice
          onRoll={onRoll}
          randomGenerator={Math.random}
          isDisabled={isDiceDisabled}
        />
        <h2>
          Total dice value: {diceValues.reduce((curr, acc) => curr + acc, 0)}
        </h2>
      </div>
    </div>
  );
};

export default function Home() {
  const coreSAL = new CoreSAL();
  const boardGenerator = new BoardGenerator();
  boardGenerator.generateBoard([], 1, 1);
  return <Game coreSAL={coreSAL} boardGenerator={boardGenerator} />;
}
