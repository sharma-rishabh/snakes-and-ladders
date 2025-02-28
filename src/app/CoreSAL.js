export class CoreSAL {
  constructor() {
    this.players = [
      { name: "Player 1", position: -1, color: "red", isPlaying: true },
      { name: "Player 2", position: -1, color: "blue", isPlaying: false },
    ];
    this.gameOver = false;
    this.lastMoves = [-1];
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
    this.lastPlayer = { ...currentPlayer };
    currentPlayer.isPlaying = false;
    this.players[nextPlayerIndex].isPlaying = true;
    return this.players;
  }

  isFirstMove(currentPlayer) {
    return currentPlayer.position === -1;
  }

  canMakeFirstMove(diceValue) {
    return diceValue === 1 || diceValue >= 6;
  }

  handleFirstMove(currentPlayer, diceValue) {
    const moves = [-1];
    if (this.canMakeFirstMove(diceValue)) {
      currentPlayer.position = 0;
      moves[0] = 0;
    }
    return moves;
  }

  isOutOfBoard(position) {
    return position > 99;
  }

  isGameOver(currentPlayer) {
    return currentPlayer.position === 99;
  }

  playOneMove(diceValue, currentPlayer) {
    if (this.isFirstMove(currentPlayer)) {
      return this.handleFirstMove(currentPlayer, diceValue);
    }
    const positions = this.getPositions(currentPlayer.position, diceValue);
    currentPlayer.position = positions[positions.length - 1];
    this.gameOver = this.isGameOver(currentPlayer);
    return positions;
  }

  movePlayer(diceValues) {
    const totalDiceValue = diceValues.reduce((acc, curr) => acc + curr, 0);
    const currentPlayer = this.getCurrentPlayer();
    const finalPosition = currentPlayer.position + totalDiceValue;

    if (this.isOutOfBoard(finalPosition)) {
      this.lastMoves = [currentPlayer.position];
      return this.players;
    }

    const moves = diceValues.map((diceValue) => {
      return this.playOneMove(diceValue, currentPlayer);
    });
    this.lastMoves = moves.flat();
    return this.players;
  }

  createMoves() {
    const otherPlayers = this.getOtherPlayers(this.lastPlayer).map((player) => {
      return { ...player, isPlaying: false };
    });
    const moves = this.lastMoves.map((position) => {
      return [{ ...this.lastPlayer, position }, ...otherPlayers];
    });
    const turnOverMove = [
      { ...this.lastPlayer, isPlaying: false },
      ...this.getOtherPlayers(this.lastPlayer),
    ];
    moves.push(turnOverMove);
    return moves;
  }

  getState() {
    const winner = this.gameOver ? this.getCurrentPlayer() : null;
    const moves = this.createMoves();
    return {
      moves: moves,
      players: this.players,
      winner,
    };
  }

  playMove(diceValues) {
    this.lastMoves = [];
    this.movePlayer(diceValues);
    if (this.gameOver) {
      return this.getState();
    }
    this.updateCurrentPlayer();
    return this.getState();
  }

  canRollMore(diceValues) {
    const lastDiceValue = diceValues[diceValues.length - 1];
    return lastDiceValue === 6;
  }
}
