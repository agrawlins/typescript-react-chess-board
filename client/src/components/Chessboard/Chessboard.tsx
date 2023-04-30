import './Chessboard.css'
import Tile from '../Tile/Tile'
import Referee from "../../referee/Referee"
import {useRef, useState } from 'react'
import { relative } from 'path'

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8]

export interface Piece {
    image: string
    x: number
    y: number
    type: PieceType,
    team: Team
}

export enum PieceType {
    pwn,
    bsp,
    nit,
    ruk,
    qen,
    kng
}

export enum Team {
    blk,
    wht
}

const initState: Piece[] = []

//Pawns Init State
for (let i = 0; i < 8; i++) {
    initState.push({image: "images/whtpwn.png", x:i, y:1, type: PieceType.pwn, team: Team.wht})
    initState.push({image: "images/blkpwn.png", x:i, y:6, type: PieceType.pwn, team: Team.blk} ) 
}

//Backrow initState Init State
for (let p = 0; p < 2; p++) {
    const team = (p === 0) ? Team.blk : Team.wht
    const color = (p=== 0) ? "blk": "wht"
    const y = (p === 0) ? 7 : 0
    initState.push({image: `images/${color}kng.png`, x:4, y, type: PieceType.kng, team: team})
    initState.push({image: `images/${color}qen.png`, x:3, y, type: PieceType.qen, team: team})
    initState.push({image: `images/${color}bsp.png`, x:2, y, type: PieceType.bsp, team: team}) 
    initState.push({image: `images/${color}bsp.png`, x:5, y, type: PieceType.bsp, team: team}) 
    initState.push({image: `images/${color}nit.png`, x:1, y, type: PieceType.nit, team: team}) 
    initState.push({image: `images/${color}nit.png`, x:6, y, type: PieceType.nit, team: team})
    initState.push({image: `images/${color}ruk.png`, x:0, y, type: PieceType.ruk, team: team}) 
    initState.push({image: `images/${color}ruk.png`, x:7, y, type: PieceType.ruk, team: team})
}




export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
    const [gridX, setGridX] = useState(0)
    const [gridY, setGridY] = useState(0)
    const [pieces, setPieces] = useState<Piece[]>(initState)
    const chessboardRef = useRef<HTMLDivElement>(null)
    let board = []
    const referee = new Referee
    function grapPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement
        const chessboard = chessboardRef.current
        if (element.classList.contains("piece") && chessboard) {
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100))
            setGridY(Math.abs(Math.ceil((e.clientY -  chessboard.offsetTop - 800) / 100)))
            const x = e.clientX - 50
            const y = e.clientY - 50
            element.style.position = "absolute"
            element.style.left = `${x}px`
            element.style.top = `${y}px`
            // activePiece = element
            setActivePiece(element)
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 25
            const minY = chessboard.offsetTop - 25
            const maxX = chessboard.offsetLeft + chessboard.clientWidth -50
            const maxY = chessboard.offsetTop + chessboard.clientHeight -50
            const x = e.clientX - 50
            const y = e.clientY - 50
            activePiece.style.position = "absolute"
            // activePiece.style.top = `${y}px`
            if (x < minX) {
                activePiece.style.left = `${minX}px`
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`              
            } else {                
                activePiece.style.left = `${x}px`
            }
            if (y< minY) {
                activePiece.style.top = `${minY}px`
            } else if (y> maxY) {
                activePiece.style.top = `${maxY}px`              
            } else {                
                activePiece.style.top = `${y}px`
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
            const y = Math.abs(Math.ceil((e.clientY -  chessboard.offsetTop - 800) / 100))

            const currentPiece = pieces.find(p => p.x == gridX && p.y == gridY)
            const attackedPiece = pieces.find(p => p.x === x && p.y === y)
            if (currentPiece) {                
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)
                if (validMove) { 
                    //UPDATES PIECE POSITION
                         
                    //Removes Piece if Attacked
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.x === currentPiece.x && piece.y === currentPiece.y) {
                            piece.x = x
                            piece.y = y
                            results.push(piece)
                        } else if (!(piece.x === x && piece.y === y)) {
                            results.push(piece)
                        }
                        return results
                    }, [] as Piece[])

                    setPieces(updatedPieces)
                } else {
                    //Resets Piece Position
                    activePiece.style.position = 'relative'
                    activePiece.style.removeProperty("top")
                    activePiece.style.removeProperty("left")
                }
            }
            setActivePiece(null)
        }
    }

    for (let i = verticalAxis.length-1; i >= 0; i--) {
        for (let j = 0; j < horizontalAxis.length; j++) {
            const number = j + i

            let image = undefined

            pieces.forEach(p => {
                if (p.x === j && p.y === i) {
                    image = p.image
                }
            })

            board.push(
                <Tile
                    key={`${j}, ${i}`}
                    number={number}
                    image={image}
                />
            )
        }
        
    }
    return (
    <div 
        id='chessboard'
        ref={chessboardRef}
        onMouseUp={(e) => dropPiece(e)} 
        onMouseMove={(e) => movePiece(e)} 
        onMouseDown={e => grapPiece(e)} 
    >
        {board}
    </div>
    )
}