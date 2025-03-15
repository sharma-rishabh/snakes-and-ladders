import { PlayerToken } from "./PlayerToken";

export const PlayersHeader = ({ players }) => {
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
