// 지속 발사 인터벌 관리
let firingIntervals = { mini: null, mini2: null }; 

// img 불러오기
function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
        resolve(img);
        };
    }) 
}

// 게임 시작 시점
window.onload = async () => {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  // 이미지 로드
  heroImg = await loadTexture("assets3/player.png");
  enemyImg = await loadTexture("assets3/enemyShip.png");
  enemyUFOImg = await loadTexture("assets3/enemyUFO.png");
  laserImg = await loadTexture("assets3/laserRed.png");
  laserRedShotImg = await loadTexture("assets3/laserRedShot.png");
  laser_QImg = await loadTexture("assets3/laserGreenShot.png");
  nebulaImg = await loadTexture("assets3/nebula.png");
  lifeImg = await loadTexture("assets3/life.png");
  bgWinImg = await loadTexture("assets3/background/win_bg.png");
  bgLossImg = await loadTexture("assets3/background/loss_bg.png");
  initGame(); // 게임 초기화
  gameLoopId = setInterval(() => { // 게임 루프 시작
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    updateGameObjects();
    drawPoints();
    drawLife();
}, 100) };

// 게임 오브젝트 클래스-------------------------------------------------------

// 기본 게임 오브젝트 클래스
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
    }; 
  }
  
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //
  } 
}

// 기본 레이저 클래스
class Laser extends GameObject {
  static width = 9;
  static height = 33;
  constructor(x, y) {
    super(x, y);
    this.width = Laser.width, 
    this.height = Laser.height;
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

// Q키 레이저 클래스
class Laser_Q extends GameObject {
  static width = 100;
  static height = 100;
  constructor(x, y) {
    super(x, y);
    this.width = Laser_Q.width,
    this.height = Laser_Q.height;
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

// 적 캐릭터 클래스
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

// 히어로 캐릭터 클래스
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
      const Laser_W = Laser.width; //레이저 폭
      const Laser_X = Math.round(this.x + (this.width - Laser_W) / 2); // 히어로 X 좌표 + 히어로 중앙까지 거리
      gameObjects.push(new Laser(Laser_X, this.y - 10)); 
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
      const Laser_Q_W = Laser_Q.width; //Q키 레이저 폭
      const Laser_Q_X = Math.round(this.x + (this.width - Laser_Q_W) / 2); // 히어로 X 좌표 + 히어로 중앙까지 거리
      gameObjects.push(new Laser_Q(Laser_Q_X, this.y - 10)); 
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

  // 히어로 생명 감소 메소드
  decrementLife() {
    this.life--;
    if (this.life === 0) {
      this.dead = true;
    }
  }

  // 히어로 점수 증가 메소드
  incrementPoints() {
    switch (currentStage) {
      case 1:
        this.points += 50;
        break;
      case 2:
        this.points += 75;
        break;
      case 3:
        this.points += 100;   
        break;
      case 4:
        this.points += 150;
        break;
      case 5:
        this.points += 200; 
        break;
      case 6:
        this.points += 300; 
        break;
      case 7:
        this.points += 500; 
        break;
      default:
        this.points += 100;
    }
  }
}



// 게임 오브젝트 업데이트 함수-------------------------------------------------------

function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter((go) => go.type === "Laser");
  const lasers_Q = gameObjects.filter((go) => go.type === "Laser_Q");

  // 레이저와 충돌 감지
  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l, // 레이저
          second: m, // 적
        });
      } 
    });
  });

  // 레이저Q와 충돌 감지
  lasers_Q.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER_Q, {
          first: l, // 레이저
          second: m, // 적
        });
      } 
    });
  });

  // 히어로와 적 충돌 감지
  enemies.forEach(enemy => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  });
  // 죽은 객체 제거
  gameObjects = gameObjects.filter(go => !go.dead);
}

// 게임 캐릭터 생성-------------------------------------------------------

