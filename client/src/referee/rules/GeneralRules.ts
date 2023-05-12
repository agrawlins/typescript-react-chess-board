import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";

export const tileOccupied = (
  position: Position,
  boardState: Piece[]
): boolean => {
  const piece = boardState.find((p) => p.samePosition(position));
  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = boardState.find(
    (p) => p.samePosition(position) && p.team !== team
  );
  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileEmptyOrOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
) => {
  return (
    !tileOccupied(position, boardState) ||
    tileOccupiedByOpponent(position, boardState, team)
  );
};
