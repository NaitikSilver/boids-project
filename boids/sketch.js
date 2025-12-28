
let alidecay = 0.03; // constant for alignment angle decay
let LENGTH = 600;
let WIDTH = 600;

class Boid {
  constructor(x, y, initSpeed = 0, initOrientation = 0) {
    this.px = x;
    this.py = y;
    this.maxSpeed = 4;

    this.vel = initSpeed;
    this.orientation = initOrientation; // in radians

    this.Force = 0;
    this.frads = 0;  // direction of force application
    this.maxFapplied = 5;

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

    if (!isFinite(this.orientation)) this.orientation = 0;

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

  boundries () {
    if (this.px < 0) this.px = LENGTH;
    if (this.px > LENGTH) this.px = 0;
    if (this.py < 0) this.py = WIDTH;
    if (this.py > WIDTH) this.py = 0;
  }

  repulsion (listofBoids) {
    for (let boid of listofBoids) {
      if (boid !== this) {
        let dx = this.px - boid.px;
        let dy = this.py - boid.py;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100 && dist > 0) {
          let angle = Math.atan2(dy, dx);
          const MIN_DIST = 5;
          const d = Math.max(dist, MIN_DIST);
          let fapplied = 5 / (d);
          if (fapplied > this.maxFapplied) {
            fapplied = this.maxFapplied;
          }

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
    // Safe averaging of angles using unit-vector sum
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let boid of listofBoids) {
      if (boid !== this) {
        sumX += Math.cos(boid.orientation);
        sumY += Math.sin(boid.orientation);
        count += 1;
      }
    }
    if (count === 0) return;
    const aveAngle = Math.atan2(sumY, sumX);
    // shortest angular difference
    let diff = aveAngle - this.orientation;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    // interpolate by alidecay (treated as 0..1 strength)
    const alpha = Math.max(0, Math.min(1, alidecay));
    this.orientation += diff * alpha;

  }

  cohesion (listofBoids) {
    // to be implemented


  }

}

let boids = [];
let boid1 = new Boid(200, 100, 2, (Math.PI/2) - 1);
boids.push(boid1);  
let boid2 = new Boid(300, 200, 1, (Math.PI/2) + 2);
boids.push(boid2);  
let boid3 = new Boid(250, 100, 2, Math.PI/2);
boids.push(boid3);
let boid4 = new Boid(400, 300, 2, 0);
boids.push(boid4);
let boid5 = new Boid(500, 400, 0, Math.PI);
boids.push(boid5);

function setup() {
  createCanvas(LENGTH, WIDTH);
}

function draw() {
  background(0);

  for (let boid of boids) {
    boid.Force = 0;
    boid.alignment(boids);  
    boid.repulsion(boids);
    boid.update();
    boid.boundries();
    boid.draw();
  }

}
