import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { Cell } from "../Cell";
import { PlayerToken } from "../PlayerToken";

jest.mock("../PlayerToken", () => ({
  PlayerToken: ({ player, size }) => (
    <div data-testid="player-token">{player}</div>
  ),
}));

describe("Cell Component", () => {
  const players = ["Player1", "Player2"];
  const cellPosition = "cell-1";

  test("renders without crashing", () => {
    const { container } = render(
      <Cell players={players} cellPosition={cellPosition} />
    );
    expect(container).toBeInTheDocument();
  });

  test("renders the correct number of PlayerToken components", () => {
    const { getAllByTestId } = render(
      <Cell players={players} cellPosition={cellPosition} />
    );
    const playerTokens = getAllByTestId("player-token");
    expect(playerTokens).toHaveLength(players.length);
  });

  test("passes the correct props to PlayerToken components", () => {
    const { getAllByTestId } = render(
      <Cell players={players} cellPosition={cellPosition} />
    );
    const playerTokens = getAllByTestId("player-token");
    playerTokens.forEach((token, index) => {
      expect(token).toHaveTextContent(players[index]);
    });
  });

  test("has the correct cellPosition as id and key", () => {
    const { container } = render(
      <Cell players={players} cellPosition={cellPosition} />
    );
    const cellDiv = container.firstChild;
    expect(cellDiv).toHaveAttribute("id", cellPosition);
  });
});
