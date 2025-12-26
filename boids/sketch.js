


class Boid {
  constructor(x, y, initVx = 0, initVy = 0) {
    this.px = x;
    this.py = y;
    this.vx = initVx;
    this.vy = initVy;
    this.maxSpeed = 4;

    // check if we need force limits
    this.Force = 0;
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

  repulsion (listofBoids) {
    for (let boid of listofBoids) {
      let dx = this.px - boid.px;
      let dy = this.py - boid.py;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100 && dist > 0) {
        
  }

}

let boids = [];
let boid1 = new Boid(200, 200, 1, 1);
boids.push(boid1);1
let boid2 = new Boid(300, 200, 1, 1);
boids.push(boid2);


function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);

  for (let boid of boids) {
    boid.update();
    boid.draw();
  }

}
