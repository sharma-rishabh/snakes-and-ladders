export class BoardGenerator {
  constructor() {
    this.board = { board: [], transitioning: false };
  }

  generateBoard(players, boardId, totalBoards) {
    const rows = 10;
    const columns = 10;
    const isEven = (num) => num % 2 === 0;
    const getRow = (rowNumber) => {
      return new Array(columns).fill(0).map((_, i) => {
        const cellPosition = columns * rowNumber + i;
        return {
          cellPosition,
          players: players.filter((player) => player.position === cellPosition),
        };
      });
    };

    this.board = new Array(rows)
      .fill(0)
      .map((_, index) => {
        return index;
      })
      .map((row) => {
        return isEven(row) ? getRow(row) : getRow(row).reverse();
      })
      .reverse()
      .flat();
    return { board: this.board, transitioning: boardId !== totalBoards };
  }

  generateBoards(moves) {
    return moves.map((move, boardId) =>
      this.generateBoard(move, boardId + 1, moves.length)
    );
  }

  getBoard() {
    return this.board;
  }
}
