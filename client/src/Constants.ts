import { Board } from "./models/Board";
import { Pawn } from "./models/Pawn";
import { Piece } from "./models/Piece";
import { Position } from "./models/Position";
import { PieceType, TeamType } from "./Types";

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

export let initBoard: Board;
let initboardArray = []

// Pawns Init State
for (let i = 0; i < 8; i++) {
  initboardArray.push(new Pawn(new Position(i, 6), TeamType.blk, false));
  initboardArray.push(new Pawn(new Position(i, 1), TeamType.wht, false));
}

// Backrow initboardArray Init State
for (let p = 0; p < 2; p++) {
  const team = p === 0 ? TeamType.blk : TeamType.wht;
  const y = p === 0 ? 7 : 0;
  initboardArray.push(new Piece(new Position(4, y), PieceType.kng, team, false));
  initboardArray.push(new Piece(new Position(3, y), PieceType.qen, team, false));
  initboardArray.push(new Piece(new Position(2, y), PieceType.bsp, team, false));
  initboardArray.push(new Piece(new Position(5, y), PieceType.bsp, team, false));
  initboardArray.push(new Piece(new Position(1, y), PieceType.nit, team, false));
  initboardArray.push(new Piece(new Position(6, y), PieceType.nit, team, false));
  initboardArray.push(new Piece(new Position(0, y), PieceType.ruk, team, false));
  initboardArray.push(new Piece(new Position(7, y), PieceType.ruk, team, false));
}

initBoard = new Board(initboardArray, 1);
initBoard.calculateMoves();