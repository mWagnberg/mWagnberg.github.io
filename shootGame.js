const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const img = new Image();
// img.onload = function(){
//   c.drawImage(img,10,10); // Or at whatever offset you like
// };
img.src = "assets/img/avataaars.svg";
img.width = "20px"
img.height = "20px"

const scoreEl = document.querySelector('#scoreEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')

let key = true
let up = 38
let down = 40
let left = 37
let right = 39

let playerSpeed = 10

class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    // c.beginPath()
    // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    // c.fillStyle = this.color
    // c.fill()
    c.drawImage(img,this.x - (this.radius),this.y - (this.radius),this.radius*2,this.radius*2);
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const friction = 0.98

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function playExplosion() {
  var mySound = new sound("explosion.wav");
  mySound.play();
}

const x = canvas.width / 2
const y = canvas.height / 2

let player
let projectiles
let enemies
let particles

function init() {
  player = new Player(x, y, 20, 'white')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  scoreEl.innerHTML = score
  bigScoreEl.innerHTML = score
}

let spawnEnemiesInterval

function spawnEnemies() {
  spawnEnemiesInterval = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x
    let y

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 + radius : canvas.width + radius
      y = Math.random() * canvas.height
    }
    else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 + radius : canvas.height + radius
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    // const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const angle = Math.atan2(player.y - y, player.x - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

function stopSpawnEnemies() {
  clearInterval(spawnEnemiesInterval)
}

let animationId
let score = 0

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0,0,0,0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    }
    else {
      particle.update()
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update()

    if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update()
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    
    if (enemy.x + enemy.radius < 0 || enemy.x - enemy.radius > canvas.width || enemy.y + enemy.radius < 0 || enemy.y - enemy.radius > canvas.height) {
      setTimeout(() => {
        enemies.splice(index, 1)
      }, 0);
    }

    if (dist - enemy.radius - player.radius < 1) {
      stopSpawnEnemies()
      cancelAnimationFrame(animationId)
      bigScoreEl.innerHTML = score
      modalEl.style.display = 'flex'
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (dist - enemy.radius - projectile.radius < 1) {

        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, { x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6) }))
        }

        if (enemy.radius - 10 > 5) {

          score += 100
          scoreEl.innerHTML = score

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0);
        }
        else {

          score += 250
          scoreEl.innerHTML = score

          setTimeout(() => {
            playExplosion()
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0);
        }
      }
    });
  });
}

function switchBetweenKeys() {
  if (!key) {
    up = 38
    down = 40
    left = 37
    right = 39
    key = true
  } else {
    up = 87
    down = 83
    left = 65
    right = 68
    key = false
  }
}

addEventListener('keydown', (event) => {
  console.log(event.keyCode)
  switch (event.keyCode) {
    case up:
      player.y -= playerSpeed
      break
    case down:
      player.y += playerSpeed
      break;
    case left:
      player.x -= playerSpeed
      break;
    case right:
      player.x += playerSpeed
      break;
    case 32:
      switchBetweenKeys()
      break;
    case 49:
      playerSpeed -= 5
      break;
    case 50:
      playerSpeed += 5
      break;
    
    default:
      return;
  }
})

addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
  // const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity))
  // projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
})

startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  modalEl.style.display = 'none'
})
