import { CoreSAL } from "../CoreSAL";

describe("CoreSAL", () => {
  it("should initialize the players", () => {
    const players = [{ color: "red" }, { color: "blue" }];
    const coreSAL = new CoreSAL(players);
    expect(coreSAL.players.length).toBe(2);
    expect(coreSAL.players[0].position).toBe(-1);
    expect(coreSAL.players[0].isPlaying).toBe(true);
    expect(coreSAL.players[1].isPlaying).toBe(false);
  });

  it("should get positions correctly", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    const positions = coreSAL.getPositions(0, 3);
    expect(positions).toEqual([1, 2, 3, 55]);
  });

  it("should update current player", () => {
    const players = [{ color: "red" }, { color: "blue" }];
    const coreSAL = new CoreSAL(players);
    coreSAL.updateCurrentPlayer();
    expect(coreSAL.players[0].isPlaying).toBe(false);
    expect(coreSAL.players[1].isPlaying).toBe(true);
  });

  it("should handle first move correctly", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    const moves = coreSAL.handleFirstMove(coreSAL.players[0], 6);
    expect(moves).toEqual([0]);
    expect(coreSAL.players[0].position).toBe(0);
  });

  it("should detect game over", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    coreSAL.players[0].position = 99;
    expect(coreSAL.isGameOver(coreSAL.players[0])).toBe(true);
  });

  it("should detect out of board moves", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    coreSAL.players[0].position = 98;
    const playerAfterMove = coreSAL.movePlayer([6]);
    expect(playerAfterMove[0].position).toBe(98);
  });

  it("should send state with updated winner", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    coreSAL.players[0].position = 98;
    coreSAL.playMove([1]);
    const state = coreSAL.getState();
    expect(state.winner.color).toBe("red");
  });

  it("should play one move correctly", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    coreSAL.playOneMove(1, coreSAL.players[0]);
    const moves = coreSAL.playOneMove(3, coreSAL.players[0]);
    expect(moves).toEqual([1, 2, 3, 55]);
    expect(coreSAL.players[0].position).toBe(55);
  });

  it("should move player correctly", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    const positions = coreSAL.movePlayer([6, 4, 4]);
    expect(coreSAL.players[0].position).toBe(8);
  });

  it("should create moves correctly", () => {
    const players = [{ color: "red" }, { color: "blue" }];
    const coreSAL = new CoreSAL(players);
    coreSAL.movePlayer([3]);
    const moves = coreSAL.createMoves();
    expect(moves.length).toBe(2);
  });

  it("should get state correctly", () => {
    const players = [{ color: "red" }, { color: "blue" }];
    const coreSAL = new CoreSAL(players);
    const state = coreSAL.getState();
    expect(state.players.length).toBe(2);
    expect(state.moves.length).toBe(2);
  });

  it("should play move correctly", () => {
    const players = [{ color: "red" }, { color: "blue" }];
    const coreSAL = new CoreSAL(players);
    const state = coreSAL.playMove([1, 4, 3]);
    expect(state.players[0].position).toBe(7);
  });

  it("should detect if can roll more", () => {
    const players = [{ color: "red" }];
    const coreSAL = new CoreSAL(players);
    expect(coreSAL.canRollMore([1, 6])).toBe(true);
    expect(coreSAL.canRollMore([1, 5])).toBe(false);
  });
});
