import Player from './Player.js';

var canvas = document.querySelector('#screen');
var ctx = canvas.getContext('2d');
var player = new Player('orange', 20, 30);

document.addEventListener('keydown', KeyBoardEvent);

function KeyBoardEvent(e) {
    if (player && player.isAlive) {
        const key = e.code;
        const moves = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];

        if (moves[moves.indexOf(key)]) {
            movePlayer({ keyPressed: key })
        }
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

        }
    }
    const move = execution[cmd.keyPressed];
    if (player && move) {
        move();
        updatePlayerAttributes();
    }
}


function updatePlayerAttributes(){
    player.moves++;
    console.log(player.moves);
}


function init() {
    animate();
}

function animate() {
    requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        animate();
    });

    //loop

}

function drawPlayer() {
    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, 1, 1);
    ctx.closePath();
}
init();

