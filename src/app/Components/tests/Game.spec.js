import "@testing-library/jest-dom";
import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Game } from "../Game";



describe("Game Component", () => {
  const mockCoreSAL = {
    getState: jest.fn(),
    canRollMore: jest.fn(),
    playMove: jest.fn(),
  };
  const mockBoardGenerator = {
    generateBoards: jest.fn(),
    getBoard: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCoreSAL.getState.mockReturnValue({
      prevPlayers: [{ name: "Player 1" }, { name: "Player 2" }],
      players: [{ name: "Player 1" }, { name: "Player 2" }],
      moves: [],
      winner: null,
    });
    mockBoardGenerator.generateBoards.mockReturnValue([
      {
        board: [{ players: ["player1"], cellPosition: 1 }],
        transitioning: true,
      },
      {
        board: [
          { players: ["player2"], cellPosition: 2 },
          { players: ["player2"], cellPosition: 3 },
        ],
        transitioning: false,
      },
    ]);
    mockBoardGenerator.getBoard.mockReturnValue([
      {
        board: [{ players: ["player1"], cellPosition: 1 }],
        transitioning: true,
      },
      {
        board: [
          { players: ["player2"], cellPosition: 2 },
          { players: ["player2"], cellPosition: 3 },
        ],
        transitioning: false,
      },
    ]);
  });

  test("renders correctly", () => {
    render(<Game coreSAL={mockCoreSAL} boardGenerator={mockBoardGenerator} />);
    expect(screen).toMatchSnapshot();
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
    expect(screen.getByText("Click to Roll Dice")).toBeInTheDocument();
  });

  test("updates state and rolls the dice", () => {
    mockCoreSAL.canRollMore.mockReturnValue(false);
    mockCoreSAL.playMove.mockReturnValue({
      prevPlayers: [{ name: "Player 1" }, { name: "Player 2" }],
      players: [{ name: "Player 1" }, { name: "Player 2" }],
      moves: [],
      winner: null,
    });

    render(<Game coreSAL={mockCoreSAL} boardGenerator={mockBoardGenerator} />);

    act(() => {
      fireEvent.click(screen.getByText("Click to Roll Dice"));
    });

    expect(mockCoreSAL.canRollMore).toHaveBeenCalled();
    expect(mockCoreSAL.playMove).toHaveBeenCalled();
    expect(screen.getByText("Dice Roll Sum : 4")).toBeInTheDocument();
  });

  test("disables dice when rolling is not allowed", () => {
    mockCoreSAL.canRollMore.mockReturnValue(false);

    render(<Game coreSAL={mockCoreSAL} boardGenerator={mockBoardGenerator} />);

    act(() => {
      fireEvent.click(screen.getByText("Click to Roll Dice"));
    });

    expect(screen.getByText("Click to Roll Dice")).toBeDisabled();
  });

  test("enables dice after board transition", () => {
    render(<Game coreSAL={mockCoreSAL} boardGenerator={mockBoardGenerator} />);

    act(() => {
      fireEvent.click(screen.getByText("Click to Roll Dice"));
    });

    act(() => {
      fireEvent.transitionEnd(screen.getByText("Click to Roll Dice"));
    });

    expect(screen.getByText("Click to Roll Dice")).not.toBeDisabled();
  });

  test("displays winner banner when there is a winner", () => {
    mockCoreSAL.getState.mockReturnValue({
      prevPlayers: [{ name: "Player 1" }, { name: "Player 2" }],
      players: [{ name: "Player 1" }, { name: "Player 2" }],
      moves: [],
      winner: "Player 1",
    });

    render(<Game coreSAL={mockCoreSAL} boardGenerator={mockBoardGenerator} />);

    expect(screen.getByText("Player 1 wins!")).toBeInTheDocument();
  });
});
