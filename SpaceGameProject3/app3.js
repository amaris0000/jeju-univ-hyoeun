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
  heroImg = await loadTexture("assets3/player.png");
  enemyImg = await loadTexture("assets3/enemyShip.png");
  laserImg = await loadTexture("assets3/laserRed.png");
  laserRedShotImg = await loadTexture("assets3/laserRedShot.png");
  laser_QImg = await loadTexture("assets3/laserGreenShot.png");
  lifeImg = await loadTexture("assets3/life.png");
  initGame();
  gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    drawPoints();
    drawLife();
}, 100) };

function createEnemies(stage) {
// const MONSTER_TOTAL = 5;
// const MONSTER_WIDTH = MONSTER_TOTAL * 98;
// const START_X = (canvas.width - MONSTER_WIDTH) / 2;
// const STOP_X = START_X + MONSTER_WIDTH;
//   for (let x = START_X; x < STOP_X; x += 98) {
//     for (let y = 0; y < 50 * 5; y += 50) {
//       const enemy = new Enemy(x, y);
//       enemy.img = enemyImg;
//       gameObjects.push(enemy);
// } }
const enemyCounts ={ // 적 수
  1: 1,
  2: 3,
  3: 5
};
const count = enemyCounts[stage] || 3;  
const MONSTER_WIDTH = count * 98;
const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  
  for (let i = 0; i< count; i++){
    const x = START_X + (i * 98);
    const y = 200
    const enemy = new Enemy(x, y);
    enemy.img = enemyImg;
    gameObjects.push(enemy);
} }

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
  } 
  else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } 
  else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } 
  else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  }
  else if (evt.keyCode === 32) { // 스페이스바
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  }
  else if(evt.key === "Enter") {
    eventEmitter.emit(Messages.KEY_EVENT_ENTER);
  }
  else if(evt.key === "q" || evt.key === "Q") {
    eventEmitter.emit(Messages.KEY_EVENT_Q);
  }

  
});

const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
  KEY_EVENT_Q: "KEY_EVENT_Q"
};

function initGame() {
  gameObjects = [];
  currentStage = 1;
  createEnemies(currentStage);
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

  eventEmitter.on(Messages.KEY_EVENT_Q, () => {
    if (hero.canFire()) {
      hero.fire_Q();
    }
  })

  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
   first.dead = true;
   second.dead = true;
   setTimeout (() => {
      second.dead = true;
    }, 200);
   hero.incrementPoints();
  } );
 
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
   enemy.dead = true;
   hero.decrementLife();
  });

  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
    resetGame();
  });

  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
    hero.incrementPoints();
    if (isEnemiesDead()) { //추가 
    // eventEmitter.emit(Messages.GAME_END_WIN);
    nextStage();
    } });

  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => { 
    enemy.dead = true;
    hero.decrementLife();
    if (isHeroDead()) { //추가
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return; // loss before victory
    }
    if (isEnemiesDead()) { //추가 
      eventEmitter.emit(Messages.GAME_END_WIN);
    } 
  });
  
  eventEmitter.on(Messages.GAME_END_WIN, () => { //추가 
    endGame(true);
  });
  
  eventEmitter.on(Messages.GAME_END_LOSS, () => { //추가 
    endGame(false);
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
    clear() {
  this.listeners = {};
}
}

let heroImg,
  enemyImg,
  laserImg,
  laserRedShotImg,
  laser_QImg,
  lifeImg,
  canvas, ctx,
  gameObjects = [],
  hero,
  eventEmitter = new EventEmitter()
  gameLoopId=null,
  currentStage = 1;

function drawGameObjects(ctx) {
  gameObjects.forEach(go => go.draw(ctx));
}

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  ); 
}

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
    }, 100); 
  }
}

class Laser_Q extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 100), (this.height = 100);
    this.type = 'Laser_Q';
    this.img = laser_QImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15; // 레이저가 위로 이동 
      } 
      else {
        this.dead = true; // 화면 상단에 도달하면 제거
        clearInterval(id);
      }
    }, 100); 
  }
}

function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter((go) => go.type === "Laser");
  const lasers_Q = gameObjects.filter((go) => go.type === "Laser_Q");

  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      } 
    });
  });

  lasers_Q.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        m.dead = true;
        hero.incrementPoints();
        if (isEnemiesDead()) {
          nextStage();
        }
      } 
    });
  });

  enemies.forEach(enemy => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  });
// 죽은 객체 제거
  gameObjects = gameObjects.filter(go => !go.dead);
}

class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 99; 
    this.height = 75; 
    this.type = 'Hero'; 
    this.cooldown = 0; 
    this.life = 3;
    this.points = 0; //초기화
  }

  fire() {
    if (this.canFire()) { //쿨다운 확인
      gameObjects.push(new Laser(this.x + 45, this.y - 10)); 
      this.cooldown = 500; //쿨다운 500ms 설정
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } 
        else {
          clearInterval(id); //쿨다운 완료 후 타이머 종료 
        }
      }, 100); 
    }
  }

  fire_Q() {
    if (this.canFire()) { //쿨다운 확인
      gameObjects.push(new Laser_Q(this.x + 45, this.y - 10)); 
      this.cooldown = 500; //쿨다운 500ms 설정
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } 
        else {
          clearInterval(id); //쿨다운 완료 후 타이머 종료 
        }
      }, 100); 
    }
  }

  canFire() {
    return this.cooldown === 0; //쿨다운 상태 확인
  } 

  decrementLife() {
    this.life--;
    if (this.life === 0) {
      this.dead = true;
    }
  }

  incrementPoints() {
    this.points += 100;
  }
}

function drawLife() {
  const START_POS = canvas.width - 180;
  for(let i=0; i < hero.life; i++ ) {
    ctx.drawImage(
      lifeImg,
      START_POS + (45 * (i+1) ),
      canvas.height - 37
    );
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height-20);
  drawText("Stage: " + currentStage, 10, 30);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

function nextStage() {
  if (currentStage < 3) {
    currentStage++;
    
    setTimeout(() => {
      gameObjects = gameObjects.filter(go => go.type !== 'Enemy' && go.type !== 'Laser' && go.type !== 'Laser_Q');
      createEnemies(currentStage); // 새로운 스테이지 적 생성
    }, 1500);
  } else {
    // 모든 스테이지 완료
    eventEmitter.emit(Messages.GAME_END_WIN);
  }
}
function isHeroDead() {
  return hero.life <= 0;
}

function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" &&!go.dead);
  return enemies.length === 0;
}

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame(win) {
  clearInterval(gameLoopId);
  gameLoopId = null;
// 게임 화면이 겹칠 수 있으니, 200ms 지연 
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (win) {
      displayMessage("Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew","green");
    } 
    else {
      displayMessage("You died !!! Press [Enter] to start a new game Captain Pew Pew"); 
    }
  }, 200) 
}

function resetGame() {
    clearInterval(gameLoopId); //게임 루프 중지, 중복 실행 방지 
    gameLoopId = null;
    eventEmitter.clear(); //모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지 
    initGame(); // 게임 초기 상태 실행
    gameLoopId = setInterval(() => { // 100ms간격으로 새로운 게임 루프 시작
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawPoints();
      drawLife();
      updateGameObjects();
      drawGameObjects(ctx);
    }, 100); 
}

