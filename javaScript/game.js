const scoreValue = document.querySelector('.score-value');
const levelValue = document.querySelector('.level-value');
const winMessage = document.querySelector('.winner');
const loseMessage = document.querySelector('.loser');
const son = document.querySelector('.son');
const audio = document.getElementById('myAudio');
const timeValue = document.querySelector('.remaining-time');
const startBtns = document.querySelectorAll('.start-button'); 
const gameBeginMessage = document.getElementById('gameBegin'); 
const countdown = document.getElementById('countdown');
const gameControl = document.querySelector('.game-control'); 
const gameArea = document.querySelector('.game-area');
const soulElements = document.querySelectorAll('.remaining-souls img'); 
const resultat = document.getElementById('resultat');
const startScreen = document.querySelector('.start');
const startBubblingBtn = document.getElementById('start-bubbling'); 
const noBtns = document.querySelectorAll('.no-button');
const explosionSound = new Audio('../audio/explosion.mp3');
const winSound = new Audio('../audio/winaudio.mp3');
const loseSound = new Audio('../audio/game-over-audio.mp3');
const pauseBtn = document.querySelector('.pause-button');
const playBtn = document.querySelector('.play-button');
const fishs = document.querySelector('.fish');

let isPaused = false;
let gameRunning = false;
let noPop = 0;
let level = 1;
let time = 0;
let bubbleInterval;
let remainingTime = 60; 
let soulCount = 3;
let countTimer;
let currentDifficulty = 0; 

const levelSettings = {
    0: { 
        time: 60,           
        spawnRate: 1000,    
        bubbleSpeedMod: 1,
        probs: { normal: 0.70, red: 0.80, jelly: 0.95 } 
    },
    1: { 
        time: 45,           
        spawnRate: 800,     
        bubbleSpeedMod: 5,
        probs: { normal: 0.50, red: 0.85, jelly: 0.95 }
    },
    2: { 
        time: 30,           
        spawnRate: 600,     
        bubbleSpeedMod: 10, 
        probs: { normal: 0.40, red: 0.80, jelly: 0.95 }
    }
};

let easyBtn = document.querySelector('.easy-level-button');
let mediumBtn = document.querySelector('.medium-level-button');
let hardBtn = document.querySelector('.hard-level-button');

if (startBubblingBtn) {
  startBubblingBtn.addEventListener('click', () => {
    if (startScreen) startScreen.style.display = 'none';
    startMessage();
  });
}

if (noBtns.length > 0) {
  noBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (winMessage) winMessage.style.display = 'none';
      if (loseMessage) loseMessage.style.display = 'none';
      if (startScreen) startScreen.style.display = 'block';
    });
  });
}

if (son) {
  son.classList.add('muted'); 
}
if (audio) {
  audio.muted = true; 
}
if (son && audio) { 
  son.addEventListener('click', () => {
    son.classList.toggle('muted'); 
    if (audio.muted) {
      audio.muted = false;  
    } else {
      audio.muted = true;  
    }
  });
}

if (startBtns.length > 0) {
  startBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      startMessage();
    });
  });
}

if (easyBtn) easyBtn.addEventListener('click', () => {
    currentDifficulty = 0;
    startMessage();
});

if (mediumBtn) mediumBtn.addEventListener('click', () => {
    currentDifficulty = 1;
    startMessage();
});

if (hardBtn) hardBtn.addEventListener('click', () => {
    currentDifficulty = 2;
    startMessage();
});

