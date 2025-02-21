export class CoreSAL {
  constructor() {
    this.players = [
      { name: "Player 1", position: -1, color: "red", isPlaying: true },
      { name: "Player 2", position: -1, color: "blue", isPlaying: false },
    ];
    this.gameOver = false;
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

  getNextPlayerIndex(currentPlayerIndex) {
    return currentPlayerIndex === 0 ? 1 : 0;
  }

  getCurrentPlayer() {
    return this.players.find((player) => player.isPlaying);
  }

  updateCurrentPlayer() {
    const currentPlayer = this.getCurrentPlayer();
    const currentPlayerIndex = this.players.findIndex(
      (player) => player.isPlaying
    );
    const nextPlayerIndex = this.getNextPlayerIndex(currentPlayerIndex);
    currentPlayer.isPlaying = false;
    this.players[nextPlayerIndex].isPlaying = true;
    return this.players;
  }

  isFirstMove(currentPlayer) {
    return currentPlayer.position === -1;
  }

  canMakeFirstMove(diceValue) {
    return diceValue === 1 || diceValue === 6;
  }

  handleFirstMove(currentPlayer, diceValue) {
    if (this.canMakeFirstMove(diceValue)) {
      currentPlayer.position = 0;
    }
    return currentPlayer;
  }

  isOutOfBoard(position) {
    return position > 99;
  }

  isGameOver(currentPlayer) {
    return currentPlayer.position === 99;
  }

  movePlayer(diceValue) {
    const currentPlayer = this.getCurrentPlayer();
    if (this.isFirstMove(currentPlayer)) {
      this.handleFirstMove(currentPlayer, diceValue);
      return this.players;
    }
    const newPosition = this.getNewPosition(currentPlayer.position + diceValue);
    if (!this.isOutOfBoard(newPosition)) {
      currentPlayer.position = newPosition;
      this.gameOver = this.isGameOver(currentPlayer);
      return this.players;
    }
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

  getState() {
    const winner = this.gameOver ? this.getCurrentPlayer() : null;
    return { board: this.getBoard(), players: this.players, winner };
  }

  playMove(diceValue) {
    this.movePlayer(diceValue);
    if (this.gameOver) {
      return this.getState();
    }
    this.updateCurrentPlayer();
    return this.getState();
  }
}
