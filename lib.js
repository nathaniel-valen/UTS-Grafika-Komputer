export let image_data;
export let canvas_handler;
export let context;

export default class ImageLib {
    constructor(canvas_id) {
        this.canvas_handler = document.querySelector(`#${canvas_id}`);
        this.context = this.canvas_handler.getContext("2d");
        this.image_data = this.context.getImageData(0, 0, this.canvas_handler.width, this.canvas_handler.height);

        this.canvasWidth = this.canvas_handler.width;
        this.canvasHeight = this.canvas_handler.height;
        this.bombs = [
            {
                x: this.canvasWidth / 2,
                y: this.canvasHeight / 2,
                radius: 10,
                color: { r: 0, g: 0, b: 0 },
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                bounceCount: 0
            }
        ];
    }

    create_dot(x, y, color) {
        const index = (Math.round(x) + Math.round(y) * this.canvas_handler.width) * 4;
        this.image_data.data[index] = color.r;
        this.image_data.data[index + 1] = color.g;
        this.image_data.data[index + 2] = color.b;
        this.image_data.data[index + 3] = 255;
    }

    clear_canvas() {
        this.context.clearRect(0, 0, this.canvas_handler.width, this.canvas_handler.height);
        this.image_data = this.context.getImageData(0, 0, this.canvas_handler.width, this.canvas_handler.height);
    }

    draw_circle(xc, yc, r, color) {
        for (let y = -r; y <= r; y++) {
            for (let x = -r; x <= r; x++) {
                if (x * x + y * y <= r * r) {
                    this.create_dot(xc + x, yc + y, color);
                }
            }
        }
        this.context.putImageData(this.image_data, 0, 0);
    }

    // Created by ChatGPT
    updateBombs() {
        let newBombs = [];

        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            bomb.x += bomb.speedX;
            bomb.y += bomb.speedY;

            let bounced = false;

            if (bomb.x + bomb.radius > this.canvasWidth || bomb.x - bomb.radius < 0) {
                bomb.speedX = -bomb.speedX;
                bounced = true;

                if (bomb.x + bomb.radius > this.canvasWidth) {
                    bomb.x = this.canvasWidth - bomb.radius - 1;
                } else if (bomb.x - bomb.radius < 0) {
                    bomb.x = bomb.radius + 1;
                }
            }

            if (bomb.y + bomb.radius > this.canvasHeight || bomb.y - bomb.radius < 0) {
                bomb.speedY = -bomb.speedY;
                bounced = true;

                if (bomb.y + bomb.radius > this.canvasHeight) {
                    bomb.y = this.canvasHeight - bomb.radius - 1;
                } else if (bomb.y - bomb.radius < 0) {
                    bomb.y = bomb.radius + 1;
                }
            }

            if (bounced && bomb.bounceCount < 1) {
                newBombs.push({
                    x: bomb.x + (bomb.speedX > 0 ? -5 : 5), 
                    y: bomb.y + (bomb.speedY > 0 ? -5 : 5),
                    radius: bomb.radius,
                    color: bomb.color,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: (Math.random() - 0.5) * 2,
                    bounceCount: bomb.bounceCount + 1
                });
            }
        }

        if (newBombs.length > 0) {
            this.bombs.push(newBombs[0]);
        }
    }

    drawBombs() {
        this.clear_canvas();
        this.bombs.forEach(bomb => {
            this.draw_circle(bomb.x, bomb.y, bomb.radius, bomb.color);
        });
    }

    animate() {
        this.updateBombs();
        this.drawBombs();
        requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        this.animate();
    }
}
