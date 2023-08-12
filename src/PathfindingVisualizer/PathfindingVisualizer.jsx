import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {dfs} from '../algorithms/dfs.js'
import {aStar} from '../algorithms/aStar.js'
import './PathfindingVisualizer.css';


const START_NODE_ROW = Math.floor(Math.random() * 22);
const START_NODE_COL = Math.floor(Math.random() * 50);
const FINISH_NODE_ROW = Math.floor(Math.random() * 22);
const FINISH_NODE_COL = Math.floor(Math.random() * 50);

export default class PathfindingVisualizer extends Component {
  state = {grid: [], mouseIsPressed: false};

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const nodes = [[row, col]];
    const newGrid = getNewGridWithWallToggled(this.state.grid, nodes);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const nodes = [[row, col]];
    const newGrid = getNewGridWithWallToggled(this.state.grid, nodes);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if(i === visitedNodesInOrder.length - 1) continue;
      else if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 15 * i);
      } else {
          const node = visitedNodesInOrder[i];
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-visited";
            }, 15 * i);
        }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        if(i === 0) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-start";
              }, 40 * i);
        } else if (i === nodesInShortestPathOrder.length - 1) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-finish";
              }, 40 * i);
        }
        else {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
            }, 40 * i);
        }
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeDFS() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeAStar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  createMaze() {
    const {grid} = this.state;
    const nodes = [];
    for(let i = 0; i < Math.floor(Math.random() * 600) + 200; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 22);
            col = Math.floor(Math.random() * 50);
        } while((row === START_NODE_ROW && col === START_NODE_COL) || (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) || (grid[row][col].isWall));
        
        nodes.push([row, col]);
    }

    const newGrid = getNewGridWithWallToggled2(grid, nodes);
    this.setState({grid: newGrid});
  }
  clearGrid() {
    // const {grid} = this.state;
    let newGrid = getInitialGrid();
    for(let i = 0; i < newGrid.length; i++) {
        for(let j = 0; j < newGrid[0].length; j++) {
            let node = newGrid[i][j];
            if(i === START_NODE_ROW && j === START_NODE_COL) {
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-start";
            } else if (i === FINISH_NODE_ROW && j === FINISH_NODE_COL) {
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node-finish";
            } else {
                document.getElementById(`node-${node.row}-${node.col}`).className = "node node";
            }
        }
    }

    this.setState({grid: newGrid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className = "container1">
            <button onClick = {() => this.visualizeDijkstra()} id = "button">
            Run Dijkstra's
            </button>
            <button onClick = {() => this.visualizeDFS()} id = "button">
            Run DFS
            </button>
            <button onClick = {() => this.visualizeAStar()} id = "button">
            Run A Star
            </button>
        </div>

        <div className = "container2">
            <button onClick = {() => this.createMaze()} id = "button2">
            Create a Maze
            </button>
            <button onClick = {() => this.clearGrid()} id = "button2">
            Clear Grid
            </button>
        </div>

        <div className = "grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key = {rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key = {nodeIdx}
                      col = {col}
                      isFinish = {isFinish}
                      isStart = {isStart}
                      isWall = {isWall}
                      mouseIsPressed = {mouseIsPressed}
                      onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter = {(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp = {() => this.handleMouseUp()}
                      row = {row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 22; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    distanceToFinishNode: 
        Math.abs(FINISH_NODE_ROW - row) +
        Math.abs(FINISH_NODE_COL - col),
  };
};

const getNewGridWithWallToggled = (grid, nodes) => {
  const newGrid = grid.slice();
  for(const node of nodes) {
    const newNode = newGrid[node[0]][node[1]];
    newNode.isWall = !newNode.isWall;
    newGrid[node[0]][node[1]] = newNode;
  }
  return newGrid;
};

const getNewGridWithWallToggled2 = (grid, nodes) => {
    const newGrid = getInitialGrid();

    for(const node of nodes) {
      const newNode = newGrid[node[0]][node[1]];
      newNode.isWall = true;
      newGrid[node[0]][node[1]] = newNode;
    }

    return newGrid;
  };

