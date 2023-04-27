import './Tile.css'


interface Props {
    image?: string
    number: number
}

export default function Tile({number, image}: Props) {
    if (number % 2 === 0) {        
        return <div className='tile blk-tile'>
            {image && <div style={{backgroundImage: `url(${image})`}} className='piece'></div>}
            </div>;
    } else {
        return <div className='tile wht-tile'>
                {image && <div style={{backgroundImage: `url(${image})`}} className='piece'></div>}
            </div>;
    }
}
