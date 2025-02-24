export class CoreSAL {
  constructor() {
    this.players = [
      { name: "Player 1", position: -1, color: "red", isPlaying: true },
      { name: "Player 2", position: -1, color: "blue", isPlaying: false },
    ];
    this.gameOver = false;
    this.lastMoves = [];
    this.lastPlayer = this.players[this.players.length - 1];
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

  getPositions(currentPosition, diceValue) {
    const newPosition = currentPosition + diceValue;
    const positions = new Array(diceValue).fill(0).map((_, i) => {
      return currentPosition + i + 1;
    });
    for (const porter of this.porters) {
      if (porter.start === newPosition) {
        positions.push(porter.end);
        return positions;
      }
    }
    return positions;
  }

  getNextPlayerIndex(currentPlayerIndex) {
    return currentPlayerIndex === 0 ? 1 : 0;
  }

  getCurrentPlayer() {
    return this.players.find((player) => player.isPlaying);
  }

  getOtherPlayers(player) {
    return this.players
      .filter((currPlayer) => currPlayer.color !== player.color)
      .map((player) => ({ ...player }));
  }

  updateCurrentPlayer() {
    const currentPlayer = this.getCurrentPlayer();
    const currentPlayerIndex = this.players.findIndex(
      (player) => player.isPlaying
    );
    const nextPlayerIndex = this.getNextPlayerIndex(currentPlayerIndex);
    currentPlayer.isPlaying = false;
    this.players[nextPlayerIndex].isPlaying = true;
    this.lastPlayer = currentPlayer;
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
      this.lastMoves = [0];
    }
    return currentPlayer;
  }

  isOutOfBoard(positions) {
    return positions[positions.length - 1] > 99;
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
    const positions = this.getPositions(currentPlayer.position, diceValue);

    if (!this.isOutOfBoard(positions)) {
      currentPlayer.position = positions[positions.length - 1];
      this.lastMoves = positions;
      this.gameOver = this.isGameOver(currentPlayer);
      return this.players;
    }
    return this.players;
  }

  createMoves() {
    return this.lastMoves.map((position) => {
      return [
        { ...this.lastPlayer, position },
        ...this.getOtherPlayers(this.lastPlayer),
      ];
    });
  }

  getState() {
    const winner = this.gameOver ? this.getCurrentPlayer() : null;
    return {
      moves: this.createMoves(),
      players: this.players,
      winner,
    };
  }

  playMove(diceValue) {
    this.lastMoves = [];
    this.movePlayer(diceValue);
    if (this.gameOver) {
      return this.getState();
    }
    this.updateCurrentPlayer();
    return this.getState();
  }
}
