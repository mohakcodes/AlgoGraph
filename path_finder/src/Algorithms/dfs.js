export function dfs(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    const stackOfNeighbours = [];
    stackOfNeighbours.push(startNode);
    while(!!stackOfNeighbours.length)
    {
        const currNode = stackOfNeighbours.pop();
        if(currNode === finishNode)
        {
            return visitedNodesInOrder;
        }
        if(!currNode.isWall && (currNode.isStart || !currNode.isVisited))
        {
            visitedNodesInOrder.push(currNode);
            currNode.isVisited = true;
            const {row,col} = currNode;
            let nextNode;

            if(row > 0)
            {
                nextNode = grid[row-1][col];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    stackOfNeighbours.push(nextNode);
                }   
            }
            if(row < grid.length-1)
            {
                nextNode = grid[row+1][col];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    stackOfNeighbours.push(nextNode);
                }   
            }
            if(col > 0)
            {
                nextNode = grid[row][col-1];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    stackOfNeighbours.push(nextNode);
                }    
            }
            if(col < grid[0].length-1)
            {
                nextNode = grid[row][col+1];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    stackOfNeighbours.push(nextNode);
                }   
            }
        }
    }
}