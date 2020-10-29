export default class Player{
    constructor(color, x,y){
        this.x = (x) ? x : 0;
        this.y = (y) ? y : 0;
        this.color = (color) ? color : 'red';
        this.hitFruits = 0;
        this.isAlive = true;
        this.moves = 0;
    }
}