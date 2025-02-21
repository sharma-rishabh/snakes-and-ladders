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
const Game = ({ coreSAL }) => {
  const [board, setBoard] = useState(coreSAL.getBoard());
  const onRoll = (diceValue) => {
    setBoard(coreSAL.playMove(diceValue));
  };
  return (
    <div>
      <div
        className={`grid grid-cols-10 gap-x-0 gap-y-0] ${styles.board} -z-10`}
        style={{ "background-image": `url(${bg.src})` }}
      >
        {board.map((cell, index) => {
          return (
            <div key={index} id={index} className={styles.cell}>
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
      <Dice onRoll={onRoll} randomGenerator={Math.random} />
    </div>
  );
};

export default function Home() {
  const coreSAL = new CoreSAL();
  return <Game coreSAL={coreSAL} />;
}
