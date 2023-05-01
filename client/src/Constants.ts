export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"]
export const VERTICAL_AXIS = [1, 2, 3, 4, 5, 6, 7, 8]

export const GRID_SIZE = 100

export interface Position {
    x: number
    y: number
}

export function samePosition(p1: Position, p2: Position){
    return p1.x === p2.x && p1.y === p2.y
}

export interface Piece {
    image: string
    position: Position
    type: PieceType,
    team: Team,
    enPassant?: boolean
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

export const initState: Piece[] = []

//Pawns Init State
for (let i = 0; i < 8; i++) {
    initState.push({image: "images/whtpwn.png", position:{x:i, y:1}, type: PieceType.pwn, team: Team.wht})
    initState.push({image: "images/blkpwn.png", position:{x:i, y:6}, type: PieceType.pwn, team: Team.blk} ) 
}

//Backrow initState Init State
for (let p = 0; p < 2; p++) {
    const team = (p === 0) ? Team.blk : Team.wht
    const color = (p=== 0) ? "blk": "wht"
    const y = (p === 0) ? 7 : 0
    initState.push({image: `images/${color}kng.png`, position:{x:4, y}, type: PieceType.kng, team: team})
    initState.push({image: `images/${color}qen.png`, position:{x:3, y}, type: PieceType.qen, team: team})
    initState.push({image: `images/${color}bsp.png`, position:{x:2, y}, type: PieceType.bsp, team: team}) 
    initState.push({image: `images/${color}bsp.png`, position:{x:5, y}, type: PieceType.bsp, team: team}) 
    initState.push({image: `images/${color}nit.png`, position:{x:1, y}, type: PieceType.nit, team: team}) 
    initState.push({image: `images/${color}nit.png`, position:{x:6, y}, type: PieceType.nit, team: team})
    initState.push({image: `images/${color}ruk.png`, position:{x:0, y}, type: PieceType.ruk, team: team}) 
    initState.push({image: `images/${color}ruk.png`, position:{x:7, y}, type: PieceType.ruk, team: team})
}