function startMessage() {
  if (countTimer) clearInterval(countTimer); 
  if (bubbleInterval) clearInterval(bubbleInterval);
  removeBubbles(); 

  if (startScreen) startScreen.style.display = 'none';
  if (gameControl) gameControl.style.display = 'none';
  if (winMessage) winMessage.style.display = 'none';
  if (loseMessage) loseMessage.style.display = 'none';
  
  isPaused = false; 
  if (pauseBtn) pauseBtn.style.display = 'flex';
  if (playBtn) playBtn.style.display = 'none';  
  if (fishs) fishs.style.display = 'flex';

  soulCount = 3; 
  soulElements.forEach(soul => {
      soul.style.opacity = '1'; 
  });

  gameRunning = true;
  noPop = 0;
  level = 1;
  time = 0;
  remainingTime = levelSettings[currentDifficulty].time; 
  
  if (son) {
    son.classList.remove('muted'); 
    son.style.display = 'block';
  }
  if (audio) {
    audio.muted = false;
    audio.play().catch(e => console.log(e));          
  }
  if (scoreValue) scoreValue.innerHTML = noPop;
  if (levelValue) levelValue.innerHTML = level;

  updateTimeDisplay();

  if (gameBeginMessage) gameBeginMessage.style.display = 'block'; 
  
  let count = 3; 
  if (countdown) countdown.innerText = count; 

  countTimer = setInterval(() => {
    count--; 
    
    if (count > 0) {
      if (countdown) countdown.innerText = count;
    } else {
      clearInterval(countTimer);               
      
      if (gameBeginMessage) gameBeginMessage.style.display = 'none'; 
      if (gameControl) gameControl.style.display = 'block'; 
      
      startGame(); 
    }
  }, 1000); 
}

function startGame() {
  const settings = levelSettings[currentDifficulty];
  
  bubbleInterval = setInterval(() => {
    let timeLeft = remainingTime - time;

    if (timeLeft <= 0) {
      if (timeValue) timeValue.innerText = "0:00";
      endGame('win'); 
      return; 
    }

    if (!gameRunning) {
      endGame('lose');
      return;
    }
    
    let chance = Math.random(); 

    if (chance < settings.probs.normal) {
        createBubble();
    } 
    else if (chance < settings.probs.red) {
        createRedBubble();
    }
    else if (chance < settings.probs.jelly) {
        createJellyfish();
    } 
    else {
        createCompass();
    }

    time++;
    updateTimeDisplay();

  }, settings.spawnRate); 
}

function createBubble() {
  if (!gameRunning) return;

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  const rect = gameArea.getBoundingClientRect();
  let randX = Math.floor(Math.random() * (rect.width - 50));
  bubble.style.left = randX + 'px';
  bubble.style.top = rect.height + 'px'; 

  bubble.addEventListener('click', (e) => {
      e.stopPropagation(); 
  
      if (!gameRunning || isPaused) return; 

      bubble.remove();       
      updateScore('normal'); 
  });

  gameArea.appendChild(bubble);
  animateBubble(bubble, rect);
}

function createRedBubble() {
    if (!gameRunning) return;

    const redBubble = document.createElement('div');
    redBubble.classList.add('bubble', 'red-bubble'); 
    
    const rect = gameArea.getBoundingClientRect();
    let randX = Math.floor(Math.random() * (rect.width - 50));
    redBubble.style.left = randX + 'px';
    redBubble.style.top = rect.height + 'px';

    redBubble.addEventListener('click', (e) => {
        e.stopPropagation();         if (!gameRunning || isPaused) return;

        if (audio && !audio.muted) {
            explosionSound.currentTime = 0;
            explosionSound.play().catch(e => console.log(e));
        }

        redBubble.remove();    
        updateScore('red');    
    });

    gameArea.appendChild(redBubble);
    animateBubble(redBubble, rect);
}

function createCompass() {
  if (!gameRunning) return;

  const compass = document.createElement('img');
  compass.src = '../pictures/compass1.png'; 
  compass.alt = 'compass';
  compass.classList.add('compass-img', 'compass');

  const rect = gameArea.getBoundingClientRect();
  let randX = Math.floor(Math.random() * (rect.width - 50)); 
  compass.style.left = randX + 'px';
  compass.style.top = rect.height + 'px'; 

  compass.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!gameRunning || isPaused) return;

      const compassRect = compass.getBoundingClientRect();
      const areaRect = gameArea.getBoundingClientRect();
      
      const leftPos = compassRect.left - areaRect.left;
      const topPos = compassRect.top - areaRect.top;

      compass.remove(); 
      remainingTime += 5;  
      updateTimeDisplay(); 

      const bonus = document.createElement('div');
      bonus.innerText = "+5s";
      bonus.classList.add('bonus-text');

      bonus.style.left = leftPos + 'px';
      bonus.style.top = topPos + 'px';
      
      gameArea.appendChild(bonus);
      setTimeout(() => {
          bonus.remove();
      }, 1000);
  });

  gameArea.appendChild(compass);
  animateBubble(compass, rect);
}

