


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
    this.alidecay = 0.3; // constant for alignment angle decay

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
    this.vx += cos(this.frads) * this.Force / this.mass;
    this.vy += sin(this.frads) * this.Force / this.mass;

    // add speed limit

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
      if (boid !== this) {
        let dx = this.px - boid.px;
        let dy = this.py - boid.py;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100 && dist > 0) {
          let angle = Math.atan2(dy, dx);
          let fapplied = 5 / (dist * dist);

          let fx = Math.cos(angle) * fapplied;
          let fy = Math.sin(angle) * fapplied;

          let initfx = Math.cos(this.frads) * this.Force;
          let initfy = Math.sin(this.frads) * this.Force;
          let totalfx = initfx + fx;
          let totalfy = initfy + fy;
        
          // vector addition
          this.Force = Math.sqrt(totalfx*totalfx + totalfy*totalfy);
          this.frads = Math.atan2(totalfy, totalfx);
        }
      }
    }
  }

  alignment (listofBoids) {
    let totalangle = 0;
    let count = 0;
    for (let boid of listofBoids) {
      if (boid !== this) {
        totalangle += boid.orientation;
        count += 1;
      }  
    }
    let aveangle = totalangle / count;
    this.orientation = 1/(aveangle - this.orientation) * aveangle * this.alidecay + this.orientation;

  }

  cohesion (listofBoids) {
    // to be implemented
  }

}

let boids = [];
let boid1 = new Boid(200, 200, 0, 1);
boids.push(boid1);
let boid2 = new Boid(300, 200, 0, 1);
boids.push(boid2);
let boid3 = new Boid(250, 200, 0, 1);
boids.push(boid3);

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);

  for (let boid of boids) {
    boid.Force = 0;
    boid.alignment(boids);  
    boid.repulsion(boids);
    boid.update();
    boid.draw();
  }

}
