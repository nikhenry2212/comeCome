import Fruit from "./Fruit.js";
import Player from "./Player.js";

var canvas = document.querySelector("#screen");
var remainingMovesEle = document.querySelector("#remaninig_moves");
var pointsEle = document.querySelector("#points");
var generationEle = document.querySelector("#generation");
var genomeEle = document.querySelector("#genome");

var ctx = canvas.getContext("2d");
var player = new Player("orange", 20, 30);
var fruits = [];
var qtyFruits = 5;
var nearesFruit = null;
var limitMoves = 50;
var generation = 0;
var tAutoPlay = null;
var timeRepeatAutoPlay = 40;
var dataSetTraining = { i: [], o: [] };
var genome = null;

document.addEventListener("keydown", KeyBoardEvent);
document.querySelector("#startAutoPlay").addEventListener("click", startAutoPlay);
document.querySelector('#loadGenome').addEventListener('click', loadGenome);

function init() {
  animate();
  startGame();
}
function loadGenome(){
  let genomeString = document.querySelector('#genome').value;
  if(player.isAlive){
    let genome = JSON.parse(genomeString);
    Object.keys(genome).forEach((key)=>{
      player.brain[key] = genome[key];
    })
  }
}

function startAutoPlay() {
  tAutoPlay = setInterval(() => {
    autoMovePlayer();
    if(fruits.length === 0){
      addFruits();
      checkFruitsPositions();
    }
  }, timeRepeatAutoPlay);
}
function stopAutoPlay() {
  clearInterval(tAutoPlay);
}

function startGame() {
  fruits = [];
  addPlayer();
  generation++;
  addFruits();
  checkFruitsPositions();
}

function addPlayer() {
  const x = Math.floor(Math.random() * canvas.width);
  const y = Math.floor(Math.random() * canvas.height);
  player = new Player("orange", x, y);
  if(genome){
    player.brain = genome ;
  }
    genomeEle.innerHTML = JSON.stringify(player.brain);
    for(const index in dataSetTraining.i){
      player.brain.train(dataSetTraining.i[index], dataSetTraining.o[index]);
    }
  }

function addFruits() {
  for (let x = 0; x < qtyFruits; x++) {
    addFruit();
  }
}
function addFruit() {
  const x = Math.floor(Math.random() * canvas.width);
  const y = Math.floor(Math.random() * canvas.height);
  const fruit = new Fruit("green", x, y);
  fruits.push(fruit);
}
function checkFruitsPositions() {
  player.sensor.fruits = [];
  for (const f of fruits) {
    const fruit = { ...f };
    const { x: px, y: py } = player;
    const { x: fx, y: fy } = fruit;
    fruit["sensor"] = {};
    fruit["sensor"]["x"] = px - fx;
    fruit["sensor"]["y"] = py - fy;
    fruit["sensor"]["distance"] =
      Math.abs(fruit["sensor"]["x"]) + Math.abs(fruit["sensor"]["y"]);
    player.sensor.fruits.push(fruit);
  }
  nearesFruit = getNearestFruit();
}

function getNearestFruit() {
  const fruits = [...player.sensor.fruits];
  fruits.sort(sortFruitsByDistance);

  function sortFruitsByDistance(a, b) {
    return a.sensor.distance > b.sensor.distance
      ? 1
      : b.sensor.distance > a.sensor.distance
      ? -1
      : 0;
  }

  return fruits[0];
}

function KeyBoardEvent(e) {
  if (player && player.isAlive) {
    const key = e.code;
    const moves = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];

    if (moves[moves.indexOf(key)]) {
      movePlayer({ keyPressed: key });
    }
  }
}

function autoMovePlayer() {
  const moves = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
  if (player.isAlive && nearesFruit) {

    const inputNN = [nearesFruit.sensor.x, nearesFruit.sensor.y];
    const resultNN = player.brain.predict(inputNN);
    const resultNNIndexMax = resultNN.indexOf(Math.max(...resultNN));

    let outputNN = [];
    if (resultNNIndexMax === 0) {
      outputNN = [1, 0, 0, 0];
    } else if (resultNNIndexMax === 1) {
      outputNN = [0, 1, 0, 0];
    } else if (resultNNIndexMax === 2) {
      outputNN = [0, 0, 1, 0];
    } else if (resultNNIndexMax === 3) {
      outputNN = [0, 0, 0, 1];
    }

    movePlayer({ keyPressed: moves[resultNNIndexMax] });
    player.dataset.i.push(inputNN);
    player.dataset.o.push(outputNN);
  }
}
function movePlayer(cmd) {
  const execution = {
    ArrowUp() {
      if (player.y - 1 >= 0) {
        player.y -= 1;
      }
    },
    ArrowDown() {
      if (player.y + 1 < canvas.height) {
        player.y += 1;
      }
    },
    ArrowLeft() {
      if (player.x - 1 >= 0) {
        player.x -= 1;
      }
    },
    ArrowRight() {
      if (player.x + 1 < canvas.width) {
        player.x += 1;
      }
    },
  };
  const move = execution[cmd.keyPressed];
  if (player && move) {
    move();
    checkCollisionFruit();
    updatePlayerAttributes();
    checkIsPlayerAlive();
  }
}

