"use client";
import { useEffect, useState } from "react";
import { CoreSAL } from "./CoreSAL";
import styles from "./styles.module.css";
import bg from "./assets/board.jpg";

const Dice = ({ onRoll, randomGenerator }) => {
  const getDiceValue = () => {
    return Math.floor(randomGenerator() * 6) + 1;
  };
  return <div onClick={() => onRoll(getDiceValue())}>CLICK DICE</div>;
};

const Cell = ({ players, cellPosition }) => {
  return (
    <div key={cellPosition} id={cellPosition} className={styles.cell}>
      {players.map((player, playerIndex) => {
        return (
          <div key={playerIndex} style={{ color: player.color }}>
            {"O"}
          </div>
        );
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
const Game = ({ coreSAL }) => {
  const [gameState, setGameState] = useState(coreSAL.getState());
  const onRoll = (diceValue) => {
    setGameState(coreSAL.playMove(diceValue));
  };
  return (
    <div>
      
      <Board board={gameState.board} />
      <Dice onRoll={onRoll} randomGenerator={Math.random} />
    </div>
  );
};

export default function Home() {
  const coreSAL = new CoreSAL();
  return <Game coreSAL={coreSAL} />;
}
