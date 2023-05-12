import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import {
  tileEmptyOrOccupiedByOpponent,
  tileOccupied,
  tileOccupiedByOpponent,
} from "./GeneralRules";

export const kngMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 2; i++) {
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

export const getKngMoves = (
  king: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions: [number, number][] = [
    [0, 1], // Top
    [0, -1], // Bottom
    [-1, 0], // Left
    [1, 0], // Right
    [1, 1], // Upper right
    [1, -1], // Bottom right
    [-1, -1], // Bottom left
    [-1, 1], // Top left
  ];

  for (const [dx, dy] of directions) {
    for (let i = 1; i < 2; i++) {
      const destination = new Position(
        king.position.x + i * dx,
        king.position.y + i * dy
      );
      if (
        destination.x < 0 ||
        destination.x > 7 ||
        destination.y < 0 ||
        destination.y > 7
      ) {
        break;
      }
      if (!tileOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if (tileOccupiedByOpponent(destination, boardstate, king.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  }
  return possibleMoves;
};

// In this method the enemy moves have already been calculated
export const getCastlingMoves = (
  king: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  if (king.moved) return possibleMoves;
  // We get the rooks from the king's team which haven't moved
  const rooks = boardstate.filter(
    (p) => p.isRuk && p.team === king.team && !p.moved
  );

  // Loop through the rooks
  for (const rook of rooks) {
    // Determine if we need to go to the right or the left side
    const direction = rook.position.x - king.position.x > 0 ? 1 : -1;
    const adjacentPosition = king.position.clone();
    adjacentPosition.x += direction;
    if (!rook.possibleMoves?.some((m) => m.samePosition(adjacentPosition)))
      continue;
    // We know that the rook can move to the adjacent side of the king
    const conceringTiles = rook.possibleMoves.filter((m) => m.y === king.position.y);
    // Checking if any of the enemy pieces can attack the spaces between
    // The rook and the king
    const enemyPieces = boardstate.filter((p) => p.team !== king.team);
    let valid = true;
    for (const enemy of enemyPieces) {
      if (enemy.possibleMoves === undefined) continue;
      for (const move of enemy.possibleMoves) {
        if (conceringTiles.some((t) => t.samePosition(move))) {
          valid = false;
        }
        if (!valid) break;
      }
      if (!valid) break;
    }
    if (!valid) continue;
    // We now want to add it as a possible move!
    possibleMoves.push(rook.position.clone());
  }
  return possibleMoves;
};