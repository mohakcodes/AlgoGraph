let visitedNodesInOrder;

function getAllNodes(grid)
{
    const nodes = [];
    for (const row of grid)
    {
      for (const node of row)
      {
        nodes.push(node);
      }
    }
    return nodes;
}

function sortNodesByDistance(unvisitedNode){
    unvisitedNode.sort((nodeA , nodeB) => nodeA.distance - nodeB.distance);
}

function getUnvisitedNeighbours(source , grid)
{
    const neighbours = [];
    const {row , col} = source;
    if(row>0) neighbours.push(grid[row-1][col]);
    if(row<grid.length-1) neighbours.push(grid[row+1][col]);
    if(col>0) neighbours.push(grid[row][col-1]);
    if(col<grid[0].length-1) neighbours.push(grid[row][col+1]);
    return neighbours.filter(node => !node.isVisited);
}

function updateUnvisitedNeighbours(source , grid, finishNode)
{
    const unvisitedNeighbours = getUnvisitedNeighbours(source , grid);
    for(const eachNode of unvisitedNeighbours)
    {
        const {row,col} = eachNode;
        if(grid[row][col].distance > source.distance+eachNode.weight)
        {
            grid[row][col].distance = source.distance+eachNode.weight;
            grid[row][col].previousNode = source;
            if(finishNode === grid[row][col])
            {
                return visitedNodesInOrder;
            }
        }
    }
}

export function dijkstra(grid , startNode , finishNode){
    startNode.distance = 0;
    visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);
    while(!!unvisitedNodes.length)
    {
        sortNodesByDistance(unvisitedNodes);
        const closeNode = unvisitedNodes.shift();
        if(closeNode.isWall) continue;
        if(closeNode.distance === Infinity) return visitedNodesInOrder;
        closeNode.isVisited = true;
        visitedNodesInOrder.push(closeNode);
        if(closeNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbours(closeNode , grid, finishNode);
    }
}
