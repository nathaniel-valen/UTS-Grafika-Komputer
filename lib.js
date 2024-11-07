export class ImageLib {
    constructor(canvas_id) {
        this.canvas_handler = document.querySelector(`#${canvas_id}`);
        this.context = this.canvas_handler.getContext("2d");
        this.canvasWidth = this.canvas_handler.width;
        this.canvasHeight = this.canvas_handler.height;
        
        this.image_data = this.context.createImageData(this.canvasWidth, this.canvasHeight);

        // Inisialisasi bom
        this.bombs = [
            {
                x: this.canvasWidth / 2,
                y: this.canvasHeight / 2,
                radius: 20,
                color: { r: 0, g: 0, b: 0 },
                speedX: (Math.random() - 0.5) * 10,
                speedY: (Math.random() - 0.5) * 10,
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

    create_line(x0,y0,x1,y1,color) {
        const dy = y1-y0;
        const dx = x1-x0;
        const m = dy/dx;
    
        if(Math.abs(dx) >= Math.abs(dy) && x1 >= x0) {
            for(let i = 0; i<x1-x0; i++){
                this.create_dot(x0+i, y0, {r:color.r, g:color.g, b:color.b});
                y0 += m;
            }
        } else if ((Math.abs(dx) >= Math.abs(dy) && x1 <= x0)) {
            for(let i = 0; i<x0-x1; i++){
                this.create_dot(x0-i, y0, {r:color.r, g:color.g, b:color.b});
                y0 -= m;
            }
        } else if ((Math.abs(dx) <= Math.abs(dy) && y1 >= y0)) {
            for(let i = 0; i<y1-y0; i++){
                this.create_dot(x0, y0+i, {r:color.r, g:color.g, b:color.b});
                x0 += dx/dy;
            }
        } else {
            for(let i = 0; i<y0-y1; i++){
                this.create_dot(x0, y0-i, {r:color.r, g:color.g, b:color.b});
                x0 -= dx/dy;
            }
        }
    }

    reset_canvas() {
        this.image_data = this.context.createImageData(this.canvasWidth, this.canvasHeight);
    }

    draw() {
        this.context.putImageData(this.image_data, 0, 0);
    }

    draw_circle(xc, yc, r, color) {
        for (let y = -r; y <= r; y++) {
            for (let x = -r; x <= r; x++) {
                if (x * x + y * y <= r * r) {
                    this.create_dot(xc + x, yc + y, color);
                }
            }
        }
    }

    updateBombs() {
        let newBombs = [];

        for (let bomb of this.bombs) {
            bomb.x += bomb.speedX;
            bomb.y += bomb.speedY;

            let bounced = false;

            if (bomb.x + bomb.radius > this.canvasWidth || bomb.x - bomb.radius < 0) {
                bomb.speedX = -bomb.speedX;
                bounced = true;
                bomb.x = bomb.x + bomb.radius > this.canvasWidth ? this.canvasWidth - bomb.radius - 1 : bomb.radius + 1;
            }

            if (bomb.y + bomb.radius > this.canvasHeight || bomb.y - bomb.radius < 0) {
                bomb.speedY = -bomb.speedY;
                bounced = true;
                bomb.y = bomb.y + bomb.radius > this.canvasHeight ? this.canvasHeight - bomb.radius - 1 : bomb.radius + 1;
            }

            if (bounced && bomb.bounceCount < 1) {
                newBombs.push({
                    x: bomb.x + (bomb.speedX > 0 ? -5 : 5), 
                    y: bomb.y + (bomb.speedY > 0 ? -5 : 5),
                    radius: bomb.radius,
                    color: bomb.color,
                    speedX: (Math.random() - 0.5) * 5,
                    speedY: (Math.random() - 0.5) * 5   ,
                    bounceCount: bomb.bounceCount + 1
                });
            }
        }

        if (newBombs.length > 0) {
            this.bombs.push(newBombs[0]);
        }
    }

    drawBombs() {
        for (let bomb of this.bombs) {
            this.draw_circle(bomb.x, bomb.y, bomb.radius, bomb.color);
        }
    }

    polar_circle(xc, yc, radius, color) {
        let x;
        let y;
        for (let theta = 0; theta < Math.PI * 2; theta += 0.01) {
            x = xc + radius * Math.cos(theta);
            y = yc + radius * Math.sin(theta);
            this.create_dot(x, y, { r: color.r, g: color.g, b: color.b });
        }
    }

    drawSnake(snake, radius) {
        for (let segment of snake) {
            this.solid_circle(segment.x, segment.y, radius, { r: 0, g: 255, b: 0 });
        }
    }

    solid_circle(xc, yc, radius, color) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) { // Hanya titik-titik dalam lingkaran
                    this.create_dot(xc + x, yc + y, color);
                }
            }
        }
    }
    


    // Fungsi untuk menggambar target apel lengkap dengan tangkai dan daun
    drawTarget(target, radius) {
        // Menggambar lingkaran utama untuk apel (warna merah)
        this.solid_circle(target.x, target.y, radius, { r: 255, g: 0, b: 0 });

        // Tangkai coklat di atas apel
        this.create_line(target.x, target.y - radius, target.x, target.y - radius - 1 * radius, { r: 102, g: 51, b: 0 });

        // Daun di sebelah kanan tangkai
        let leafBaseX = target.x + 1; // Mulai sedikit ke kanan dari ujung tangkai
        let leafBaseY = target.y - radius - 0.7 * radius + 5; // Mulai sedikit di atas ujung tangkai

        // Menggambar daun dengan dua garis
        this.create_line(leafBaseX, leafBaseY, leafBaseX + 10, leafBaseY - 5, { r: 0, g: 100, b: 0 }); // Garis daun pertama
        this.create_line(leafBaseX + 10, leafBaseY - 5, leafBaseX, leafBaseY - 10, { r: 0, g: 100, b: 0 }); // Garis daun kedua
    }


    generateRandomTarget(radius) {
        return {
            x: Math.floor(Math.random() * ((this.canvasWidth - 2 * radius) / radius)) * radius + radius,
            y: Math.floor(Math.random() * ((this.canvasHeight - 2 * radius) / radius)) * radius + radius,
        };
    }

    startGame() {
        let initialLength = 3;
        let snake = [];
        let radius = 20;
        let direction = { x: radius, y: 0 };
        let target = this.generateRandomTarget(radius);
        let isGameOver = false;
        let isReversing = false;
        let reverseTimeout;
        let skipSelfCollision = false;
    
        for (let i = 0; i < initialLength; i++) {
            snake.push({ x: 200 - i * radius, y: 200 });
        }
    
        document.addEventListener("keydown", (event) => {
            if (!isReversing) {
                switch (event.key) {
                    case "1":
                        if (direction.y === 0) direction = { x: 0, y: -radius }; // Atas
                        break;
                    case "2":
                        if (direction.y === 0) direction = { x: 0, y: radius }; // Bawah
                        break;
                    case "-":
                        if (direction.x === 0) direction = { x: -radius, y: 0 }; // Kiri
                        break;
                    case "=":
                        if (direction.x === 0) direction = { x: radius, y: 0 }; // Kanan
                        break;
                }
            }
        });
    
        document.addEventListener("wheel", (event) => {
            if (event.deltaY > 0) {
                isReversing = true;
    
                clearTimeout(reverseTimeout);
                reverseTimeout = setTimeout(() => {
                    isReversing = false;
                    skipSelfCollision = true;
                }, 200);
            }
        });
    
        const gameLoop = () => {
            if (isGameOver) return;
    
            if (isReversing) {
                for (let i = snake.length - 1; i > 0; i--) {
                    snake[i] = { ...snake[i - 1] };
                }
                snake[0] = { x: snake[1].x - direction.x, y: snake[1].y - direction.y };
            } else {
                const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
                if (head.x < 0 || head.x >= this.canvasWidth || head.y < 0 || head.y >= this.canvasHeight) {
                    this.endGame();
                    return;
                }
    
                if (!skipSelfCollision) {
                    for (let i = 1; i < snake.length; i++) {
                        if (head.x === snake[i].x && head.y === snake[i].y) {
                            this.endGame();
                            return;
                        }
                    }
                }
    
                skipSelfCollision = false;
    
                for (let bomb of this.bombs) {
                    const distX = head.x - bomb.x;
                    const distY = head.y - bomb.y;
                    const distance = Math.sqrt(distX * distX + distY * distY);
    
                    if (distance < bomb.radius) {
                        this.endGame();
                        return;
                    }
                }
    
                snake.unshift(head);
    
                if (head.x === target.x && head.y === target.y) {
                    target = this.generateRandomTarget(radius);
                } else {
                    snake.pop(); 
                }
            }
    
            this.reset_canvas();
            this.updateBombs();
            this.drawSnake(snake, radius);
            this.drawTarget(target, radius);
            this.drawBombs();
            this.draw();
    
            setTimeout(gameLoop, 100);
        };
    
        gameLoop();
    }
    
    
    endGame() {
        alert("Game Over! Press OK to restart.");
        location.reload(); // Restart game
    }
    
}
