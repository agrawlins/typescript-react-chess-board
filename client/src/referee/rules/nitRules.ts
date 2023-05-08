import { Piece, PieceType, Position, Team, samePosition } from "../../Constants";
import {tileOccupied, tileOccupiedByOpponent, tileEmptyOrOccupiedByOpponent} from './generalRules'

export const nitMove = (
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean => {
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        // UP/DWN TWO MOVEMENT
        if (newPos.y - initPos.y === 2 * i) {
          if (newPos.x - initPos.x === j) {
            if (tileEmptyOrOccupiedByOpponent(newPos, boardState, team)) {
              return true;
            }
          }
        }
        // L/R TWO MOVEMENT
        if (newPos.x - initPos.x === 2 * i) {
          if (newPos.y - initPos.y === j) {
            if (tileEmptyOrOccupiedByOpponent(newPos, boardState, team)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }