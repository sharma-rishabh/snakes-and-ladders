export class BoardGenerator {
  constructor(rows = 10, columns = 10) {
    this.board = { board: [], transitioning: false };
    this.rows = rows;
    this.columns = columns;
  }

  generateBoard(players, boardId, totalBoards) {
    const isEven = (num) => num % 2 === 0;
    const getRow = (rowNumber) => {
      return new Array(this.columns).fill(0).map((_, i) => {
        const cellPosition = this.columns * rowNumber + i;
        return {
          cellPosition,
          players: players.filter((player) => player.position === cellPosition),
        };
      });
    };

    this.board = new Array(this.rows)
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
