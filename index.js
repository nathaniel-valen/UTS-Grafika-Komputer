import { init_canvas, gambarApel } from './lib.js';

document.addEventListener('DOMContentLoaded', () => {
    init_canvas('myCanvas'); 
    const gambar = new gambarApel(); // munculkan gambar apel

    // Fungsi untuk menggambar apel di posisi acak
    function moveApple() {
        const newPosition = gambar.getRandomPosition();
        gambar.drawApple(newPosition.x, newPosition.y);
    }

    moveApple();
    setInterval(moveApple, 3000);
});
