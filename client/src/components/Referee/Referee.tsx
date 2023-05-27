import { useRef, useState } from "react";
import { initBoard } from "../../Constants";
import { Piece, Position } from "../../models";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";
import {bspMove, kngMove, nitMove, pwnMove, qenMove, rukMove} from "../../referee/rules";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/Chessboard";

export default function Referee() {
  const [board, setBoard] = useState<Board>(initBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);
  const checkmateModalRef = useRef<HTMLDivElement>(null);

  function playMove(playedPiece: Piece, destination: Position): boolean {
    // If the playing piece doesn't have any moves return
    if (playedPiece.possibleMoves === undefined) return false;
    // Prevent the inactive team from playing
    if (playedPiece.team === TeamType.wht && board.totalTurns % 2 !== 1)
      return false;
    if (playedPiece.team === TeamType.blk && board.totalTurns % 2 !== 0)
      return false;
    let playedMoveIsValid = false;
    const validMove = playedPiece.possibleMoves?.some((m) =>
      m.samePosition(destination)
    );
    if (!validMove) return false;
    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );
    // playMove modifies the board thus we
    // need to call setBoard
    setBoard(() => {
      const clonedBoard = board.clone();
      clonedBoard.totalTurns += 1;
      // Playing the move
      playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);
      if (clonedBoard.winningTeam !== undefined) {
        checkmateModalRef.current?.classList.remove("hidden");
      }
      return clonedBoard;
    });
    // This is for promoting a pawn
    let promotionRow = playedPiece.team === TeamType.wht ? 7 : 0;
    if (destination.y === promotionRow && playedPiece.isPwn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn((previousPromotionPawn) => {
        const clonedPlayedPiece = playedPiece.clone();
        clonedPlayedPiece.position = destination.clone();
        return clonedPlayedPiece;
      });
    }
    return playedMoveIsValid;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.wht ? 1 : -1;
    if (type === PieceType.pwn) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPwn &&
            (p as Pawn).enPassant
        );
        if (piece) {
          return true;
        }
      }
    }
    return false;
  }

  //TODO
  //Add stalemate!
  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    let validMove = false;
    switch (type) {
      case PieceType.pwn:
        validMove = pwnMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.nit:
        validMove = nitMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.bsp:
        validMove = bspMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.ruk:
        validMove = rukMove(initialPosition,  desiredPosition, team, board.pieces);
        break;
      case PieceType.qen:
        validMove = qenMove(initialPosition, desiredPosition, team, board.pieces);
        break;
      case PieceType.kng:
        validMove = kngMove(initialPosition, desiredPosition, team, board.pieces);
    }
    return validMove;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
        } else {
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);
      clonedBoard.calculateMoves();
      return clonedBoard;
    });
    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.wht ? "wht" : "blk";
  }

  function restartGame() {
    checkmateModalRef.current?.classList.add("hidden");
    setBoard(initBoard.clone());
  }

  return (
    <>
      <h1 style={{ color: "white", fontSize: "24px", textAlign: "center" }}>
        {board.totalTurns % 2 !== 1 ? "Black" : "White"}'s Turn
      </h1>
      {/* <p style={{ color: "white", fontSize: "24px", textAlign: "center" }}>
        Total turns: {board.totalTurns - 1}
      </p> */}
      <div className="modal hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ruk)}
            src={`images/${promotionTeamType()}ruk.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.bsp)}
            src={`images/${promotionTeamType()}bsp.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.nit)}
            src={`images/${promotionTeamType()}nit.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.qen)}
            src={`images/${promotionTeamType()}qen.png`}
          />
        </div>
      </div>
      <div className="modal hidden" ref={checkmateModalRef}>
        <div className="modal-body">
          <div className="checkmate-body">
            <span>
              {board.winningTeam === TeamType.wht ? "White" : "Black"} Wins!
            </span>
            <button onClick={restartGame}>Play again?</button>
          </div>
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={board.pieces} />
    </>
  );
}
