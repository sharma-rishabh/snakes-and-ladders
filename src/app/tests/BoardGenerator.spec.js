import { BoardGenerator } from "../BoardGenerator";

describe("BoardGenerator", () => {
  it("should initialize the board correctly", () => {
    const boardGenerator = new BoardGenerator();
    expect(boardGenerator.board).toEqual({ board: [], transitioning: false });
  });

  it("should generate a board with players in correct positions", () => {
    const boardGenerator = new BoardGenerator(2,2);
    const players = [{ position: 0 }, { position: 3 }];
    const result = boardGenerator.generateBoard(players, 1, 1);
    expect(result.board[2].players.length).toBe(1);
    expect(result.board[2].players[0].position).toBe(0);
    expect(result.board[0].players.length).toBe(1);
    expect(result.board[0].players[0].position).toBe(3);
    expect(result.transitioning).toBe(false);
  });

  it("should generate multiple boards correctly", () => {
    const boardGenerator = new BoardGenerator(2,2);
    const moves = [
      [{ position: 0 }, { position: 0 }],
      [{ position: 0 }, { position: 1 }],
    ];
    const result = boardGenerator.generateBoards(moves);
    expect(result.length).toBe(2);
    expect(result[0].board[2].players[0].position).toBe(0);
    expect(result[1].board[3].players[0].position).toBe(1);
    expect(result[0].transitioning).toBe(true);
    expect(result[1].transitioning).toBe(false);
  });

  it("should get the current board state", () => {
    const boardGenerator = new BoardGenerator(2,2);
    const players = [{ position: 0 }, { position: 1 }];
    boardGenerator.generateBoard(players, 1, 1);
    const board = boardGenerator.getBoard();
    expect(board[2].players[0].position).toBe(0);
    expect(board[3].players[0].position).toBe(1);
  });
});
