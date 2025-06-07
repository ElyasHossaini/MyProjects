// Game variables
let player, bullets, enemies;
let score = 0;
let gameOver = false;

// Player class
class Player {
  constructor() {
    this.width = 50;
    this.height = 30;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 20;
    this.speed = 5;
    this.canShoot = true; // Prevents continuous shooting
  }

  move(direction) {
    if (direction === "left" && this.x > 0) {
      this.x -= this.speed;
    }
    if (direction === "right" && this.x + this.width < canvas.width) {
      this.x += this.speed;
    }
  }

  shoot() {
    if (this.canShoot) {
      bullets.push(new Bullet(this.x + this.width / 2, this.y));
      this.canShoot = false; // Prevent shooting again until spacebar is released
    }
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Bullet class
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = 7;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Enemy class (slower falling speed)
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.speed = 1; // Slower fall speed
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Create a new player
player = new Player();

// Handle keyboard input
const keys = {
  left: false,
  right: false,
  space: false
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") keys.left = true;
  if (event.key === "ArrowRight") keys.right = true;
  if (event.key === " ") keys.space = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") keys.left = false;
  if (event.key === "ArrowRight") keys.right = false;
  if (event.key === " ") {
    keys.space = false;
    player.canShoot = true; // Allow shooting again when spacebar is released
  }
});

// Game loop
function gameLoop() {
  // Clear the canvas every frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player
  if (keys.left) player.move("left");
  if (keys.right) player.move("right");

  // Shoot bullets
  if (keys.space) player.shoot();

  // Update and draw bullets
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw();
    // Remove bullet if it goes off-screen
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Create enemies at random intervals
  if (Math.random() < 0.02) {
    const x = Math.random() * (canvas.width - 40);
    enemies.push(new Enemy(x, 0));
  }

  // Update and draw enemies
  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();
    // Check for collisions
    bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Remove bullet and enemy on collision
        bullets.splice(bIndex, 1);
        enemies.splice(index, 1);
        score += 10; // Increment score
      }
    });

    // Remove enemy if it goes off-screen
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  // Draw player
  player.draw();

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Repeat the game loop
  requestAnimationFrame(gameLoop);
}

// Initialize game elements
bullets = [];
enemies = [];

// Set canvas size dynamically
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Start the game loop
gameLoop();