import {
  getBspMoves,
  getKngMoves,
  getNitMoves,
  getPwnMoves,
  getQenMoves,
  getRukMoves,
  getCastlingMoves,
} from "../referee/rules";
import { PieceType, TeamType } from "../Types";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: TeamType;
  constructor(pieces: Piece[], totalTurns: number) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;
  }
  get currentTeam(): TeamType {
    return this.totalTurns % 2 === 0 ? TeamType.blk : TeamType.wht;
  }

  calculateMoves() {
    // Calculate the moves of all the pieces
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }
    // Calculate castling moves
    for (const king of this.pieces.filter((p) => p.isKng)) {
      if (king.possibleMoves === undefined) continue;
      king.possibleMoves = [
        ...king.possibleMoves,
        ...getCastlingMoves(king, this.pieces),
      ];
    }

    // Check if the current team moves are valid
    this.checkCurrentTeamMoves();

    // Remove the posibble moves for the team that is not playing
    for (const piece of this.pieces.filter((p) => p.team !== this.currentTeam)) {
      piece.possibleMoves = [];
    }

    // Check if the playing team still has moves left
    // Otherwise, checkmate!
    if (
      this.pieces
        .filter((p) => p.team === this.currentTeam)
        .some(
          (p) => p.possibleMoves !== undefined && p.possibleMoves.length > 0
        )
    )
      return;
    this.winningTeam =
      this.currentTeam === TeamType.wht ? TeamType.blk : TeamType.wht;
  }

  checkCurrentTeamMoves() {
    // Loop through all the current team's pieces
    for (const piece of this.pieces.filter(
      (p) => p.team === this.currentTeam
    )) {
      if (piece.possibleMoves === undefined) continue;
      // Simulate all the piece moves
      for (const move of piece.possibleMoves) {
        const simulatedBoard = this.clone();
        // Remove the piece at the destination position
        simulatedBoard.pieces = simulatedBoard.pieces.filter(
          (p) => !p.samePosition(move)
        );
        // Get the piece of the cloned board
        const clonedPiece = simulatedBoard.pieces.find((p) =>
          p.samePiecePosition(piece)
        )!;
        clonedPiece.position = move.clone();
        // Get the king of the cloned board
        const clonedKing = simulatedBoard.pieces.find(
          (p) => p.isKng && p.team === simulatedBoard.currentTeam
        )!;
        // Loop through all enemy pieces, update their possible moves
        // And check if the current team's king will be in danger
        for (const enemy of simulatedBoard.pieces.filter(
          (p) => p.team !== simulatedBoard.currentTeam
        )) {
          enemy.possibleMoves = simulatedBoard.getValidMoves(
            enemy,
            simulatedBoard.pieces
          );
          if (enemy.isPwn) {
            if (
              enemy.possibleMoves.some(
                (m) =>
                  m.x !== enemy.position.x &&
                  m.samePosition(clonedKing.position)
              )
            ) {
              piece.possibleMoves = piece.possibleMoves?.filter(
                (m) => !m.samePosition(move)
              );
            }
          } else {
            if (
              enemy.possibleMoves.some((m) =>
                m.samePosition(clonedKing.position)
              )
            ) {
              piece.possibleMoves = piece.possibleMoves?.filter(
                (m) => !m.samePosition(move)
              );
            }
          }
        }
      }
    }
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.pwn:
        return getPwnMoves(piece, boardState);
      case PieceType.nit:
        return getNitMoves(piece, boardState);
      case PieceType.bsp:
        return getBspMoves(piece, boardState);
      case PieceType.ruk:
        return getRukMoves(piece, boardState);
      case PieceType.qen:
        return getQenMoves(piece, boardState);
      case PieceType.kng:
        return getKngMoves(piece, boardState);
      default:
        return [];
    }
  }

  playMove(
    enPassantMove: boolean,
    validMove: boolean,
    playedPiece: Piece,
    destination: Position
  ): boolean {
    const pawnDirection = playedPiece.team === TeamType.wht ? 1 : -1;
    const destinationPiece = this.pieces.find((p) =>
      p.samePosition(destination)
    );

    // If the move is a castling move do this
    if (
      playedPiece.isKng &&
      destinationPiece?.isRuk &&
      destinationPiece.team === playedPiece.team
    ) {
      const direction =
        destinationPiece.position.x - playedPiece.position.x > 0 ? 1 : -1;
      const newKingXPosition = playedPiece.position.x + direction * 2;
      this.pieces = this.pieces.map((p) => {
        if (p.samePiecePosition(playedPiece)) {
          p.position.x = newKingXPosition;
        } else if (p.samePiecePosition(destinationPiece)) {
          p.position.x = newKingXPosition - direction;
        }
        return p;
      });
      this.calculateMoves();
      return true;
    }

    if (enPassantMove) {
      this.pieces = this.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(playedPiece)) {
          if (piece.isPwn) (piece as Pawn).enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          piece.moved = true;
          results.push(piece);
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y - pawnDirection)
          )
        ) {
          if (piece.isPwn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      this.calculateMoves();
    } else if (validMove) {
      //UPDATES THE PIECE POSITION
      //AND IF A PIECE IS ATTACKED, REMOVES IT
      this.pieces = this.pieces.reduce((results, piece) => {
        // Piece that we are currently moving
        if (piece.samePiecePosition(playedPiece)) {
          //SPECIAL MOVE
          if (piece.isPwn)
            (piece as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2 &&
              piece.type === PieceType.pwn;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          piece.moved = true;
          results.push(piece);
        } else if (!piece.samePosition(destination)) {
          if (piece.isPwn) {
            (piece as Pawn).enPassant = false;
          }
          results.push(piece);
        }

        // The piece at the destination location
        // Won't be pushed in the results
        return results;
      }, [] as Piece[]);
      this.calculateMoves();
    } else {
      return false;
    }
    return true;
  }

  clone(): Board {
    return new Board(
      this.pieces.map((p) => p.clone()),
      this.totalTurns
    );
  }
}
