import { useEffect, useState } from "react";
import { Cell } from "./Cell";
import styles from "../styles.module.css";
import Image from "next/image";
import boardImage from "../../../public/board.jpg";

export const Board = ({ moves, boardGenerator, onBoardTransitionComplete }) => {
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
