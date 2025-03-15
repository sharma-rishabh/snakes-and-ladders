import { PlayerToken } from "./PlayerToken";
import styles from "../styles.module.css";

export const Cell = ({ players, cellPosition }) => {
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
