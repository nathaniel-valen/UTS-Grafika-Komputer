class AppleDrawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.imageData = this.ctx.createImageData(canvas.width, canvas.height);
    }

    // Fungsi untuk mengatur titik
    titik(x, y, r, g, b, a) {
        const index = (y * this.canvas.width + x) * 4;
        this.imageData.data[index] = r;     // Red
        this.imageData.data[index + 1] = g; // Green
        this.imageData.data[index + 2] = b; // Blue
        this.imageData.data[index + 3] = a; // Alpha
    }

    // Fungsi untuk menggambar lingkaran dengan algoritma Midpoint Circle
    drawCircle(centerX, centerY, radius, r, g, b, a) {
        let x = radius;
        let y = 0;
        let err = 0;

        while (x >= y) {
            this.plottitik(centerX, centerY, x, y, r, g, b, a);
            y += 1;
            err += 1 + 2 * y;
            if (2 * (err - x) + 1 > 0) {
                x -= 1;
                err += 1 - 2 * x;
            }
        }
    }

    // Fungsi untuk memplot titik-titik simetris lingkaran
    plottitik(centerX, centerY, x, y, r, g, b, a) {
        this.titik(centerX + x, centerY + y, r, g, b, a);
        this.titik(centerX - x, centerY + y, r, g, b, a);
        this.titik(centerX + x, centerY - y, r, g, b, a);
        this.titik(centerX - x, centerY - y, r, g, b, a);
        this.titik(centerX + y, centerY + x, r, g, b, a);
        this.titik(centerX - y, centerY + x, r, g, b, a);
        this.titik(centerX + y, centerY - x, r, g, b, a);
        this.titik(centerX - y, centerY - x, r, g, b, a);
    }

    // Fungsi untuk mengisi area lingkaran (flood fill)
    floodFill(centerX, centerY, radius, r, g, b, a) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    const pixelX = centerX + x;
                    const pixelY = centerY + y;
                    if (pixelX >= 0 && pixelX < this.canvas.width && 
                        pixelY >= 0 && pixelY < this.canvas.height) {
                        this.titik(pixelX, pixelY, r, g, b, a);
                    }
                }
            }
        }
    }

    // Fungsi untuk menggambar garis dengan algoritma Bresenham
    drawLine(x1, y1, x2, y2, r, g, b, a) {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.titik(x1, y1, r, g, b, a);
            if (x1 === x2 && y1 === y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }

    // Fungsi untuk menggambar apel lengkap
    drawApple(x, y) {
        // clear canvas
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

        // apel dan warna apel
        this.drawCircle(x, y, 30, 139, 0, 0, 255);  // Outline merah tua
        this.floodFill(x, y, 29, 255, 0, 0, 255);   // Isi merah

        // Gambar tangkai
        this.drawLine(x, y - 30, x + 5, y - 45, 139, 69, 19, 255);  // Coklat

        // Gambar daun 
        this.drawLine(x + 5, y - 40, x + 15, y - 45, 0, 100, 0, 255);
        this.drawLine(x + 15, y - 45, x + 5, y - 50, 0, 100, 0, 255);
        this.drawLine(x + 5, y - 50, x + 5, y - 40, 0, 100, 0, 255);

        // print
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    // Fungsi untuk mendapatkan posisi random
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width - 60) + 30),
            y: Math.floor(Math.random() * (this.canvas.height - 60) + 30)
        };
    }
}