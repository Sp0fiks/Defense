export class enemy {
    constructor(x, y, damage, health, path) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.health = health;
        this.speed = 0.05; // speed in pixels per millisecond
        this.path = path; // array of path points
        this.currentPathIndex = 0; // starting path index
        this.lastFrameTime = Date.now();
    }

    draw(c) {
        c.fillStyle = 'blue';
        c.beginPath();
        c.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        c.fill();
        c.fillStyle = 'red';
        c.fillRect(this.x-10,this.y-20,(this.health/100)*25,10)
    }

    startMoving() {
        this.lastFrameTime = Date.now();
        this.update();
    }

    update = () => {
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime; // time in milliseconds between frames
        this.lastFrameTime = now;
    
        this.moveAlongPath(deltaTime);
    
        if (this.currentPathIndex < this.path.length) {
            requestAnimationFrame(this.update);
        }
    }
    

    moveAlongPath(deltaTime) {
        if (this.currentPathIndex >= this.path.length) return;

        const target = this.path[this.currentPathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
            // If already at the target, move to the next point
            this.currentPathIndex++;
            return;
        }

        if (distance < this.speed * deltaTime) {
            // Move directly to the target if close enough
            this.x = target.x;
            this.y = target.y;
            this.currentPathIndex++;
        } else {
            // Move towards the target
            const directionX = dx / distance;
            const directionY = dy / distance;

            this.x += directionX * this.speed * deltaTime;
            this.y += directionY * this.speed * deltaTime;
        }
    }
}