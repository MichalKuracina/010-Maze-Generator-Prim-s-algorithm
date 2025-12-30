let mode = "manual";
const gridWidth = 700;
const gridHeight = 700;
const cellSize = 25;
let cells = [];
let walls = [];
let maze = [];
let mazeWalls = [];

function setup() {
    createCanvas(gridWidth, gridHeight);
    createGrid();
    createWalls();
    addButton();

    // Add random starting cell to maze
    let randomCell = cells[Math.floor(Math.random() * cells.length)];
    randomCell.visited = true;
    maze.push(randomCell);
}

function draw() {
    background(0, 0, 0);

    if (mode === "manual") {
        noLoop();
    }

    createMazeWalls();

    // Pick random wall
    let randomWall = mazeWalls[Math.floor(Math.random() * mazeWalls.length)];
    randomWall.color = "blue";

    // Find neighbouring cell
    let neighbouringCell = cells.filter((cell) => {
        return (
            cell.walls.some((wall) => {
                return (
                    wall[0] === randomWall.x1 &&
                    wall[1] === randomWall.y1 &&
                    wall[2] === randomWall.x2 &&
                    wall[3] === randomWall.y2
                );
            }) && !cell.visited
        );
    });

    // if (neighbouringCell[0]?.index === !undefined) {
    let neighbourCount = countNeighbours(neighbouringCell[0].index);

    // Add neighbouring cell to maze if only one neighbour + remove wall
    if (neighbourCount === 1) {
        neighbouringCell[0].visited = true;
        maze.push(neighbouringCell[0]);
        mazeWalls = mazeWalls.filter(
            (o) =>
                !(
                    o.x1 === randomWall.x1 &&
                    o.y1 === randomWall.y1 &&
                    o.x2 === randomWall.x2 &&
                    o.y2 === randomWall.y2
                )
        );
    }

    // Display cells and walls
    let flattenedCells = cells.flat();
    flattenedCells.forEach((cell) => {
        cell.show();
    });

    // mazeWalls.forEach((wall) => {
    //     wall.show();
    // });
}

function stepPlusOne() {
    mode = "manual";
    loop();
}

function stepRun() {
    mode = "auto";
    frameRate(60);
    loop();
}

function addButton() {
    let buttonContainer = createDiv();
    buttonContainer.style("display", "flex");
    buttonContainer.style("align-items", "center");
    buttonContainer.style("gap", "10px");

    let stepText = createP("Click to step");
    stepText.parent(buttonContainer);
    let stepButton = createButton("+1");
    stepButton.mousePressed(stepPlusOne);
    stepButton.parent(buttonContainer);

    let runText = createP("Click to run");
    runText.parent(buttonContainer);
    let runButton = createButton(" >> ");
    runButton.mousePressed(stepRun);
    runButton.parent(buttonContainer);
}

function createGrid() {
    let rows = gridWidth / cellSize;
    let cols = gridHeight / cellSize;
    let index = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            cells.push(new Cell(x, y, cellSize, index));
            index++;
        }
    }
}

function createWalls() {
    cells.forEach((cell) => {
        // top wall
        let x1 = cell.x * cellSize;
        let y1 = cell.y * cellSize;
        let x2 = (cell.x + 1) * cellSize;
        let y2 = cell.y * cellSize;
        if (y1 !== 0 && y2 !== 0) {
            walls.push(new Wall(x1, y1, x2, y2));
            cell.walls.push([x1, y1, x2, y2]);
        }
        // right wall
        x1 = (cell.x + 1) * cellSize;
        y1 = cell.y * cellSize;
        x2 = (cell.x + 1) * cellSize;
        y2 = (cell.y + 1) * cellSize;
        if (x1 !== gridWidth && x2 !== gridWidth) {
            walls.push(new Wall(x1, y1, x2, y2));
            cell.walls.push([x1, y1, x2, y2]);
        }
        // bottom wall
        x1 = cell.x * cellSize;
        y1 = (cell.y + 1) * cellSize;
        x2 = (cell.x + 1) * cellSize;
        y2 = (cell.y + 1) * cellSize;
        if (y1 !== gridHeight && y2 !== gridHeight) {
            walls.push(new Wall(x1, y1, x2, y2));
            cell.walls.push([x1, y1, x2, y2]);
        }
        // left wall
        x1 = cell.x * cellSize;
        y1 = cell.y * cellSize;
        x2 = cell.x * cellSize;
        y2 = (cell.y + 1) * cellSize;
        if (x1 !== 0 && x2 !== 0) {
            walls.push(new Wall(x1, y1, x2, y2));
            cell.walls.push([x1, y1, x2, y2]);
        }
    });
}

