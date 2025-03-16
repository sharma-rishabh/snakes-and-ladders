import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../page";
import { PlayerFormModal } from "../Components/PlayerFormModal";
import { StartGame } from "../Components/StartGame";

jest.mock("../Components/PlayerFormModal");
jest.mock("../Components/StartGame");

describe("Home", () => {
  beforeEach(() => {
    PlayerFormModal.mockImplementation(({ handleSubmit }) => (
      <button
        onClick={() =>
          handleSubmit([{ name: "Player 1" }, { name: "Player 2" }])
        }
      >
        Start Game
      </button>
    ));
    StartGame.mockImplementation(({ players }) => (
      <div>
        {players.map((player, index) => (
          <div key={index}>{player.name}</div>
        ))}
      </div>
    ));
  });

  it("should render PlayerFormModal initially", () => {
    render(<Home />);
    expect(screen.getByText("Start Game")).toBeInTheDocument();
  });

  it("should start the game and render StartGame component with players", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Start Game"));
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });
});
