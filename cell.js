class Cell {
    constructor(x, y, size, index) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.walls = []; // top, right, bottom, left
        this.index = index;
        this.visited = false;
    }

    show() {
        if (this.visited) {
            noStroke();
            fill(255);
            rect(this.x * this.size, this.y * this.size, this.size, this.size);

            // fill(0);
            // strokeWeight(1);
            // text(
            //     this.index,
            //     this.x * this.size + this.size / 2,
            //     this.y * this.size + this.size / 2
            // );
        }
    }
}