function updatePlayerAttributes() {
  player.moves++;
  checkFruitsPositions();
}

function checkCollisionFruit() {
  for (const fruit of fruits) {
    if (fruit.x === player.x && fruit.y === player.y) {
      player.hitFruits++;
      player.moves = -1;
      removeFruit(fruit);
    }
  }
}

function checkIsPlayerAlive() {
  if (player.moves >= limitMoves) {
    player.isAlive = false;
    genome = player.brain;
    // console.log("Morreu!");
  }
}

function removeFruit(fruit) {
  let index = null;
  for (const i in fruits) {
    let f = fruits[i];
    if (fruit.id === f.id) {
      index = i;
    }
  }
  fruits.splice(index, 1);
}

function gameHasFinished() {
  if (!player.isAlive) {
    dataSetTraining = { i: [], o: [] };
    const inputsRepeat = [];
    for (const x in player.dataset.i) {
      const dx = player.dataset.i[x][0];
      const moveX = dx < 0 ? [0, 1, 0, 0] : [0, 0, 0, 1];
      const dy = player.dataset.i[x][1];
      const moveY = dy < 0 ? [0, 0, 1, 0] : [1, 0, 0, 0];

      const valuesXYabs = [Math.abs(dx), Math.abs(dy)];
      const maxIndex = valuesXYabs.indexOf(Math.max(...valuesXYabs));
      const outputs = [moveX, moveY];

      if (inputsRepeat.indexOf(player.dataset.i[x].join(",")) === -1) {
        inputsRepeat.push(player.dataset.i[x].join(","));
        dataSetTraining.i.push(player.dataset.i[x]);
        dataSetTraining.o.push(outputs[maxIndex]);
      }
    }
    startGame();
    //console.log(dataSetTraining);
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, 1, 1);
  ctx.closePath();
}

function drawFruits() {
  ctx.beginPath();
  for (const f of fruits) {
    ctx.fillStyle = f.color;

    if (nearesFruit && nearesFruit.id === f.id) {
      ctx.fillStyle = "lightblue";
    }

    ctx.fillRect(f.x, f.y, 1, 1);
  }
  ctx.closePath();
}

function animate() {
  requestAnimationFrame(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawFruits();
    gameHasFinished();

    pointsEle.innerText = player.hitFruits;
    remainingMovesEle.innerText = limitMoves - player.moves;
    generationEle.innerText = generation;

    if(fruits.length === 0){
      addFruit();
    }

    animate();
  });
}
init();


//{"i_nodes":2,"h_nodes":4,"o_nodes":4,"bias_ih":{"rows":4,"cols":1,"data":[[-0.03440699886122763],[-0.3419901622153619],[-0.0077575087538645955],[-0.18616312729499368]]},"bias_ho":{"rows":4,"cols":1,"data":[[-1.360365112890226],[-1.5271821868000632],[0.01589002425929718],[0.5051547799375831]]},"weights_ih":{"rows":4,"cols":2,"data":[[-1.5401085287332326,-2.177991661998741],[-1.5352512517384127,1.4097248396751425],[-1.360805961661081,1.4161119684132837],[1.4521467589014547,1.9238570682793936]]},"weights_ho":{"rows":4,"cols":4,"data":[[-1.3756523534472906,-0.010466989564548904,1.1738807663681838,0.13112298035588327],[0.5299362195465603,1.2089334851045694,1.2430832282551558,-1.782352609123518],[0.49748843329534753,-1.716112408661672,-0.7130042156688068,-1.7683363790188522],[-2.151239661431231,-1.7100497730071769,-0.8442240301290933,0.7168833897628567]]},"learning_rate":0.25}