function createJellyfish() {
  if (!gameRunning) return;

  const jellyfish = document.createElement('img');
  jellyfish.src = '../pictures/jellyfish2.png'; 
  jellyfish.alt = 'jelly-fish';
  jellyfish.classList.add('jelly-fish');

  const rect = gameArea.getBoundingClientRect();
  let randX = Math.floor(Math.random() * (rect.width - 50)); 
  jellyfish.style.left = randX + 'px';
  jellyfish.style.top = rect.height + 'px'; 

  jellyfish.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!gameRunning || isPaused) return;

      jellyfish.classList.add('jelly-hit'); 
      updateScore('jellyfish'); 

      setTimeout(() => {
          jellyfish.remove();      
      }, 400);
  });

  gameArea.appendChild(jellyfish);
  animateBubble(jellyfish, rect);
}

function animateBubble(elem, rect) {
    let position = 0;
    const speedMod = levelSettings[currentDifficulty].bubbleSpeedMod;
    let currentScore = (typeof noPop !== 'undefined') ? noPop : 0;
    let random = Math.floor(Math.random() * 6 - 3); 
    let speed = 20 - Math.floor(currentScore / 10) + random - speedMod; 
    if (speed < 2) speed = 2; 

    let interval = setInterval(frame, speed);

    function frame() {
        if (isPaused) {
            return; 
        }
        if (!document.body.contains(elem)) {
            clearInterval(interval);
            return;
        }

        position++; 
        elem.style.top = (rect.height-position) + 'px';

        if (position >= rect.height + 50) {
            clearInterval(interval);
            elem.remove(); 
        } 
    }
}

function updateScore(type) {
  if (!gameRunning) return;

  if (type === 'normal') {
      noPop++; 
  } else if (type === 'red') {
      noPop -= 2;
  }
  else if (type === 'jellyfish') {
      removesoul();
  }

  if (noPop < 0) {
      endGame('lose');
      return; 
  }

  const newLevel = Math.floor(noPop / 5) + 1;
  if (newLevel !== level) {
      level = newLevel;
  }

  scoreValue.innerHTML = noPop;
  levelValue.innerHTML = level;
}

function removesoul() {
   if (soulCount <= 0) return; 

   soulCount--; 
   if (soulElements[soulCount]) {
       soulElements[soulCount].style.opacity = '0'; 
   }

   if (soulCount === 0) {
       endGame('lose');
   }
}

function removeBubbles() {
    const allBubbles = document.querySelectorAll('.bubble, .compass, .jelly-fish');
    allBubbles.forEach(b => b.remove());
}

function endGame(type) {
  gameRunning = false;

  let soundWasOn = false;
  if (audio && !audio.muted) {
      soundWasOn = true;
  }

  if (son) {
    son.style.display = 'none';
    son.classList.add('muted'); 
  }
  if (audio) {
    audio.muted = true; 
  }

  if (gameControl) gameControl.style.display = 'none';
  if (bubbleInterval) clearInterval(bubbleInterval);
  removeBubbles();

  if (type === 'lose') {
    if (loseMessage) loseMessage.style.display = 'block';

    if (soundWasOn && typeof loseSound !== 'undefined') {
        loseSound.currentTime = 0; 
        loseSound.play().catch(e => console.log(e));
    }

  } else if (type === 'win') {
    if (winMessage) winMessage.style.display = 'block';
    if (typeof resultat !== 'undefined' && resultat) {
        resultat.innerText = noPop;
    }
    if (soundWasOn && typeof winSound !== 'undefined') {
        winSound.currentTime = 0; 
        winSound.play().catch(e => console.log(e));
    }
  }

  scoreValue.innerHTML = noPop;
  levelValue.innerHTML = level;
}

function updateTimeDisplay() {
    let timeLeft = remainingTime - time;
    if (timeLeft < 0) timeLeft = 0;

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    
    if (timeValue) {
        timeValue.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    isPaused = true; 
    clearInterval(bubbleInterval); 
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'flex';
    if (fishs) fishs.style.display = 'none';
    if (audio) audio.pause();
  });
}

if (playBtn) {
  playBtn.addEventListener('click', () => {
    isPaused = false;
    startGame(); 
    pauseBtn.style.display = 'flex';
    playBtn.style.display = 'none';
    if (fishs) fishs.style.display = 'flex';
    if (audio && !audio.muted) audio.play().catch(e => console.log(e));
  });
}