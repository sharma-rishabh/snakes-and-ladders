"use client";
import { useState } from "react";
import { CoreSAL } from "./CoreSAL";
import styles from "./styles.module.css";

const Game = ({ coreSAL }) => {
  const [board, setBoard] = useState(coreSAL.getBoard());
  const [diceValue, setDiceValue] = useState(1);
  console.log(board);
  return (
    <div>
      <div
        className={`grid grid-cols-10 gap-x-0 gap-y-0 bg-[url(/board.jpg)] ${styles.board}`}
      >
        {board.map((cell, index) => {
          return (
            <div
              key={index}
              id={index}
              className={styles.cell}
            >
              {cell.players.map((player, playerIndex) => {
                return (
                  <div key={playerIndex} style={{ color: player.color }}>
                    {"O"}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          setDiceValue(1);
          setBoard(coreSAL.playMove(diceValue));
        }}
      >
        play
      </button>
    </div>
  );
};

export default function Home() {
  const coreSAL = new CoreSAL();
  return <Game coreSAL={coreSAL} />;
}
