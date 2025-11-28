// const img = new Image();
// img.src = 'path/to/my/image.png'; img.onload = () => {
//   // image loaded and ready to be used
// }

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
        resolve(img);
        };
    }) 
}

window.onload = async () => {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets2/player.png");
  enemyImg = await loadTexture("assets2/enemyShip.png");
  laserImg = await loadTexture("assets2/laserRed.png");
  laserRedShotImg = await loadTexture("assets2/laserRedShot.png");
  initGame();
  let gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
}, 100) };

function createEnemies() {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);


      enemy.img = enemyImg;
      gameObjects.push(enemy);
} }
}

// function createEnemies2(ctx, canvas, enemyImg) {
//     const ROW_TOTAL = 5;
   
//     for (let row = 0; row < ROW_TOTAL; row += 1){
//         const MONSTER_TOTAL = ROW_TOTAL - row;
//         const START_X = (canvas.width - MONSTER_TOTAL * enemyImg.width) / 2;
//         const y = row * enemyImg.height

//         for (let i = 0; i < MONSTER_TOTAL; i++) {
//             const x = START_X + i * enemyImg.width;
//             ctx.drawImage(enemyImg, x, y);
//         }
//     }
// }

function createHero() {
  hero = new Hero(
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4
  );
  hero.img = heroImg;
  gameObjects.push(hero);
  hero_mini = new Hero(
    canvas.width / 2 - 100,
    canvas.height - canvas.height / 4
  );
  hero_mini.img = heroImg;
  hero_mini.width = 50;
  hero_mini.height = 50;
  gameObjects.push(hero_mini);

  hero_mini2 = new Hero(
    canvas.width / 2 + 60,
    canvas.height - canvas.height / 4
  );
  hero_mini2.img = heroImg;
  hero_mini2.width = 50;
  hero_mini2.height = 50;
  gameObjects.push(hero_mini2);
}

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.type = "";
    this.width = 0;
    this.height = 0;
    this.img = undefined;
  }
  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
}; }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //
} 
}


class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
// 적 캐릭터의 자동 이동 (Y축 방향) 
    let id = setInterval(() => {
        if (this.y < canvas.height - this.height) { 
            this.y += 5; // 아래로 이동
        } 
        else {
            console.log('Stopped at', this.y); clearInterval(id); // 화면 끝에 도달하면 정지
        }
    }, 300);
} }

let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
    case 37: // 왼쪽 화살표 
    case 39: // 오른쪽 화살표 
    case 38: // 위쪽 화살표 
    case 40: // 아래쪽 화살표 
    case 32: // 스페이스바
    e.preventDefault();
    break;
    default:
    break;
} };
   
window.addEventListener('keydown', onKeyDown);

window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  }
  else if (evt.keyCode === 32) { // 스페이스바
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  }
});

const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO"
};

function initGame() {
  gameObjects = [];
  createEnemies();
  createHero();
  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -=5 ;
    hero_mini.y -=5 ;
    hero_mini2.y -=5 ;
  })
  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 5;
    hero_mini.y += 5;
    hero_mini2.y += 5;
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 5;
    hero_mini.x -= 5;
    hero_mini2.x -= 5;
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 5;
    hero_mini.x += 5;
    hero_mini2.x += 5;
  });
  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
    }
    if(hero_mini.canFire()){
      setInterval(() => {
        hero_mini.fire();
      }, 200);
    }
    if(hero_mini2.canFire()){
      setInterval(() => {
        hero_mini2.fire();
      }, 200);
    }
  });
  
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.img = laserRedShotImg;
    setTimeout (() => {
      second.dead = true;
    }, 200);
  });
}

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
                this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload)); 
        }
    }
}

let heroImg,
  enemyImg,
  laserImg,
  laserRedShotImg,
  canvas, ctx,
  gameObjects = [],
  hero,
  eventEmitter = new EventEmitter();

function drawGameObjects(ctx) {
  gameObjects.forEach(go => go.draw(ctx));
}

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
); }

class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = 'Laser';
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
this.y -= 15; // 레이저가 위로 이동 
} 
else {
this.dead = true; // 화면 상단에 도달하면 제거
        clearInterval(id);
      }
}, 100); }
}

function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter((go) => go.type === "Laser");
  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
} });
});
// 죽은 객체 제거
  gameObjects = gameObjects.filter(go => !go.dead);
}

class Hero extends GameObject {
  constructor(x, y) {
super(x, y);
this.width = 99; this.height = 75; this.type = 'Hero'; this.cooldown = 0; //초기화
}
fire() {
if (this.canFire()) { //쿨다운 확인
gameObjects.push(new Laser(this.x + 45, this.y - 10)); 
this.cooldown = 500; //쿨다운 500ms 설정
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
clearInterval(id); //쿨다운 완료 후 타이머 종료 
}
}, 100); }
}

canFire() {
return this.cooldown === 0; //쿨다운 상태 확인
} }

eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
  if (hero.canFire()) {
    hero.fire();
  }
});

setInterval(() => {
ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height); drawGameObjects(ctx);
updateGameObjects(); // 충돌 감지
}, 100);

function intersectRect(r1, r2) {
  return !(

r2.left > r1.right ||
r2.right < r1.left ||
r2.top > r1.bottom ||
r2.bottom < r1.top
// r2가 r1의 오른쪽에 있음 // r2가 r1의 왼쪽에 있음 // r2가 r1의 아래에 있음 // r2가 r1의 위에 있음
); }