// 적 캐릭터 생성
function createEnemies(stage) {
const enemyCounts ={ // 스테이지 별 적 수
  1: 1,
  2: 3,
  3: 5,
  4: 2,
  5: 4,
  6: 6,
  7: 1
};
const count = enemyCounts[stage] || 6; //enemyCounts 값이 유효하지 않을 경우 기본값 3 사용
const MONSTER_WIDTH = count * 98; // 적 캐릭터의 총 너비
const START_X = (canvas.width - MONSTER_WIDTH) / 2; // 적 캐릭터 시작 X 좌표 : 화면 정 중앙
const START_Y = 200;
  
  if (stage<=3){ // 스테이지 1~3 - 적 가로 배열
    for (let i = 0; i< count; i++){ // 적 캐릭터 수 만큼 반복하며 하나씩 생성
      const x = START_X + (i * 98);
      const y = START_Y;
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    } 
  }
  else if (stage > 3 && stage <=6) { // 스테이지 4~6 - 적 역 피라미드 배열
    const hang = 3;
    for (let i = 0; i < hang; i++){ // 적 캐릭터 수 만큼 반복하며 하나씩 생성
      const yeol = count - i; // 아래로 내려갈수록 각 행의 적 캐릭터 수(열) 감소
      const offsetX = (MONSTER_WIDTH - (yeol * 98)) / 2; // 각 행의 시작 X 좌표 오프셋 계산
      for(let j = 0; j < yeol; j++){
        const x = START_X + offsetX + (j * 98);
        const y = 20 + (i * 60);
        const enemy = new Enemy(x, y);
        enemy.img = enemyImg;
        gameObjects.push(enemy);
      }
    }
  }
  else if (stage == 7) { // 스테이지 7 - 보스전
    const x = (canvas.width - 300) / 2;
    const y = 0;
    const enemy = new Enemy(x, y);
    enemy.width = 300;
    enemy.height = 300;
    enemy.img = enemyUFOImg;
    enemy.boss = true; // 보스 플래그 설정
    enemy.stamina = 10; // 보스 체력 설정
    gameObjects.push(enemy);
  }
}

//플레이어 캐릭터 히어로 생성
function createHero() {
  // 메인 히어로
  hero = new Hero( 
    canvas.width / 2 - 45, // 화면 중앙 - 히어로 너비 보정
    canvas.height - canvas.height / 4 // 화면 하단 1/4 지점
  );
  hero.img = heroImg;
  gameObjects.push(hero); // 게임 오브젝트 배열에 히어로 추가
  
  // 미니 히어로 - 메인 왼쪽
  hero_mini = new Hero(
    canvas.width / 2 - 100,
    canvas.height - canvas.height / 4
  );
  hero_mini.img = heroImg;
  hero_mini.width = 50;
  hero_mini.height = 50;
  gameObjects.push(hero_mini);
  
  // 미니 히어로 - 메인 오른쪽
  hero_mini2 = new Hero(
    canvas.width / 2 + 60,
    canvas.height - canvas.height / 4
  );
  hero_mini2.img = heroImg;
  hero_mini2.width = 50;
  hero_mini2.height = 50;
  gameObjects.push(hero_mini2);
}

// 이벤트 리스너-------------------------------------------------------


// 키보드 이벤트 처리
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
    // default: // 아무 동작 없기 때문에 주석 처리
    // break;
} };

// 키 다운 이벤트 리스너
window.addEventListener('keydown', onKeyDown);

// 키 업 이벤트 리스너
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

// 메시지 정의
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
const MAX_STAGE = 7; // 마지막 스테이지 단계

// 게임 초기화 함수-------------------------------------------------------

