"use client";
import { useEffect, useState } from "react";
import { CoreSAL } from "./CoreSAL";
import { BoardGenerator } from "./BoardGenerator";
import styles from "./styles.module.css";
import Confetti from "react-confetti-boom";
import Image from "next/image";
import boardImage from "../../public/board.jpg";

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
        src={boardImage}
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
      <div className="flex justify-around">
        {players.map((player, playerIndex) => {
          return (
            <div
              key={playerIndex}
              className="flex flex-col items-center justify-around h-24 w-24"
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
      <h1 className="text-4xl text-white mb-4">{winner.name} Won!!</h1>
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

function PlayerFormModal({ handleSubmit }) {
  const [players, setPlayers] = useState([
    { name: "Player 1", color: "red", active: true },
    { name: "Player 2", color: "blue", active: true },
  ]);

  const colors = ["red", "blue", "green", "yellow"];

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([
        ...players,
        {
          name: `Player ${players.length + 1}`,
          color: colors[players.length],
          active: true,
        },
      ]);
    }
  };

  const updatePlayer = (index, key, value) => {
    const newPlayers = [...players];
    newPlayers[index][key] = value;
    setPlayers(newPlayers);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4 text-center">
            Enter Player Details
          </h2>

          {/* Player Inputs */}
          {players.map((player, index) => (
            <div key={index} className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayer(index, "name", e.target.value)}
                className="border p-2 rounded w-70"
              />
              <PlayerToken player={player} size={30} />
            </div>
          ))}

          {/* Add Player Button */}
          {players.length < 4 && (
            <button
              onClick={addPlayer}
              className="block w-full border p-2 rounded text-gray-700 text-center my-2"
            >
              +
            </button>
          )}

          <button
            onClick={() => handleSubmit(players)}
            className="w-full bg-gray-900 text-white py-2 rounded-lg mt-4"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

const StartGame = ({ players }) => {
  const coreSAL = new CoreSAL(players);
  const boardGenerator = new BoardGenerator();
  boardGenerator.generateBoard([], 1, 1);
  return <Game coreSAL={coreSAL} boardGenerator={boardGenerator} />;
};

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
