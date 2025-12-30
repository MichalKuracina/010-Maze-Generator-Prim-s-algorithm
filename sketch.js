let mode = "manual";
const gridWidth = 700;
const gridHeight = 700;
const cellSize = 50;
let sets = [];
let walls = [];

function setup() {
    createCanvas(gridWidth, gridHeight);
    createGrid();
    createWalls();
    addButton();
}

function draw() {
    background(0, 0, 0);

    if (mode === "manual") {
        noLoop();
    }

    // Pick random wall
    const randomWall = walls[Math.floor(Math.random() * walls.length)];

    // Find neighbouring cells
    let neighbours = sets.filter((cell) => {
        return cell.walls.some(
            (wall) =>
                JSON.stringify(wall) ===
                JSON.stringify([
                    randomWall.x1,
                    randomWall.y1,
                    randomWall.x2,
                    randomWall.y2,
                ])
        );
    });

    let sameSet = neighbours[0].index === neighbours[1].index;

    if (!sameSet) {
        // Merge sets
        let newIndex = neighbours[0].index;
        let oldIndex = neighbours[1].index;
        sets.forEach((cell) => {
            if (cell.index === oldIndex) {
                cell.index = newIndex;
            }
        });

        // Mark cell as visited
        sets.forEach((cell) => {
            if (cell.index === neighbours[0].index) {
                cell.visited = true;
            }
        });

        // Remove wall from walls array
        for (let i = walls.length - 1; i >= 0; i--) {
            if (
                walls[i].x1 === randomWall.x1 &&
                walls[i].y1 === randomWall.y1 &&
                walls[i].x2 === randomWall.x2 &&
                walls[i].y2 === randomWall.y2
            ) {
                walls.splice(i, 1);
            }
        }
    }

    // Display cells and walls
    let flattenedCells = sets.flat();
    flattenedCells.forEach((cell) => {
        cell.show();
    });

    walls.forEach((wall) => {
        wall.show();
    });

    // Stop if all cells are visited
    if (sets.filter((c) => c.visited).length === sets.length) {
        noLoop();
    }
}

function createWalls() {
    sets.forEach((cell) => {
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

function getNeighbour(current) {
    let x = cells[current].x;
    let y = cells[current].y;

    let potentialNextCells = [];

    let aboveCell = cells.find((cell) => cell.x === x && cell.y === y - 1);
    if (aboveCell && !aboveCell.visited) {
        potentialNextCells.push(aboveCell);
    }
    let rigthCell = cells.find((cell) => cell.x === x + 1 && cell.y === y);
    if (rigthCell && !rigthCell.visited) {
        potentialNextCells.push(rigthCell);
    }
    let belowCell = cells.find((cell) => cell.x === x && cell.y === y + 1);
    if (belowCell && !belowCell.visited) {
        potentialNextCells.push(belowCell);
    }
    let leftCell = cells.find((cell) => cell.x === x - 1 && cell.y === y);
    if (leftCell && !leftCell.visited) {
        potentialNextCells.push(leftCell);
    }

    let randomNextCell =
        potentialNextCells[
            Math.floor(Math.random() * potentialNextCells.length)
        ];

    if (randomNextCell === undefined) {
        stack.pop();
        return;
    }

    randomNextCell.visited = true;

    nextCellIndex = cells.findIndex(
        (c) => c.x === randomNextCell.x && c.y === randomNextCell.y
    );

    stack.push(nextCellIndex);

    removeWalls(cells[current], cells[nextCellIndex]);
}

function removeWalls(currentCell, nextCell) {
    let x = currentCell.x - nextCell.x;
    let y = currentCell.y - nextCell.y;

    if (x === 1) {
        currentCell.walls[3] = false;
        nextCell.walls[1] = false;
    } else if (x === -1) {
        currentCell.walls[1] = false;
        nextCell.walls[3] = false;
    }

    if (y === 1) {
        currentCell.walls[0] = false;
        nextCell.walls[2] = false;
    } else if (y === -1) {
        currentCell.walls[2] = false;
        nextCell.walls[0] = false;
    }
}

function stepPlusOne() {
    mode = "manual";
    loop();
}

function stepRun() {
    mode = "auto";
    frameRate(20);
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
            sets.push(new Cell(x, y, cellSize, index));
            index++;
        }
    }
}
