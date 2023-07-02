import React from 'react'
import './Node.css'

const Node = ({row, col, isStart, isFinish , isWall, weight, onMouseDown, onMouseEnter, onMouseUp}) => {
    const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';
    return (
    <div
        id={`node-${row}-${col}`}
        className={ weight!=="" ? `spanBig ${extraClassName}` : `node ${extraClassName}`}
        onMouseDown={()=>onMouseDown(row,col)}
        onMouseEnter={()=>onMouseEnter(row,col)}
        onMouseUp={()=>onMouseUp(row,col)}
    >
        <div className='weights'>
            {weight}
        </div>
    </div>
    )   
}

export default Node;    
