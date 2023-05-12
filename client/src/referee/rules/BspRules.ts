import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import {
  tileEmptyOrOccupiedByOpponent,
  tileOccupied,
  tileOccupiedByOpponent,
} from "./GeneralRules";

export const bspMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = 1; i < 8; i++) {
    //Up right movement
    if (
      desiredPosition.x > initialPosition.x &&
      desiredPosition.y > initialPosition.y
    ) {
      let passedPosition = new Position(
        initialPosition.x + i,
        initialPosition.y + i
      );
      //Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        //Dealing with destination tile
        if (tileEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        //Dealing with passing tile
        if (tileOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    //Bottom right movement
    if (
      desiredPosition.x > initialPosition.x &&
      desiredPosition.y < initialPosition.y
    ) {
      let passedPosition = new Position(
        initialPosition.x + i,
        initialPosition.y - i
      );
      //Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        //Dealing with destination tile
        if (tileEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    //Bottom left movement
    if (
      desiredPosition.x < initialPosition.x &&
      desiredPosition.y < initialPosition.y
    ) {
      let passedPosition = new Position(
        initialPosition.x - i,
        initialPosition.y - i
      );
      //Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        //Dealing with destination tile
        if (tileEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
    //Top left movement
    if (
      desiredPosition.x < initialPosition.x &&
      desiredPosition.y > initialPosition.y
    ) {
      let passedPosition = new Position(
        initialPosition.x - i,
        initialPosition.y + i
      );
      //Check if the tile is the destination tile
      if (passedPosition.samePosition(desiredPosition)) {
        //Dealing with destination tile
        if (tileEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if (tileOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
  }
  return false;
};

export const getBspMoves = (
  bishop: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [
    { dx: 1, dy: 1 },   // Upper right
    { dx: 1, dy: -1 },  // Bottom right
    { dx: -1, dy: -1 }, // Bottom left
    { dx: -1, dy: 1 },  // Top left
  ];
  for (const direction of directions) {
    let x = bishop.position.x + direction.dx;
    let y = bishop.position.y + direction.dy;
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      const position = new Position(x, y);
      if (!tileOccupied(position, boardstate)) {
        possibleMoves.push(position);
      } else if (tileOccupiedByOpponent(position, boardstate, bishop.team)) {
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
