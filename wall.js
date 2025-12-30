class Wall {
    constructor(x1, y1, x2, y2, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
    }

    show() {
        stroke(this.color);
        strokeWeight(3);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}
