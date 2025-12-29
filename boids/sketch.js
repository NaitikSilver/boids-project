
let alidecay = 0.05; // constant for alignment angle decay
let cohdecay = 0.04; // constant for cohesion angle decay
let repforce = 1; // constant for repulsion force scaling
let repdecay = 0.04; // constant for repulsion angle decay
let maxRapplied = 5; // max repulsion applied

let boidCount = 20;

let LENGTH = 600;
let WIDTH = 600;

class Boid {  
  constructor(x, y, initSpeed = 0, initOrientation = 0) {
    this.px = x;
    this.py = y;
    this.maxSpeed = 4;

    this.vel = initSpeed;
    this.orientation = initOrientation; // in radians

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


    // Update orientation to face direction of travel (radians)
    if (vx !== 0 || vy !== 0) {
      this.orientation = Math.atan2(vy, vx);
    }

    if (!isFinite(this.orientation)) this.orientation = Math.PI;

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

  repulsion(listofBoids) {
    let rx = 0;
    let ry = 0;
    
    for (let boid of listofBoids) {
      if (boid !== this) {
        let dx = this.px - boid.px;
        let dy = this.py - boid.py;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100 && dist > 0) {
          const MIN_DIST = 5;
          const d = Math.max(dist, MIN_DIST);
          let strength = repforce / (d * d);
          if (strength > maxRapplied) {
            strength = maxRapplied;
          }
          
          // Accumulate repulsion direction
          rx += (dx / dist) * strength;
          ry += (dy / dist) * strength;

        }
      }
    }
    
    // Apply accumulated repulsion to orientation
    if (rx !== 0 || ry !== 0) {
      let repulsionAngle = Math.atan2(ry, rx);

      // shortest angular difference
      let diff = repulsionAngle - this.orientation;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));

      this.orientation += diff * repdecay;  // Turn toward repulsion direction
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
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let boid of listofBoids) {
      if (boid !== this) {
        sumX += boid.px;
        sumY += boid.py;
        count += 1;
      }
    }
    if (count === 0) return;
    const aveX = sumX / count;
    const aveY = sumY / count;
    
    let dx = aveX - this.px;
    let dy = aveY - this.py;
    let angleToCenter = Math.atan2(dy, dx);

    // shortest angular difference
    let diff = angleToCenter - this.orientation;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));

    // interpolate by cohdecay (treated as 0..1 strength)
    const alpha = Math.max(0, Math.min(1, cohdecay));
    this.orientation += diff * alpha;

  }

}

let boids = [];

for (let i = 0; i < boidCount; i++) {
  boids.push(new Boid(Math.random() * LENGTH, 
  Math.random() * WIDTH, Math.random() * 2 + 1, Math.random() * 2 * Math.PI));
}


function setup() {
  createCanvas(LENGTH, WIDTH);
}

function draw() {
  background(0);

  for (let boid of boids) {
    boid.cohesion(boids);  
    boid.alignment(boids);
    boid.repulsion(boids);
    boid.update();
    boid.boundries();
    boid.draw();
  }

}
