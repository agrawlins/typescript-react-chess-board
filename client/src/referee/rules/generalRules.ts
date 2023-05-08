import { Piece, PieceType, Position, Team, samePosition } from "../../Constants";


export const tileEmptyOrOccupiedByOpponent = (
    position: Position,
    boardState: Piece[],
    team: Team
  ) => {
    return (
      !tileOccupied(position, boardState) ||
      tileOccupiedByOpponent(position, boardState, team)
    );
  }

  export const tileOccupied = (position: Position, boardState: Piece[]): boolean => {
    const piece = boardState.find((p) => samePosition(p.position, position));
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  export const tileOccupiedByOpponent = (
    position: Position,
    boardState: Piece[],
    team: Team
  ): boolean => {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team
    );
    if (piece) {
      return true;
    } else {
      return false;
    }
  }