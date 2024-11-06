export let image_data;
export let canvas_handler;
export let context;

export function init_canvas(canvas_id) {
    canvas_handler = document.querySelector(`#${canvas_id}`);
    if (!canvas_handler) {
        throw new Error(`Canvas dengan id '${canvas_id}' tidak ditemukan.`);
    }
    context = canvas_handler.getContext("2d");
    image_data = context.createImageData(canvas_handler.width, canvas_handler.height);
}

export class gambarApel {
    constructor() {
    }

    // titik
    gambartitik(x, y, r, g, b) {
        let index = (x + y * canvas_handler.width) * 4;
        image_data.data[index + 0] = r; // Merah
        image_data.data[index + 1] = g; // Hijau
        image_data.data[index + 2] = b; // Biru
        image_data.data[index + 3] = 255; // Alpha
    }

    // Fungsi untuk menggambar lingkaran menggunakan koordinat polar
    lingkaranPolar(xc, yc, radius, r, g, b) {
        for (let theta = 0; theta < Math.PI * 2; theta += 0.0001) {
            const x = xc + radius * Math.cos(theta);
            const y = yc + radius * Math.sin(theta);
            this.gambartitik(Math.ceil(x), Math.ceil(y), r, g, b);
        }
    }

    // Fungsi untuk mengisi area lingkaran (flood fill) menggunakan metode stack
    floodFill(centerX, centerY, toFlood, color) {
        const index = 4 * (centerX + centerY * canvas_handler.width);
        const r1 = image_data.data[index];
        const g1 = image_data.data[index + 1];
        const b1 = image_data.data[index + 2];

        // Cek warna yang akan diisi
        if (r1 !== toFlood.r || g1 !== toFlood.g || b1 !== toFlood.b) return;

        const stack = [{ x: centerX, y: centerY }];
        
        while (stack.length > 0) {
            const current = stack.pop();
            const currentIndex = 4 * (current.x + current.y * canvas_handler.width);
            const r = image_data.data[currentIndex];
            const g = image_data.data[currentIndex + 1];
            const b = image_data.data[currentIndex + 2];

            // Jika warna saat ini sama dengan warna yang akan diisi
            if (r === toFlood.r && g === toFlood.g && b === toFlood.b) {
                // Isi warna baru
                image_data.data[currentIndex] = color.r;
                image_data.data[currentIndex + 1] = color.g;
                image_data.data[currentIndex + 2] = color.b;
                image_data.data[currentIndex + 3] = 255;

                // Tambahkan tetangga ke stack
                stack.push({ x: current.x + 1, y: current.y });
                stack.push({ x: current.x - 1, y: current.y });
                stack.push({ x: current.x, y: current.y + 1 });
                stack.push({ x: current.x, y: current.y - 1 });
            }
        }
    }

    drawLine(x1, y1, x2, y2, color = { r: 0, g: 0, b: 0 }) {
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = (x2 < x1) ? -1 : 1; // arah x
        let sy = (y2 < y1) ? -1 : 1; // arah y
        let err = dx - dy; // kesalahan awal

        while (true) {
            this.gambartitik(x1, y1, color.r, color.g, color.b); // menggambar titik

            // jika titik akhir tercapai, keluar dari loop
            if (x1 === x2 && y1 === y2) break;

            // hitung kesalahan
            let err2 = err * 2;
            if (err2 > -dy) {
                err -= dy;
                x1 += sx; // geser x
            }
            if (err2 < dx) {
                err += dx;
                y1 += sy; // geser y
            }
        }
    }

    // Fungsi untuk menggambar apel lengkap
    drawApple(x, y) {
        image_data = context.createImageData(canvas_handler.width, canvas_handler.height);

        // apel dan warna apel
        this.lingkaranPolar(x, y, 30, 139, 0, 0);  // Outline merah tua
        this.floodFill(x, y, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 });   // Isi merah

        // batang dan daun
        this.drawLine(x, y - 30, x + 5, y - 45, { r: 139, g: 69, b: 19 });  // Batang coklat
        this.drawLine(x + 5, y - 40, x + 15, y - 45, { r: 0, g: 100, b: 0 }); // Daun
        this.drawLine(x + 15, y - 45, x + 5, y - 50, { r: 0, g: 100, b: 0 }); // Daun
        this.drawLine(x + 5, y - 50, x + 5, y - 40, { r: 0, g: 100, b: 0 }); // Daun

        // print
        context.putImageData(image_data, 0, 0);
    }

    // Fungsi untuk mendapatkan posisi random
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * (canvas_handler.width - 60) + 30),
            y: Math.floor(Math.random() * (canvas_handler.height - 60) + 30)
        };
    }
}
