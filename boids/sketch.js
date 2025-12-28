
let alidecay = 0.3; // constant for alignment angle decay


class Boid {
  constructor(x, y, initSpeed = 0, initOrientation = 0) {
    this.px = x;
    this.py = y;
    this.maxSpeed = 4;

    this.vel = initSpeed;
    this.orientation = initOrientation; // in radians

    // check if we need force limits
    this.Force = 0;
    this.frads = 0;  // direction of force application

    this.mass = 1;

    this.sizex = 27;
    this.sizey = 9;


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

    let vx = Math.cos(this.orientation) * this.vel;
    let vy = Math.sin(this.orientation) * this.vel;

    // Update velocity
    vx += Math.cos(this.frads) * this.Force / this.mass;
    vy += Math.sin(this.frads) * this.Force / this.mass;
    // add speed limit

    // Update orientation to face direction of travel (radians)
    if (vx !== 0 || vy !== 0) {
      this.orientation = Math.atan2(vy, vx);
    }

      // Calculate and clamp speed
    this.vel = Math.sqrt(vx*vx + vy*vy);
    if (this.vel > this.maxSpeed) {
      this.vel = this.maxSpeed;
      // Renormalize velocity to match clamped speed
      vx = Math.cos(this.orientation) * this.vel;
      vy = Math.sin(this.orientation) * this.vel;
    }

    // Update position
    this.px += vx;
    this.py += vy;

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
    this.orientation = 1/(aveangle - this.orientation) * aveangle * alidecay + this.orientation;

  }

  cohesion (listofBoids) {
    // to be implemented
  }

}

let boids = [];
let boid1 = new Boid(200, 200, 1, -Math.PI/2);
boids.push(boid1);
let boid2 = new Boid(300, 200, 1, -Math.PI/2);
boids.push(boid2);
let boid3 = new Boid(250, 200, 1, -Math.PI/2);
boids.push(boid3);

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);

  for (let boid of boids) {
    boid.Force = 0;
    //boid.alignment(boids);  
    boid.repulsion(boids);
    boid.update();
    boid.draw();
  }

}