// 게임 초기화 함수
function initGame() {
  gameObjects = [];
  currentStage = 1; // 처음 스테이지 단계
  createEnemies(currentStage); // 현재 스테이지 적 생성
  createHero();

  // 이벤트 리스너 - 히어로 움직임 처리
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

  // 이벤트 리스너 - 히어로 레이저 발사 처리
  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
    }
    if (!firingIntervals.mini) { // firingIntervals.mini가 설정되지 않으면 인터벌로 레이저 발사
      firingIntervals.mini = setInterval(() => {
        if (hero_mini.canFire && hero_mini.canFire()) hero_mini.fire();
      }, 500);
    }
    if (!firingIntervals.mini2) {
      firingIntervals.mini2 = setInterval(() => {
        if (hero_mini2.canFire && hero_mini2.canFire()) hero_mini2.fire();
      }, 500);
    }
  });
  eventEmitter.on(Messages.KEY_EVENT_Q, () => { // Q키 레이저 발사 처리
    if (hero.canFire()) {
      hero.fire_Q();
    }
  })

  // 이벤트 리스너 - 적-레이저 충돌 처리
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true; // 레이저 제거

    if (second.boss) { // 보스 적일 경우
      second.stamina -= 1; // 보스 체력 -1
      if (second.stamina > 0) {
        return; // 보스 체력 남아있으면 제거하지 않음
      }
      else if (second.stamina <= 0) {
        second.img = laserRedShotImg;
        setTimeout (() => { // 폭발 효과를 위한 딜레이
        second.dead = true; // 보스 체력 0 이하면 제거
        hero.incrementPoints(); // 점수 증가  
        if (isEnemiesDead()) { // 모든 적 제거 시 다음 스테이지
          nextStage();
        } 
        }, 200);
        return;
      }
    }

    else{
      second.img = laserRedShotImg;
      hero.incrementPoints(); // 점수 증가  
      setTimeout (() => { // 폭발 효과를 위한 딜레이
        second.dead = true;
        if (isEnemiesDead()) { // 모든 적 제거 시 다음 스테이지
          nextStage();
        } 
      }, 200);
    }
  });
 
  // 이벤트 리스너 - 적-레이저Q 충돌 처리
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER_Q, (_, { first, second }) => {
    
     if (second.boss) { // 보스 적일 경우
      first.dead = true; // 레이저 제거
      second.stamina -= 5; // 보스 체력 -1
      if (second.stamina > 0) {
        return; // 보스 체력 남아있으면 제거하지 않음
      }
      else if (second.stamina <= 0) {
        second.img = nebulaImg;
        setTimeout (() => { // 폭발 효과를 위한 딜레이
        second.dead = true; // 보스 체력 0 이하면 제거
        hero.incrementPoints(); // 점수 증가  
        if (isEnemiesDead()) { // 모든 적 제거 시 다음 스테이지
          nextStage();
        } 
        }, 200);
        return;
      }
    }
    
    else {
      second.img = nebulaImg;
      hero.incrementPoints(); // 점수 증가  
      setTimeout (() => { // 폭발 효과를 위한 딜레이
        second.dead = true;
        if (isEnemiesDead()) { // 모든 적 제거 시 다음 스테이지
        nextStage();
      }
      }, 200);
    }
  });

  // 이벤트 리스너 - 적-히어로 충돌 처리
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    enemy.dead = true; // 적 제거
    hero.decrementLife(); // 히어로 생명 -1
    if (isHeroDead()) { // 히어로 생명 0 되면 게임 패배
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return; // loss before victory
    }
    if (isEnemiesDead()) { // 모든 적 제거 시 다음 스테이지
      nextStage();
    } 
  });

  // 이벤트 리스너 - 엔터키로 게임 재시작 처리
  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
    resetGame();
  });
  
  // 이벤트 리스너 - 게임 승리 종료
  eventEmitter.on(Messages.GAME_END_WIN, () => {
    endGame(true); // 게임 승리 처리
  });
  
  // 이벤트 리스너 - 게임 패배 종료
  eventEmitter.on(Messages.GAME_END_LOSS, () => {
    endGame(false); // 게임 패배 처리
  });
}

