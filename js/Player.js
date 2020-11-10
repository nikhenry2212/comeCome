import NeuralNetwork from "../ia/NeuralNetwork.js";
export default class Player {
  constructor(color, x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.color = color ? color : "red";
    this.hitFruits = 0;
    this.isAlive = true;
    this.moves = 0;
    this.sensor = {
      fruits: [],
    };
    this.dataset = { i: [], o: [] };
    this.brain = new NeuralNetwork(2, 4, 4);

    //         [1,0,0,0]
    //         [0,1,0,0]
    //         [0,0,1,0]
    //         [0,0,0,1]
    //
  }
}
