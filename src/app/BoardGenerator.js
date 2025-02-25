export class BoardGenerator {
  constructor() {
    this.board = [];
  }

  generateBoard(players) {
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
    return this.board;
  }

  getBoard() {
    return this.board;
  }
}
