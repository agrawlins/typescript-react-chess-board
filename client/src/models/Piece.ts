import { TeamType, PieceType } from "../Types";
import { Position } from "./Position";

export class Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  possibleMoves?: Position[];
  moved: boolean;
  constructor(
    position: Position,
    type: PieceType,
    team: TeamType,
    moved: boolean,
    possibleMoves: Position[] = []
  ) {
    this.image = `images/${team}${type}.png`;
    this.position = position;
    this.type = type;
    this.team = team;
    this.possibleMoves = possibleMoves;
    this.moved = moved;
  }

  get isPwn(): boolean {
    return this.type === PieceType.pwn;
  }

  get isRuk(): boolean {
    return this.type === PieceType.ruk;
  }

  get isNit(): boolean {
    return this.type === PieceType.nit;
  }

  get isBsp(): boolean {
    return this.type === PieceType.bsp;
  }

  get isKng(): boolean {
    return this.type === PieceType.kng;
  }

  get isQen(): boolean {
    return this.type === PieceType.qen;
  }

  samePiecePosition(otherPiece: Piece): boolean {
    return this.position.samePosition(otherPiece.position);
  }

  samePosition(otherPosition: Position): boolean {
    return this.position.samePosition(otherPosition);
  }

  clone(): Piece {
    return new Piece(
      this.position.clone(),
      this.type,
      this.team,
      this.moved,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}
