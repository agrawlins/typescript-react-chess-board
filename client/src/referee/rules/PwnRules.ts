import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileOccupied, tileOccupiedByOpponent } from "./GeneralRules";
import { Pawn } from "../../models/Pawn";

export const pwnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const specialRow = team === TeamType.wht ? 1 : 6;
  const pawnDirection = team === TeamType.wht ? 1 : -1;
  //MOVEMENT LOGIC
  if (
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === specialRow &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection
  ) {
    if (
      !tileOccupied(desiredPosition, boardState) &&
      !tileOccupied(
        new Position(desiredPosition.x, desiredPosition.y - pawnDirection),
        boardState
      )
    ) {
      return true;
    }
  } else if (initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
    if (!tileOccupied(desiredPosition, boardState)) {
      return true;
    }
  }
  //ATTACK LOGIC
  else if (desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
    //ATTACK IN UPPER OR BOTTOM LEFT CORNER
    if (tileOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true;
    }
  } else if (desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
    //ATTACK IN THE UPPER OR BOTTOM RIGHT CORNER
    if (tileOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true;
    }
  }
  return false;
};

export const getPwnMoves = (
  pawn: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const specialRow = pawn.team === TeamType.wht ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.wht ? 1 : -1;
  const normalMove = new Position(pawn.position.x,pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1,pawn.position.y + pawnDirection);
  const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);
  if (!tileOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);
    if (pawn.position.y === specialRow && !tileOccupied(specialMove, boardState)) {
      possibleMoves.push(specialMove);
    }
  }
  if (tileOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find((p) => p.samePosition(leftPosition));
    if (leftPiece != null && (leftPiece as Pawn).enPassant) {
      possibleMoves.push(upperLeftAttack);
    }
  }
  if (tileOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find((p) => p.samePosition(rightPosition));
    if (rightPiece != null && (rightPiece as Pawn).enPassant) {
      possibleMoves.push(upperRightAttack);
    }
  }
  return possibleMoves;
};