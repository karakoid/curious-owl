class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.r = 20;

        this.trail = [{ x: this.x, y: this.y }];
    }

    move(deltaX, deltaY) {
        this.x += deltaX;
        this.y += deltaY;

        this.trail.push({ x: this.x, y: this.y });
    }

    draw() {
        ellipse(this.x, this.y, this.r);

        for (let i = 0; i < this.trail.length - 1; i++) {
            line(
                this.trail[i].x,
                this.trail[i].y,
                this.trail[i + 1].x,
                this.trail[i + 1].y
            );
        }
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    getTrail() {
        return this.trail;
    }
}
