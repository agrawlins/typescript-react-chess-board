import { Piece, PieceType, Position, Team, samePosition } from "../../Constants";
import {tileOccupied, tileOccupiedByOpponent, tileEmptyOrOccupiedByOpponent} from './generalRules'

export const bspMove = (
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean => {
    for (let i = 1; i < 8; i++) {
      //Northeast
      let verticalDirection = newPos.y < initPos.y ? -1 : 1;
      let horizontalDirection = newPos.x < initPos.x ? -1 : 1;
        let passedPos: Position = { x: initPos.x + (i * horizontalDirection), y: initPos.y + (i * verticalDirection) };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
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