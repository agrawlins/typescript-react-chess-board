import { Piece, PieceType, Position, Team, samePosition } from "../Constants";

export default class Referee {
  tileEmptyOrOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: Team
  ) {
    return (
      !this.tileOccupied(position, boardState) ||
      this.tileOccupiedByOpponent(position, boardState, team)
    );
  }

  tileOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position));
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: Team
  ): boolean {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team
    );
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

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

  pwnMove(
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean {
    const specialRow = team === Team.wht ? 1 : 6;
    const pwnDirection = team === Team.wht ? 1 : -1;
    //Movement
    if (
      initPos.x === newPos.x &&
      initPos.y === specialRow &&
      newPos.y - initPos.y === 2 * pwnDirection
    ) {
      if (
        !this.tileOccupied(newPos, boardState) &&
        !this.tileOccupied(
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
      if (!this.tileOccupied(newPos, boardState)) {
        return true;
      }
    }

    //Attack
    else if (
      newPos.x - initPos.x === -1 &&
      newPos.y - initPos.y === pwnDirection
    ) {
      //Atk in upr/btm l crnr
      if (this.tileOccupiedByOpponent(newPos, boardState, team)) {
        return true;
      }
    } else if (
      newPos.x - initPos.x === 1 &&
      newPos.y - initPos.y === pwnDirection
    ) {
      //Atk in upr/btm r crnr
      if (this.tileOccupiedByOpponent(newPos, boardState, team)) {
        return true;
      }
    }
    return false;
  }

  nitMove(
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean {
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        // UP/DWN TWO MOVEMENT
        if (newPos.y - initPos.y === 2 * i) {
          if (newPos.x - initPos.x === j) {
            if (this.tileEmptyOrOccupiedByOpponent(newPos, boardState, team)) {
              return true;
            }
          }
        }
        // L/R TWO MOVEMENT
        if (newPos.x - initPos.x === 2 * i) {
          if (newPos.y - initPos.y === j) {
            if (this.tileEmptyOrOccupiedByOpponent(newPos, boardState, team)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  bspMove(
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ) {
    for (let i = 1; i < 8; i++) {
      //Northeast
      if (newPos.x > initPos.x && newPos.y > initPos.y) {
        let passedPos: Position = { x: initPos.x + i, y: initPos.y + i };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Southeast
      if (newPos.x > initPos.x && newPos.y < initPos.y) {
        let passedPos: Position = { x: initPos.x + i, y: initPos.y - i };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Southwest
      if (newPos.x < initPos.x && newPos.y < initPos.y) {
        let passedPos: Position = { x: initPos.x - i, y: initPos.y - i };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Northwest
      if (newPos.x < initPos.x && newPos.y > initPos.y) {
        let passedPos: Position = { x: initPos.x - i, y: initPos.y + i };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
    }
    return false;
  }

  rukMove(
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean {
    if (initPos.x === newPos.x) {
      for (let i = 1; i < 8; i++) {
        let verticalDirection = newPos.y < initPos.y ? -1 : 1;
        let passedPos: Position = {
          x: initPos.x,
          y: initPos.y + i * verticalDirection,
        };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
    }
    if (initPos.y === newPos.y) {
      for (let i = 1; i < 8; i++) {
        let horizontalDirection = newPos.x < initPos.x ? -1 : 1;
        let passedPos: Position = {
          x: initPos.x + i * horizontalDirection,
          y: initPos.y,
        };
        if (passedPos.x === newPos.x && passedPos.y === newPos.y) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      
    }
    return false;
  }

  qenMove(
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean {
    for (let i = 1; i < 8; i++) {
      //Vertical
    if (initPos.x === newPos.x) {
        let verticalDirection = newPos.y < initPos.y ? -1 : 1;
        let passedPos: Position = {
          x: initPos.x,
          y: initPos.y + i * verticalDirection,
        };
        if (samePosition(passedPos, newPos)) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Horizontal
    if (initPos.y === newPos.y) {
        let horizontalDirection = newPos.x < initPos.x ? -1 : 1;
        let passedPos: Position = {
          x: initPos.x + i * horizontalDirection,
          y: initPos.y,
        };
        if (samePosition(passedPos, newPos)) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
    }
      //Northeast
      if (newPos.x > initPos.x && newPos.y > initPos.y) {
        let passedPos: Position = { x: initPos.x + i, y: initPos.y + i };
        if (samePosition(passedPos, newPos)) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Southeast
      if (newPos.x > initPos.x && newPos.y < initPos.y) {
        let passedPos: Position = { x: initPos.x + i, y: initPos.y - i };
        if (samePosition(passedPos, newPos)) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Southwest
      if (newPos.x < initPos.x && newPos.y < initPos.y) {
        let passedPos: Position = { x: initPos.x - i, y: initPos.y - i };
        if (samePosition(passedPos, newPos)) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
      //Northwest
      if (newPos.x < initPos.x && newPos.y > initPos.y) {
        let passedPos: Position = { x: initPos.x - i, y: initPos.y + i };
        if (samePosition(passedPos, newPos)) {
          if (this.tileEmptyOrOccupiedByOpponent(passedPos, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileOccupied(passedPos, boardState)) {
            break;
          }
        }
      }
    }
    return false;
  }

  kngMove(
    initPos: Position,
    newPos: Position,
    team: Team,
    boardState: Piece[]
  ): boolean {
    return false;
  }

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
        validMove = this.pwnMove(initPos, newPos, team, boardState);
        break;
      case PieceType.nit:
        console.log("nit");
        validMove = this.nitMove(initPos, newPos, team, boardState);
        break;
      case PieceType.bsp:
        console.log("bsp");
        validMove = this.bspMove(initPos, newPos, team, boardState);
        break;
      case PieceType.ruk:
        console.log("ruk");
        validMove = this.rukMove(initPos, newPos, team, boardState);
        break;
      case PieceType.qen:
        console.log("qen");
        validMove = this.qenMove(initPos, newPos, team, boardState);
        break;
      case PieceType.kng:
        console.log("kng");
        validMove = this.kngMove(initPos, newPos, team, boardState);
        break;

      default:
        break;
    }
    return validMove;
  }
}