function createMazeWalls() {
    mazeWalls = [];
    cells.forEach((cell) => {
        if (!cell.visited) return;

        // top wall
        let x1 = cell.x * cellSize;
        let y1 = cell.y * cellSize;
        let x2 = (cell.x + 1) * cellSize;
        let y2 = cell.y * cellSize;
        if (y1 !== 0 && y2 !== 0) {
            // Above cell
            let aboveCell = cells.find(
                (c) => c.x === cell.x && c.y === cell.y - 1
            );
            if (aboveCell && !aboveCell.visited)
                mazeWalls.push(new Wall(x1, y1, x2, y2, "red"));
        }
        // right wall
        x1 = (cell.x + 1) * cellSize;
        y1 = cell.y * cellSize;
        x2 = (cell.x + 1) * cellSize;
        y2 = (cell.y + 1) * cellSize;
        if (x1 !== gridWidth && x2 !== gridWidth) {
            // Right cell
            let rightCell = cells.find(
                (c) => c.x === cell.x + 1 && c.y === cell.y
            );
            if (rightCell && !rightCell.visited)
                mazeWalls.push(new Wall(x1, y1, x2, y2, "red"));
        }
        // bottom wall
        x1 = cell.x * cellSize;
        y1 = (cell.y + 1) * cellSize;
        x2 = (cell.x + 1) * cellSize;
        y2 = (cell.y + 1) * cellSize;
        if (y1 !== gridHeight && y2 !== gridHeight) {
            // Below cell
            let belowCell = cells.find(
                (c) => c.x === cell.x && c.y === cell.y + 1
            );
            if (belowCell && !belowCell.visited)
                mazeWalls.push(new Wall(x1, y1, x2, y2, "red"));
        }
        // left wall
        x1 = cell.x * cellSize;
        y1 = cell.y * cellSize;
        x2 = cell.x * cellSize;
        y2 = (cell.y + 1) * cellSize;
        if (x1 !== 0 && x2 !== 0) {
            // Left cell
            let leftCell = cells.find(
                (c) => c.x === cell.x - 1 && c.y === cell.y
            );
            if (leftCell && !leftCell.visited)
                mazeWalls.push(new Wall(x1, y1, x2, y2, "red"));
        }
    });
}

function countNeighbours(current) {
    let x = cells[current].x;
    let y = cells[current].y;

    let potentialNextCells = [];

    let aboveCell = cells.find((cell) => cell.x === x && cell.y === y - 1);
    if (aboveCell && aboveCell.visited) {
        potentialNextCells.push(aboveCell);
    }
    let rigthCell = cells.find((cell) => cell.x === x + 1 && cell.y === y);
    if (rigthCell && rigthCell.visited) {
        potentialNextCells.push(rigthCell);
    }
    let belowCell = cells.find((cell) => cell.x === x && cell.y === y + 1);
    if (belowCell && belowCell.visited) {
        potentialNextCells.push(belowCell);
    }
    let leftCell = cells.find((cell) => cell.x === x - 1 && cell.y === y);
    if (leftCell && leftCell.visited) {
        potentialNextCells.push(leftCell);
    }

    // let randomNextCell =
    //     potentialNextCells[
    //         Math.floor(Math.random() * potentialNextCells.length)
    //     ];

    // if (randomNextCell === undefined) {
    //     stack.pop();
    //     return;
    // }

    // randomNextCell.visited = true;

    // nextCellIndex = cells.findIndex(
    //     (c) => c.x === randomNextCell.x && c.y === randomNextCell.y
    // );

    // stack.push(nextCellIndex);

    // removeWalls(cells[current], cells[nextCellIndex]);
    return potentialNextCells.length;
}
