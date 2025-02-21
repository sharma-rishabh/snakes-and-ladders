export class CoreSAL {
  constructor() {
    this.currentPlayerIndex = 0;
    this.players = [
      { name: "Player 1", position: 0, color: "red" },
      { name: "Player 2", position: 0, color: "blue" },
    ];
    this.porters = [
      { start: 3, end: 55 },
      { start: 11, end: 49 },
      { start: 13, end: 54 },
      { start: 21, end: 57 },
      { start: 27, end: 9 },
      { start: 36, end: 2 },
      { start: 40, end: 78 },
      { start: 46, end: 15 },
      { start: 53, end: 87 },
      { start: 74, end: 31 },
      { start: 93, end: 70 },
      { start: 95, end: 41 },
    ];
  }

  getNewPosition(newPosition) {
    for (const porter of this.porters) {
      if (porter.start === newPosition) {
        return porter.end;
      }
    }
    return newPosition;
  }

  getNextPlayerIndex() {
    return this.currentPlayerIndex === 0 ? 1 : 0;
  }

  updateCurrentPlayerIndex() {
    this.currentPlayerIndex = this.getNextPlayerIndex();
    return this.currentPlayerIndex;
  }

  movePlayer(diceValue) {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const newPosition = currentPlayer.position + diceValue;
    currentPlayer.position = this.getNewPosition(newPosition);
    return this.players;
  }

  getBoard() {
    const rows = 10;
    const columns = 10;
    const isEven = (num) => num % 2 === 0;
    const getRow = (rowNumber) => {
      return new Array(columns).fill(0).map((_, i) => {
        const cellPosition = columns * rowNumber + i;
        return {
          cellPosition,
          players: this.players.filter(
            (player) => player.position === cellPosition
          ),
        };
      });
    };

    return new Array(rows)
      .fill(0)
      .map((_, index) => {
        return index;
      })
      .map((row) => {
        return isEven(row) ? getRow(row) : getRow(row).reverse();
      })
      .reverse()
      .flat();
  }

  playMove(diceValue) {
    this.movePlayer(diceValue);
    this.updateCurrentPlayerIndex();
    return this.getBoard();
  }
}
