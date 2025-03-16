import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Board } from "../Board";
import { Cell } from "../Cell";
import boardImage from "../../../../public/board.jpg";
import { act } from "react";

jest.mock("../Cell", () => ({
  Cell: jest.fn(() => <div data-testid="cell" />),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img alt={props.alt} />,
}));

describe("Board Component", () => {
  const mockBoardGenerator = {
    getBoard: jest.fn(),
    generateBoards: jest.fn(),
  };
  const mockOnBoardTransitionComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the board with cells", () => {
    const mockBoard = [
      { players: ["player1"], cellPosition: 1 },
      { players: ["player2"], cellPosition: 2 },
    ];
    mockBoardGenerator.getBoard.mockReturnValue(mockBoard);
    mockBoardGenerator.generateBoards.mockReturnValue([]);
    act(() => {
      render(
        <Board
          moves={[]}
          boardGenerator={mockBoardGenerator}
          onBoardTransitionComplete={mockOnBoardTransitionComplete}
        />
      );
    });

    expect(mockBoardGenerator.getBoard).toHaveBeenCalled();
    expect(screen.getAllByTestId("cell")).toHaveLength(mockBoard.length);
    expect(screen.getByAltText("board")).toBeInTheDocument();
  });

  it("should call onBoardTransitionComplete if no boards are generated", () => {
    mockBoardGenerator.getBoard.mockReturnValue([]);
    mockBoardGenerator.generateBoards.mockReturnValue([]);

    act(() => {
      render(
        <Board
          moves={[]}
          boardGenerator={mockBoardGenerator}
          onBoardTransitionComplete={mockOnBoardTransitionComplete}
        />
      );
    });

    expect(mockOnBoardTransitionComplete).toHaveBeenCalled();
  });

  it("should transition through generated boards", () => {
    jest.useFakeTimers();
    const mockBoards = [
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
    ];
    mockBoardGenerator.getBoard.mockReturnValue([]);
    mockBoardGenerator.generateBoards.mockReturnValue(mockBoards);

      render(
        <Board
          moves={[]}
          boardGenerator={mockBoardGenerator}
          onBoardTransitionComplete={mockOnBoardTransitionComplete}
        />
      );

    act(() => {
      mockBoards.forEach((_, i) => {
        jest.advanceTimersByTime(500 * i);
      });
    });
    
    
    expect(screen.getAllByTestId("cell")).toHaveLength(2);
    expect(mockOnBoardTransitionComplete).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
