import "./Chessboard.css";
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";
import { useRef, useState } from "react";
import {
  HORIZONTAL_AXIS,
  VERTICAL_AXIS,
  GRID_SIZE,
  Piece,
  PieceType,
  Position,
  samePosition,
  Team,
  initState,
} from "../../Constants";

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pwnPromoted, setPwnPromoted] = useState<Piece>()
  const [pieces, setPieces] = useState<Piece[]>(initState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  let board = [];
  const modelRef = useRef<HTMLDivElement>(null)
  const referee = new Referee();

  function grapPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({ x: grabX, y: grabY });
      // setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100))
      // setGridY(Math.abs(Math.ceil((e.clientY -  chessboard.offsetTop - 800) / 100)))
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      // activePiece = element
      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 50;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";
      // activePiece.style.top = `${y}px`
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );
      // const attackedPiece = pieces.find(p => p.position.x === x && p.position.y === y)

      //currentPiece (3,4)
      if (currentPiece) {
        const validMove = referee.isValidMove(
          grabPosition,
          {x, y},
          currentPiece.type,
          currentPiece.team,
          pieces
        );
        const isEnPassant = referee.enPassant(
          grabPosition,
          {x, y},
          currentPiece.type,
          currentPiece.team,
          pieces
        );
        const pwnDirection = currentPiece.team === Team.wht ? 1 : -1;
        if (isEnPassant) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pwnDirection })
            ) {
              if (piece.type === PieceType.pwn) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);
          setPieces(updatedPieces);
        } else if (validMove) {
          //UPDATES PIECE POSITION

          //Removes Piece if Attacked
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
                //Special Move
                piece.enPassant = Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.pwn
            //   if (
            //     Math.abs(grabPosition.y - y) === 2 &&
            //     piece.type === PieceType.pwn
            //   ) {
            //     piece.enPassant = true;
            //   } else {
            //     piece.enPassant = false;
            //   }
              piece.position.x = x;
              piece.position.y = y;
              let promotionRow = piece.team === Team.wht ? 7 : 0
              if (y === promotionRow && piece.type === PieceType.pwn) {
                modelRef.current?.classList.remove("hidden")
                setPwnPromoted(piece)
              }
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              if (piece.type === PieceType.pwn) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else {
          //Resets Piece Position
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  for (let i = VERTICAL_AXIS.length - 1; i >= 0; i--) {
    for (let j = 0; j < HORIZONTAL_AXIS.length; j++) {
      const number = j + i;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: j, y: i })
      );
      let image = piece ? piece.image : undefined;

      // pieces.forEach(p => {
      //     if (p.position.x === j && p.position.y === i) {
      //         image = p.image
      //     }
      // })

      board.push(<Tile key={`${j}, ${i}`} number={number} image={image} />);
    }
  }

  function promotePwn(pieceType: PieceType) {
    if (pwnPromoted === undefined) {
      return
    }
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, pwnPromoted.position)) {
        piece.type = pieceType
        const team = piece.team === Team.wht ? "wht" : "blk"
        let pieceImg = ""
        switch (pieceType) {
          case PieceType.ruk:
            pieceImg = "ruk"
            break;
          case PieceType.nit:
            pieceImg = "nit"
            break;
          case PieceType.bsp:
            pieceImg = "bsp"
            break;
          case PieceType.qen:
            pieceImg = "qen"
            break;
        }
        piece.image = `images/${team}${pieceImg}.png`
      }
      results.push(piece)
      return results
    }, [] as Piece[])
    setPieces(updatedPieces)
    modelRef.current?.classList.add("hidden")
  }

  function promotionTeam(){
    return pwnPromoted?.team === Team.wht ? "wht" : "blk"
  }

//   for (let p = 0; p < 2; p++) {
//     const team = (p === 0) ? Team.blk : Team.wht
//     const color = (p=== 0) ? "blk": "wht"
//     const y = (p === 0) ? 7 : 0
// }
//     initState.push({image: `images/${color}kng.png`, position:{x: 4, y}, type: PieceType.kng, team: team})
//     initState.push({image: `images/${color}qen.png`, position:{x: 3, y}, type: PieceType.qen, team: team})
//     initState.push({image: `images/${color}bsp.png`, position:{x: 2, y}, type: PieceType.bsp, team: team})
//     initState.push({image: `images/${color}bsp.png`, position:{x: 5, y}, type: PieceType.bsp, team: team})
//     initState.push({image: `images/${color}nit.png`, position:{x: 1, y}, type: PieceType.nit, team: team})
//     initState.push({image: `images/${color}nit.png`, position:{x: 6, y}, type: PieceType.nit, team: team})
//     initState.push({image: `images/${color}ruk.png`, position:{x: 0, y}, type: PieceType.ruk, team: team})
//     initState.push({image: `images/${color}ruk.png`, position:{x: 7, y}, type: PieceType.ruk, team: team})
  return (
    <>
      <div
        id="pwnPromotionModel"
        className="hidden"
        ref={modelRef}
      >
        <div className="modelBody">
          <img onClick={() => promotePwn(PieceType.bsp)} src={`/images/${promotionTeam()}bsp.png`}/>
          <img onClick={() => promotePwn(PieceType.nit)} src={`/images/${promotionTeam()}nit.png`}/>
          <img onClick={() => promotePwn(PieceType.ruk)} src={`/images/${promotionTeam()}ruk.png`}/>
          <img onClick={() => promotePwn(PieceType.qen)} src={`/images/${promotionTeam()}qen.png`}/>
        </div>
      </div>
      <div
        id="chessboard"
        ref={chessboardRef}
        onMouseUp={(e) => dropPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grapPiece(e)}
      >
        {board}
      </div>
    </>
  );
}