// 간단한 이벤트 발신기 구현
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

// 충돌 감지 함수
function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  ); 
}

// UI 그리기 함수-------------------------------------------------------

// 히어로 생명 그리기
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

// 점수 및 스테이지 그리기
function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height-20);
  drawText("Stage: " + currentStage, 10, 30);
}

// 텍스트 그리기
function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

// 게임 상태 확인 및 전환 함수-------------------------------------------------------

// 미니 히어로 발사 인터벌 초기화
function resetMiniFire() {
  // 인터벌이 존재하면 모두 해제
  if (firingIntervals.mini) {
    clearInterval(firingIntervals.mini);
    firingIntervals.mini = null;
  }
  if (firingIntervals.mini2) {
    clearInterval(firingIntervals.mini2);
    firingIntervals.mini2 = null;
  }
}

// 히어로 위치 초기화
function resetHeroPositions() {
  if (!canvas) return;
  const baseY = canvas.height - (canvas.height / 4);
  if (hero) {
    hero.x = canvas.width / 2 - 45; // 화면 중앙 - 히어로 너비 보정
    hero.y = canvas.height - canvas.height / 4; // 화면 하단 1/4 지점
  }
  if (hero_mini) {
    hero_mini.x = canvas.width / 2 - 100;
    hero_mini.y = canvas.height - canvas.height / 4;
  }
  if (hero_mini2) {
    hero_mini2.x = canvas.width / 2 + 60;
    hero_mini2.y = canvas.height - canvas.height / 4
  }
}

// 다음 스테이지로 레벨업
function nextStage() {
  if (currentStage < MAX_STAGE) {
    currentStage++;
    resetHeroPositions();
    resetMiniFire();
    setTimeout(() => {
      gameObjects = gameObjects.filter(go => go.type !== 'Enemy' && go.type !== 'Laser' && go.type !== 'Laser_Q');
      createEnemies(currentStage); // 새로운 스테이지 적 생성
    }, 1500);
  } else { // 마지막 스테이지까지 완료
    eventEmitter.emit(Messages.GAME_END_WIN);
  }
}

// 히어로 사망 여부 확인
function isHeroDead() {
  return hero.life <= 0;
}

// 모든 적 사망 여부 확인
function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" &&!go.dead);
  return enemies.length === 0;
}

function displayMessage(message, color = "red", fontSize = "30px", yoffset = 0) {
  ctx.font = `${fontSize} Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2 + yoffset);
}

// 게임 종료 처리 함수
function endGame(win) {
  clearInterval(gameLoopId);
  gameLoopId = null;
  // 게임 화면이 겹칠 수 있으니, 200ms 지연 
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.5; // 투명도를 50%로 설정
    if (win) {
      ctx.drawImage(bgWinImg, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1; // 텍스트 쓰기 전 투명도 원래대로
      displayMessage("You Win!", "green", "50px", -30);
      displayMessage("If yor're happy... - Press [Eenter] to start new game","green");
    } 
    else {
      ctx.drawImage(bgLossImg, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1; // 텍스트 쓰기 전 투명도 원래대로
      displayMessage("You Lose!", "red", "50px", -30);
      displayMessage("Thank you for giving me the Earth! - Press [Enter] to try again"); 
    }
  }, 200) 
}

// 게임 재시작 처리 함수
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

// 게임 오브젝트 그리기
function drawGameObjects(ctx) {
  gameObjects.forEach(go => go.draw(ctx));
}

// 전역 변수 선언
let 
  heroImg,
  enemyImg,
  enemyUFOImg,
  laserImg,
  laserRedShotImg,
  laser_QImg,
  nebulaImg,
  lifeImg,
  bgWinImg,
  bgLossImg,
  canvas, ctx,
  gameObjects = [],
  hero, hero_mini, hero_mini2,
  eventEmitter = new EventEmitter(),
  gameLoopId=null,
  currentStage = 1;
