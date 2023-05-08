import { Piece, PieceType, Position, Team, samePosition } from "../../Constants";
import {tileOccupied, tileOccupiedByOpponent, tileEmptyOrOccupiedByOpponent} from './generalRules'

export const pwnMove = (
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean => {
    const specialRow = team === Team.wht ? 1 : 6;
    const pwnDirection = team === Team.wht ? 1 : -1;
    //Movement
    if (
      initPos.x === newPos.x &&
      initPos.y === specialRow &&
      newPos.y - initPos.y === 2 * pwnDirection
    ) {
      if (
        !tileOccupied(newPos, boardState) &&
        !tileOccupied(
          { x: newPos.x, y: newPos.y - pwnDirection },
          boardState
        )
      ) {
        return true;
      }
    } else if (
      initPos.x === newPos.x &&
      newPos.y - initPos.y === pwnDirection
    ) {
      if (!tileOccupied(newPos, boardState)) {
        return true;
      }
    }

    //Attack
    else if (
      newPos.x - initPos.x === -1 &&
      newPos.y - initPos.y === pwnDirection
    ) {
      //Atk in upr/btm l crnr
      if (tileOccupiedByOpponent(newPos, boardState, team)) {
        return true;
      }
    } else if (
      newPos.x - initPos.x === 1 &&
      newPos.y - initPos.y === pwnDirection
    ) {
      //Atk in upr/btm r crnr
      if (tileOccupiedByOpponent(newPos, boardState, team)) {
        return true;
      }
    }
    return false;
  }