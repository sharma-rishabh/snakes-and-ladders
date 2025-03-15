import { CoreSAL } from "../CoreSAL";
import { BoardGenerator } from "../BoardGenerator";
import { Game } from "./Game";


export const StartGame = ({ players }) => {
  const coreSAL = new CoreSAL(players);
  const boardGenerator = new BoardGenerator();
  boardGenerator.generateBoard([], 1, 1);
  return <Game coreSAL={coreSAL} boardGenerator={boardGenerator} />;
};
