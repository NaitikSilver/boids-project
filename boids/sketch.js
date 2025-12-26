


class Boid {
  constructor(x, y) {
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.maxSpeed = 4;

    // check if we need force limits
    this.Force = 0.1;
    this.frads = 0;  // direction of force application


    this.mass = 1;

    this.sizex = 27;
    this.sizey = 9;

    this.orientation = 0; // in radians


  }

  draw() {

    push();
    translate(this.px, this.py);
    rotate(this.orientation);
    fill(255);
    quad(0, this.sizey,
      this.sizex, 0,
      0, -this.sizey,
      -this.sizex, 0);
    pop();
  }

  update () {
    // Update velocity
    this.vx += cos(-1*this.frads) * this.Force;
    this.vy += sin(-1*this.frads) * this.Force;

    // see if speed limit is needed

    // Update position
    this.px += this.vx;
    this.py += this.vy;
    // Update orientation to face direction of travel (radians)
    if (this.vx !== 0 || this.vy !== 0) {
      this.orientation = Math.atan2(this.vy, this.vx);
    }
  }
}

let boids = [];
let boid1 = new Boid(100, 100);



function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);

  boid1.update();
  boid1.draw();

}
