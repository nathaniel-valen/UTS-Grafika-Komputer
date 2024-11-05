// Nathanael Kanaya Chriesman
// 2272018

// Init canvas dan apple drawer
const canvas = document.getElementById('myCanvas');
const appleDrawer = new AppleDrawer(canvas);

// Fungsi untuk memindahkan apel
function moveApple() {
    const newPosition = appleDrawer.getRandomPosition();
    appleDrawer.drawApple(newPosition.x, newPosition.y);
}

// Gambar apel pertama kali
moveApple();

// memindahkan apel setiap 3 detik
setInterval(moveApple, 3000);