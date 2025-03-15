import Confetti from "react-confetti";
import { PlayerToken } from "./PlayerToken";

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
