export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const nextNodes = [startNode];
    while (nextNodes.length) {
        const currentNode = nextNodes.pop();

        if(currentNode === finishNode) {
            visitedNodesInOrder.push(currentNode);
            return visitedNodesInOrder;
        }

        if(!currentNode.isWall && (currentNode.isStart || !currentNode.isVisited)) {
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);

            const neighbours = getUnvisitedNeighbors(currentNode, grid);
            for(const neighbour of neighbours) {
                neighbour.previousNode = currentNode;
                nextNodes.push(neighbour);
            }
        }
    }
  }

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}