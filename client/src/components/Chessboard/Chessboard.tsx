import './Chessboard.css'
import Tile from '../Tile/Tile'

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8]

interface Piece {
    image: string
    x: number
    y: number
}

const pieces: Piece[] = []

//Pawns Init State
for (let i = 0; i < 8; i++) {
    pieces.push({image: "images/whtpwn.png", x:i, y:1})
    pieces.push({image: "images/blkpwn.png", x:i, y:6}) 
}

//Backrow Pieces Init State
for (let p = 0; p < 2; p++) {
    const type = (p === 0) ? "blk": "wht"
    const y = (p === 0 ? 7 : 0)
    pieces.push({image: `images/${type}kng.png`, x:4, y})
    pieces.push({image: `images/${type}qen.png`, x:3, y})
    pieces.push({image: `images/${type}bsp.png`, x:2, y}) 
    pieces.push({image: `images/${type}bsp.png`, x:5, y}) 
    pieces.push({image: `images/${type}nit.png`, x:1, y}) 
    pieces.push({image: `images/${type}nit.png`, x:6, y})
    pieces.push({image: `images/${type}ruk.png`, x:0, y}) 
    pieces.push({image: `images/${type}ruk.png`, x:7, y})
}

let activePiece: HTMLElement | null = null

function grapPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    if (element.classList.contains("piece")) {
        console.log(e.target)
        const x = e.clientX - 50
        const y = e.clientY - 50
        element.style.position = "absolute"
        element.style.left = `${x}px`
        element.style.top = `${y}px`
        activePiece = element
    }
}

function movePiece(e: React.MouseEvent) {
    if (activePiece && activePiece.classList.contains("piece")) {
        const x = e.clientX - 50
        const y = e.clientY - 50
        activePiece.style.position = "absolute"
        activePiece.style.left = `${x}px`
        activePiece.style.top = `${y}px`
    }
}

function dropPiece(e: React.MouseEvent) {
    if (activePiece) {
        activePiece = null
    }
}


export default function Chessboard() {
    let board = []

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
    return <div onMouseUp={(e) => dropPiece(e)} onMouseMove={(e) => movePiece(e)} onMouseDown={e => grapPiece(e)} id='chessboard'>{board}</div>
}