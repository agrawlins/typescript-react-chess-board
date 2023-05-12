import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import {
  tileEmptyOrOccupiedByOpponent,
  tileOccupied,
  tileOccupiedByOpponent,
} from "./GeneralRules";

export const rukMove = (
  initPos: Position,
  newPos: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const horizontal = initPos.y === newPos.y;
  const vertical = initPos.x === newPos.x;

  if (horizontal || vertical) {
    const startPos = vertical ? initPos.y : initPos.x;
    const endPos = vertical ? newPos.y : newPos.x;

    const direction = endPos < startPos ? -1 : 1;

    for (let i = startPos + direction; direction > 0 ? i <= endPos : i >= endPos; i += direction) {
      const passPos = vertical
        ? new Position(initPos.x, i)
        : new Position(i, initPos.y);

      if (passPos.samePosition(newPos)) {
        if (tileEmptyOrOccupiedByOpponent(passPos, boardState, team)) {
          return true;
        }
      } else {
        if (tileOccupied(passPos, boardState)) {
          break;
        }
      }
    }
  }

  return false;
};

export const getRukMoves = (
  rook: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [
    { dx: 0, dy: 1 }, // Top
    { dx: 0, dy: -1 }, // Bottom
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }, // Right
  ];
  for (const direction of directions) {
    let x = rook.position.x + direction.dx;
    let y = rook.position.y + direction.dy;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const position = new Position(x, y);
      if (!tileOccupied(position, boardstate)) {
        possibleMoves.push(position);
      } else if (tileOccupiedByOpponent(position, boardstate, rook.team)) {
        possibleMoves.push(position);
        break;
      } else {
        break;
      }
      x += direction.dx;
      y += direction.dy;
    }
  }
  return possibleMoves;
};
