import { Piece, PieceType, Team } from "../components/Chessboard/Chessboard"

export default class Referee {

    tileOccupied(x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find(p => p.x === x && p.y === y)
        if (piece) {
            return true
        } else {
            return false
        }
    }

   tileOccupiedByOpponent(x:number, y:number, boardState: Piece[], team: Team): boolean{
        const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team)
        if(piece) {
            return true
        } else {
            return false
        }
   }

   enPassant(px: number, py: number, x: number, y: number, type: PieceType, team: Team, boardState: Piece[]) {
        const pwnDirection = (team === Team.wht) ? 1 : -1
        if(type === PieceType.pwn){
            if ((x - px === -1 || x - px === 1) && y - py === pwnDirection) {
                const piece = boardState.find(p => p.x === x && p.y === y - pwnDirection && p.enPassant)
                if (piece) {      
                    return true
                }
            }
        }
        
       return false
   }

    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: Team, boardState: Piece[]) {
        //PAWN RULES
        if(type === PieceType.pwn) {
            const specialRow = (team === Team.wht) ? 1 : 6
            const pwnDirection = (team === Team.wht) ? 1 : -1

            //Movement
            if (px === x && py === specialRow && y - py === 2 * pwnDirection) {
                if (!this.tileOccupied(x, y, boardState) && !this.tileOccupied(x, y - pwnDirection, boardState)) {
                    return true
                }
            } else if (px === x && y - py === pwnDirection) {
                if (!this.tileOccupied(x, y, boardState)) {
                    return true
                }
            }

            //Attack
            else if (x - px === -1 && y - py === pwnDirection) {
                //Atk in upr/btm l crnr
                if (this.tileOccupiedByOpponent(x, y, boardState, team)) {
                    return true
                }
            } else if (x - px === 1 && y - py === pwnDirection) {
                //Atk in upr/btm r crnr                
                if (this.tileOccupiedByOpponent(x, y, boardState, team)) {
                    return true
                }
            }
        }
        return false
    }
}