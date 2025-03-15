import { useState } from "react";
import { PlayerToken } from "./PlayerToken";

export function PlayerFormModal({ handleSubmit }) {
  const [players, setPlayers] = useState([
    { name: "Player 1", color: "red", active: true },
    { name: "Player 2", color: "blue", active: true },
  ]);

  const colors = ["red", "blue", "green", "purple"];

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
