let bubbles=[];
let gameArea = document.querySelector('.game-area');
let rect = gameArea.getBoundingClientRect();
console.log(rect.width);
console.log(rect.height);
let score=document.querySelector('.score-value');
let levl=document.querySelector('.level-value');
let noPop=0;
let total=15;
let currentBubble=0;
let gameOver=false;
let gameBegin=false;
let winMessage=document.querySelector('.winner');
let loseMessage=document.querySelector('.loser');
let startBtn =document.querySelector('.start-button');
let restartBtn=document.querySelector('.restart-button');

function createBubble() {
    let div = document.createElement('div');
    div.className = 'bubble';
    let randX = Math.floor(Math.random() * (rect.width - 50));
    div.style.left = randX + 'px';
    div.dataset.number=currentBubble;
    currentBubble++;
    gameArea.appendChild(div);
    bubbles.push(div);    
    animateBubble(div);
}

function animateBubble(elem) {
    let position = 0;
    let random = Math.floor(Math.random() * 6 - 3); 
    
    let interval = setInterval(frame,12-Math.floor(noPop/10)+random);

    function frame() {
        if (position >= (rect.height + 50) &&(document.querySelector('[data-number="'+elem.dataset.number+'"]') !== null)) {
            clearInterval(interval);
            gameOver=true;

            elem.remove(); 
          
        } else {

            position++; 
            elem.style.top = (rect.height - position) + 'px';
        }
    }
}


function startGame(){
  restartGame();
  let timeout=0;
  let loop=setInterval(function(){
    timeout=Math.floor(Math.random()*600-100);
    if(!gameOver && noPop !==total){
      createBubble();

    }
    else if(noPop !==total){
      clearInterval(loop);
      ShadowRoot.style.display='flex';
      loseMessage.style.display='block';
    }
    else{
      clearInterval(loop);
      ShadowRoot.style.display='flex';
      winMessage.style.display='block';
    }
  }
  ,800+timeout);
}
function restartGame(){
  let forRemoving=document.querySelectorAll('.bubble');
  for(let i=0;i<forRemoving.length;i++){
    forRemoving[i].remove();
  }
  gameOver=false;
  noPop=0;
  scoreUpdate();
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('bubble')) {
    deleteBubble(event.target);
  }
});
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('redbubble')) {
    deleteBubble(event.target);
  }
});

function deleteBubble(elem,type){
  if(type=true){
    elem.remove(); 
    noPop=noPop-5; 
    scoreUpdate();

  }
  if(type=false){
    elem.remove(); 
    noPop++; 
    scoreUpdate();
  }
}
function scoreUpdate(){
  score.textContent = noPop;
    if (noPop === 3) {
        let currentLvl = parseInt(levl.textContent);
        levl.textContent = currentLvl + 1;
      
    }
}
const son = document.querySelector('.son');
const audio = document.getElementById('myAudio');
son.addEventListener('click', () => {
  son.classList.toggle('muted');
  if (audio.muted) {
    audio.muted = false;  
  } else {
    audio.muted = true;  
  }
});
