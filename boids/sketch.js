


class Boid {
  constructor(x, y) {
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.maxSpeed = 4;
    this.maxForce = 0.1;

    this.sizex = 10;
    this.sizey = 20;

  }

  draw() {
    fill(255);
    quad(50, 62, 86, 50, 50, 38, 14, 50);
  }
}

let boids = [];
let boid1 = new Boid(50, 50);



function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);

  boid1.draw();

}
