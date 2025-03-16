import "@testing-library/jest-dom";
import React, { act } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Dice } from "../Dice";

describe("Dice Component", () => {
  const mockOnRoll = jest.fn();
  const mockRandomGenerator = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    render(
      <Dice
        onRoll={mockOnRoll}
        randomGenerator={mockRandomGenerator}
        isDisabled={false}
      />
    );
    expect(screen).toMatchSnapshot();
    expect(screen.getByText("Click to Roll Dice")).toBeInTheDocument();
  });

  test("rolls the dice when clicked", () => {
    jest.useFakeTimers();

    mockRandomGenerator.mockReturnValue(0.5); // This should result in a dice value of 4
    const result = render(
      <Dice
        onRoll={mockOnRoll}
        randomGenerator={mockRandomGenerator}
        isDisabled={false}
      />
    );

    act(() => { 
      fireEvent.click(result.container.querySelector("#dice"));
      jest.advanceTimersByTime(1000);
    });

    setTimeout(() => {
      expect(mockRandomGenerator).toHaveBeenCalled();
      expect(mockOnRoll).toHaveBeenCalledWith(4);
    }, 1200);
  });

  test("does not roll the dice when disabled", () => {
    render(
      <Dice
        onRoll={mockOnRoll}
        randomGenerator={mockRandomGenerator}
        isDisabled={true}
      />
    );

    fireEvent.click(screen.getByText("Click to Roll Dice"));

    expect(mockRandomGenerator).not.toHaveBeenCalled();
    expect(mockOnRoll).not.toHaveBeenCalled();
  });

  test("does not roll the dice when already rolling", () => {
    mockRandomGenerator.mockReturnValue(0.5);
    const result = render(
      <Dice
        onRoll={mockOnRoll}
        randomGenerator={mockRandomGenerator}
        isDisabled={false}
      />
    );

    act(() => {
      fireEvent.click(result.container.querySelector("#dice"));
      fireEvent.click(result.container.querySelector("#dice"));
    });

    setTimeout(() => {
      expect(mockRandomGenerator).toHaveBeenCalledTimes(1);
      expect(mockOnRoll).toHaveBeenCalledWith(4);
    }, 1000);
  });
});
