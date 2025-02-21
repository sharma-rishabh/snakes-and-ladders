"use client";
import { useState } from "react";
import { CoreSAL } from "./CoreSAL";

const Game = ({ coreSAL }) => {
  const [board, setBoard] = useState(coreSAL.getBoard());
  const [diceValue, setDiceValue] = useState(1);
  console.log(board);
  return (
    <div
      className="grid grid-cols-3 gap-x-2 gap-y-0"
      style={{ width: "150px" }}
    >
      {board.map((cell, index) => {
        return (
          <div
            key={index}
            style={{ border: "1px solid white", width: "50px", height: "50px" }}
            id={index}
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
