export function bfs(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    const queueOfNeighbours = [];
    queueOfNeighbours.push(startNode);

    while(!!queueOfNeighbours.length)
    {
        const currNode = queueOfNeighbours.shift();
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

            if(col > 0)
            {
                nextNode = grid[row][col-1];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    queueOfNeighbours.push(nextNode);
                }    
            }
            if(row < grid.length-1)
            {
                nextNode = grid[row+1][col];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    queueOfNeighbours.push(nextNode);
                }   
            }
            if(col < grid[0].length-1)
            {
                nextNode = grid[row][col+1];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    queueOfNeighbours.push(nextNode);
                }   
            }
            if(row > 0)
            {
                nextNode = grid[row-1][col];
                if(!nextNode.isVisited)
                {
                    nextNode.previousNode = currNode;
                    queueOfNeighbours.push(nextNode);
                }   
            }
        }
    }
}