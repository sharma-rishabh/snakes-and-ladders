export class CoreSAL {
  constructor() {
    this.currentPlayerIndex = 0;
    this.players = [
      { name: "Player 1", position: 0, color: "red" },
      { name: "Player 2", position: 0, color: "blue" },
    ];
    this.porters = [
      // { start: 1, end: 3 },
      // { start: 4, end: 2 },
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
