import { Piece, PieceType, Position, Team } from "../Constants";
import {pwnMove, rukMove, nitMove, bspMove, qenMove, kngMove} from './rules'


export default class Referee {
  enPassant(
    initPos: Position,
    newPos: Position,
    type: PieceType,
    team: Team,
    boardState: Piece[]
  ) {
    const pwnDirection = team === Team.wht ? 1 : -1;
    if (type === PieceType.pwn) {
      if (
        (newPos.x - initPos.x === -1 || newPos.x - initPos.x === 1) &&
        newPos.y - initPos.y === pwnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === newPos.x &&
            p.position.y === newPos.y - pwnDirection &&
            p.enPassant
        );
        if (piece) {
          return true;
        }
      }
    }
    return false;
  }

  //TODO
  //PWN PROMOTION
  //PROHIBIT KNG MOVE TO CHECK
  //CHECK
  //CASTLING
  //STALEMATE
  //CHECKMATE
  isValidMove(
    initPos: Position,
    newPos: Position,
    type: PieceType,
    team: Team,
    boardState: Piece[]
  ) {
    let validMove = false;
    switch (type) {
      case PieceType.pwn:
        console.log("pwn");
        validMove = pwnMove(initPos, newPos, team, boardState);
        break;
      case PieceType.nit:
        console.log("nit");
        validMove = nitMove(initPos, newPos, team, boardState);
        break;
      case PieceType.bsp:
        console.log("bsp");
        validMove = bspMove(initPos, newPos, team, boardState);
        break;
      case PieceType.ruk:
        console.log("ruk");
        validMove = rukMove(initPos, newPos, team, boardState);
        break;
      case PieceType.qen:
        console.log("qen");
        validMove = qenMove(initPos, newPos, team, boardState);
        break;
      case PieceType.kng:
        console.log("kng");
        validMove = kngMove(initPos, newPos, team, boardState);
        break;

      default:
        alert("Invalid move!")
        break;
    }
    return validMove;
  }
}