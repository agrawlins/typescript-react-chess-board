import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileEmptyOrOccupiedByOpponent, tileOccupied, tileOccupiedByOpponent} from "./GeneralRules";

export const qenMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    //Diagonal
    let multiplierX =
      desiredPosition.x < initialPosition.x
        ? -1
        : desiredPosition.x > initialPosition.x
        ? 1
        : 0;
    let multiplierY =
      desiredPosition.y < initialPosition.y
        ? -1
        : desiredPosition.y > initialPosition.y
        ? 1
        : 0;
    let passedPosition = new Position(
      initialPosition.x + i * multiplierX,
      initialPosition.y + i * multiplierY
    );
    if (passedPosition.samePosition(desiredPosition)) {
      if (tileEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
        return true;
      }
    } else {
      if (tileOccupied(passedPosition, boardState)) {
        break;
      }
    }
  }
  return false;
};

export const getQenMoves = (
  queen: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [
    { dx: 0, dy: 1 },   // Top
    { dx: 0, dy: -1 },  // Bottom
    { dx: -1, dy: 0 },  // Left
    { dx: 1, dy: 0 },   // Right
    { dx: 1, dy: 1 },   // Upper right
    { dx: 1, dy: -1 },  // Bottom right
    { dx: -1, dy: -1 }, // Bottom left
    { dx: -1, dy: 1 },  // Top left
  ];
  for (const direction of directions) {
    let x = queen.position.x + direction.dx;
    let y = queen.position.y + direction.dy;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const position = new Position(x, y);
      if (!tileOccupied(position, boardstate)) {
        possibleMoves.push(position);
      } else if (tileOccupiedByOpponent(position, boardstate, queen.team)) {
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
