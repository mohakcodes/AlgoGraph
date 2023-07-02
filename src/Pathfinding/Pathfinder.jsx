import React, { useEffect, useState } from 'react'
import Node from './Node/Node'
import './Pathfinder.css'

import { dijkstra } from '../Algorithms/dijkstra';
import { dfs } from '../Algorithms/dfs';
import { bfs } from '../Algorithms/bfs';

let START_GRID_ROW = 8;
let START_GRID_COL = 12;
let FINISH_GRID_ROW = 8;
let FINISH_GRID_COL = 33;

let timeouts = [];

const FAST_SPEED = 10;
const MEDIUM_SPEED = 25;
const SLOW_SPEED = 40;

const Pathfinder = () => {

  const [grid, setGrid] = useState([]);
  const [mouseIsActive, setMouseIsActive] = useState(false);

  const [scene, setScene] = useState("Visualize ");
  const [algo, setAlgo] = useState("Dijkstra🌄");

  const [activity, setActivity] = useState(false);

  const [speed , setSpeed] = useState(FAST_SPEED);
  const [speedName , setSpeedName] = useState("Fast 🚀");

  const [range , setRange] = useState("10");
  const [rangeVal , setRangeVal] = useState("0-9");

  const [alterEndPointRow , setAlterEndPointRow] = useState(0);
  const [alterEndPointCol , setAlterEndPointCol] = useState(0);
  const [movingStart , setMovingStart] = useState(false);
  const [movingFinish , setMovingFinish] = useState(false);

  const [hault , setHault] = useState(false);

  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === START_GRID_ROW && col === START_GRID_COL,
      isFinish: row === FINISH_GRID_ROW && col === FINISH_GRID_COL,
      distance: Infinity,
      weight:algo==="Dijkstra🌄" ? Math.floor(Math.random() * Number(range)) : "",
      isVisited: false,
      isWall: false,
      previousNode: null,
    }
  }

  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 18; row++) {
      const currRow = [];
      for (let col = 0; col < 46; col++) {
        currRow.push(createNode(row, col));
      }
      grid.push(currRow);
    }
    return grid;
  }

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, [algo,range,hault]);

  const mouseInactive = () => {
    setMouseIsActive(false);
  }

  const gridWithWallAdded = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const updatedNode = {
      ...node,
      isWall: !node.isWall,
    }
    newGrid[row][col] = updatedNode;
    return newGrid;
  }

  const handleMouseDown = (row, col) => {
    if(!activity)
    {
      if(document.getElementById(`node-${row}-${col}`).className === `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-start`)
      {
        setMouseIsActive(true);
        setMovingStart(true);
        setAlterEndPointRow(row);
        setAlterEndPointCol(col);
      }
      else if(document.getElementById(`node-${row}-${col}`).className === `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-finish`)
      {
        setMouseIsActive(true);
        setMovingFinish(true);
        setAlterEndPointRow(row);
        setAlterEndPointCol(col);
      }
      else
      {
        const newGrid = gridWithWallAdded(grid, row, col);
        setGrid(newGrid);
        setMouseIsActive(true);
      }
    }
  }

  const handleMouseEnter = (row, col) => {
    if(!activity)
    {
      if(mouseIsActive)
      {
        const currNodeClassName = document.getElementById(`node-${row}-${col}`).className;
        if(movingStart || movingFinish)
        {
          //let endpoints switch...
        }
        else
        {
          const newGrid = gridWithWallAdded(grid, row, col);
          setGrid(newGrid);
        }
      }
    }
  }

  const handleMouseUp = (row,col) => {
    setMouseIsActive(false);
    if(movingStart)
    {
      setMovingStart(false);
      if(document.getElementById(`node-${row}-${col}`).className !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-wall`)
      {
        const prevNode = grid[alterEndPointRow][alterEndPointCol];
        prevNode.isStart = !prevNode.isStart;
        document.getElementById(`node-${alterEndPointRow}-${alterEndPointCol}`).className = `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'}`;
        setAlterEndPointRow(row);
        setAlterEndPointCol(col);
        const currNode = grid[row][col];
        currNode.isStart = !currNode.isStart;
        document.getElementById(`node-${row}-${col}`).className = `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-start`;
        START_GRID_ROW = row;
        START_GRID_COL = col;
      }
    }
    if(movingFinish)
    {
      setMovingFinish(false);
      if(document.getElementById(`node-${row}-${col}`).className !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-wall`)
      {
        const prevNode = grid[alterEndPointRow][alterEndPointCol];
        prevNode.isFinish = !prevNode.isFinish;
        document.getElementById(`node-${alterEndPointRow}-${alterEndPointCol}`).className = `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'}`;
        setAlterEndPointRow(row);
        setAlterEndPointCol(col);
        const currNode = grid[row][col];
        currNode.isFinish = !currNode.isFinish;
        document.getElementById(`node-${row}-${col}`).className = `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-finish`;
        FINISH_GRID_ROW = row;
        FINISH_GRID_COL = col;
      }
    }
  }

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      console.log(nodesInShortestPathOrder[i].weight);
      if(nodesInShortestPathOrder[i] === "end")
      {
        const timeout = setTimeout(() => {
          toggleActivity();
        }, i*60);
        timeouts.push(timeout);
      }
      else
      {
        const timeout = setTimeout(() => {
          const currNode = nodesInShortestPathOrder[i];
          const currNodeClassName = document.getElementById(`node-${currNode.row}-${currNode.col}`).className;
          if(currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-start` && 
             currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-finish`)
           {
            document.getElementById(`node-${currNode.row}-${currNode.col}`).className = `${algo==="Dijkstra🌄" ? "spanBig" : "node"} node-shortest-path`;
           }
        }, 50 * i);
        timeouts.push(timeout);
      }
    }
  };

  const animateAlgo = (visitedNodesInOrder, nodesInShortestPathOrder, speed) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        const timeout = setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        timeouts.push(timeout);
        return;
      }
      const timeout = setTimeout(() => {
        const currNode = visitedNodesInOrder[i];
        const currNodeClassName = document.getElementById(`node-${currNode.row}-${currNode.col}`).className;
        if(currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-start` && 
           currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-finish`)
           {
            document.getElementById(`node-${currNode.row}-${currNode.col}`).className = `${algo==="Dijkstra🌄" ? "spanBig" : "node"} node-visited`;
           }
      }, speed * i);
      timeouts.push(timeout);
    }
  };

  function getNodesInShortestPathOrder(finishNode)
  {
    const nodesInShortestPathOrder = [];
    let src = finishNode;
    while(src !== null)
    {
        nodesInShortestPathOrder.unshift(src);
        src = src.previousNode;
    }
    return nodesInShortestPathOrder;
  }

  const toggleActivity = () => {
    setActivity(prev => !prev);
  }

  const visualizeAlgo = () => {
    if(!activity)
    {
      removeGrids();
      toggleActivity();
      const startNode = grid[START_GRID_ROW][START_GRID_COL];
      const finishnode = grid[FINISH_GRID_ROW][FINISH_GRID_COL];

      let visitedNodesInOrder, nodesInShortestPathOrder;

      if (algo === "Dijkstra🌄") {
        visitedNodesInOrder = dijkstra(grid, startNode, finishnode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishnode);
      }
      else if (algo === "DFS🏖️") {
        visitedNodesInOrder = dfs(grid, startNode, finishnode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishnode);
      }
      else {
        visitedNodesInOrder = bfs(grid, startNode, finishnode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishnode);
      }
      nodesInShortestPathOrder.push("end");
      animateAlgo(visitedNodesInOrder , nodesInShortestPathOrder, speed);
    }
  }

  // const [scene, setScene] = useState("Visualize ");
  // const [algo, setAlgo] = useState("Dijkstra🌄");
  // const [activity, setActivity] = useState(false);
  // const [speed , setSpeed] = useState(FAST_SPEED);
  // const [speedName , setSpeedName] = useState("Fast 🚀");
  // const [range , setRange] = useState("10");
  // const [rangeVal , setRangeVal] = useState("0-9");

  const changeAlgo = (x) => {
    if(!activity)
    {
      removeGrids();
      setScene("Visualize ");
      setAlgo(x);
    }
  }

  const changeSpeed = (x) => {
    if(!activity)
    {
      if(x === "Fast")
      {
        setSpeed(FAST_SPEED);
        setSpeedName("Fast 🚀");
      }
      if(x === "Medium")
      {
        setSpeed(MEDIUM_SPEED);
        setSpeedName("Medium 🚗");
      }
      if(x === "Slow")
      {
        setSpeed(SLOW_SPEED);
        setSpeedName("Slow 🐢");
      }
    }
  }

  const changeRange = (x) => {
    if(!activity)
    {
      setRange(x);
      removeGrids();
      if(x==="10")
      {
        setRangeVal("0-9");
      }
      if(x==="50")
      {
        setRangeVal("0-49");
      }
      if(x==="100")
      {
        setRangeVal("0-100");
      }
    }
  }

  const removeWalls = () => {
    if(!activity)
    {
      const newGrid = grid.slice();
      for(const row of newGrid)
      {
        for(const node of row)
        {
          let currNodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
          if(currNodeClassName === 'node node-wall')
          {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            node.isWall = false;
          }
          if(currNodeClassName === 'spanBig node-wall')
          {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'spanBig';
            node.isWall = false;
          }
          // node.isVisited = false;
        }
      }
    }
  }

  const removeGrids = () => {
    if(!activity)
    {
      const newGrid = grid.slice();
      for(const row of newGrid)
      {
        for(const node of row)
        {
          node.previousNode = null;
          let currNodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
          if(currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-start` &&
             currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-finish` &&
             currNodeClassName !== `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-wall`)
             {
                document.getElementById(`node-${node.row}-${node.col}`).className = `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'}`
                node.isVisited = false;
                node.distance = Infinity;
             }
           if(currNodeClassName === `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-start`)
           {
              node.isVisited = false;
              node.distance = Infinity;
              node.isStart = true;
              node.isWall = false;
              node.previousNode = null;
           }
           if(currNodeClassName === `${algo==="Dijkstra🌄" ? 'spanBig' : 'node'} node-finish`)
           {
              node.isFinish = true;
              node.isVisited = false;
              node.distance = Infinity;
           }
        }
      }
    }
  }

  const haultFunction = () => {
    if(activity)
    {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts = [];
      toggleActivity();
    }
  }

  return (
    <>
      <div className='btn'>
        <div className="dropdown">
          <button className="dropbtn">Choose Algorithm 🠋</button>
          <div className="dropdown-content">
            <a onClick={() => changeAlgo("Dijkstra🌄")}>DIJKSTRA ALGORITHM</a>
            <a onClick={() => changeAlgo("DFS🏖️")}>DEPTH FIRST SEARCH</a>
            <a onClick={() => changeAlgo("BFS🌅")}>BREADTH FIRST SEARCH</a>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">🠋 Speed : {speedName}</button>
          <div className="dropdown-content">
            <a onClick={() => changeSpeed("Fast")}>FAST</a>
            <a onClick={() => changeSpeed("Medium")}>MEDIUM</a>
            <a onClick={() => changeSpeed("Slow")}>SLOW</a>
          </div>
        </div>
        <button onClick={visualizeAlgo}>
          {scene}{algo}
        </button>
        <button onClick={haultFunction}>
          Stop✋
        </button>
        <div className="dropdown">
          <button className="dropbtn">🠋 Clear</button>
          <div className="dropdown-content">
            <a onClick={() => removeWalls()}>Clear Walls</a>
            <a onClick={() => removeGrids()}>Clear Grids</a>
          </div>
        </div>
        {
          algo==="Dijkstra🌄" ? (
            <div className='nw'>
              Weighted ✅
              Finds Shortest Path 🛣️
            </div>
          ) : ""
        }
        {
          algo==="Dijkstra🌄" ? (
            <div className="dropdown">
              <button className="dropbtn">🠋 Weight Range : {rangeVal}</button>
              <div className="dropdown-content">
                <a onClick={() => changeRange("10")}>0-9</a>
                <a onClick={() => changeRange("50")}>0-49</a>
                <a onClick={() => changeRange("100")}>0-99</a>
              </div>
            </div>
            ) : algo==="DFS🏖️" ? (
                <div className='nw'>
                  Non-Weighted ❌
                  Not Finds Shortest Path ❌
                </div>
              ) : (
                <div className='nw'>
                  Non-Weighted ❌
                  Finds Shortest Path 🛣️
                </div>
            )
        }
      </div>
      <div className='text'>
        Click & Drag to draw walls
      </div>
      <table className="grid-container">
        <tbody className="grid" onMouseLeave={mouseInactive}>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall, weight } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      weight={weight}
                      mouseIsActive={mouseIsActive}
                      onMouseDown={() => handleMouseDown(row, col)}
                      onMouseEnter={() => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp(row,col)}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  )
}

export default Pathfinder;