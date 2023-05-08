import { Piece, PieceType, Position, Team, samePosition } from "../../Constants";
import {tileOccupied, tileOccupiedByOpponent, tileEmptyOrOccupiedByOpponent} from './generalRules'

export const kngMove = (
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean => {
    for (let i = 1; i < 2; i++) {
      //Vertical
      let horizontalDirection = (newPos.x < initPos.x) ? -1 : (newPos.x > initPos.x) ? 1 : 0
      let verticalDirection = (newPos.y < initPos.y) ? -1 : (newPos.y > initPos.y) ? 1 : 0
      let passedPos: Position = {x: initPos.x + i * horizontalDirection, y: initPos.y + i * verticalDirection,};
      if (samePosition(passedPos, newPos)) {
        if (tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
          return true;
        }
      } else {
        if (tileOccupied(passedPos, boardState)) {
          break;
        }
      }
    }
    return false;
  }