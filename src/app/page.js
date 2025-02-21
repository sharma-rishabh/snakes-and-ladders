"use client";
import { useState } from "react";
import { CoreSAL } from "./CoreSAL";
import styles from "./styles.module.css";
import bg from "./assets/board.jpg";

const Dice = ({ onRoll, randomGenerator }) => {
  const [diceValue, setDiceValue] = useState(1);
  const getDiceValue = () => {
    return Math.floor(randomGenerator() * 6) + 1;
  };
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
          backgroundColor: "antiquewhite",
          borderRadius: "15%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
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
        return <PlayerToken key={playerIndex} player={player} size={10} />;
      })}
    </div>
  );
};

const Board = ({ board }) => {
  return (
    <div
      className={`grid grid-cols-10 gap-x-0 gap-y-0] ${styles.board} -z-10`}
      style={{ "background-image": `url(${bg.src})` }}
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
  );
};

const PlayerToken = ({ player, size }) => {
  const ping = player.isPlaying ? "animate-ping" : "";
  return (
    <span className="relative flex">
      <span
        className={`absolute inline-flex ${ping} opacity-75`}
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
const Game = ({ coreSAL }) => {
  const [gameState, setGameState] = useState(coreSAL.getState());
  const onRoll = (diceValue) => {
    setGameState(coreSAL.playMove(diceValue));
  };
  return (
    <div className="flex justify-around" style={{ margin: "30px" }}>
      <Board board={gameState.board} />
      <div className="flex flex-col items-center justify-around size-1/3">
        <PlayersHeader players={gameState.players} />
        <Dice onRoll={onRoll} randomGenerator={Math.random} />
      </div>
    </div>
  );
};

export default function Home() {
  const coreSAL = new CoreSAL();
  return <Game coreSAL={coreSAL} />;
}
