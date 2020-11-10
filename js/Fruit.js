export default class Fruit{
  constructor(color, x, y){
    this.id='fruit_'+Math.random();
    this.x = (x) ? x : 0;
    this.y = (y) ? y : 0;
    this.color = color;
  }
}