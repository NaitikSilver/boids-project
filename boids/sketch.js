
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

    this.sizex = 27;
    this.sizey = 9;

  }

  // basic draw function
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

  update() {
 
  if (this.vel > this.maxSpeed) {
      this.vel = this.maxSpeed;
    }
    

    this.px += Math.cos(this.orientation) * this.vel;
    this.py += Math.sin(this.orientation) * this.vel;
  }

  boundries () {
    if (this.px < 0) this.px = LENGTH;
    if (this.px > LENGTH) this.px = 0;
    if (this.py < 0) this.py = WIDTH;
    if (this.py > WIDTH) this.py = 0;
  }

  toroidalDist(other) {
    let dx = this.px - other.px;
    let dy = this.py - other.py;
    
    if (dx > LENGTH / 2) dx -= LENGTH;
    if (dx < -LENGTH / 2) dx += LENGTH;
    if (dy > WIDTH / 2) dy -= WIDTH;
    if (dy < -WIDTH / 2) dy += WIDTH;
    
    return { dx, dy, dist: Math.sqrt(dx*dx + dy*dy) };
  }

  repulsion(listofBoids) {
    let rx = 0;
    let ry = 0;
    
    for (let boid of listofBoids) {
      if (boid !== this) {
        let {dx, dy, dist} = this.toroidalDist(boid);
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

      this.orientation += diff * repdecay;  
    }
  }

  alignment (listofBoids) {

    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let boid of listofBoids) {
      if (boid !== this) {
        let {dx, dy, dist} = this.toroidalDist(boid);
        if (dist < 150 && dist > 0) {
          sumX += Math.cos(boid.orientation);
          sumY += Math.sin(boid.orientation);
          count += 1;
        }
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

  cohesion(listofBoids) {
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let boid of listofBoids) {
    if (boid !== this) {
      let {dx, dy, dist} = this.toroidalDist(boid);
      if (dist < 150 && dist > 0) {

        sumX += this.px - dx;  
        sumY += this.py - dy;
        count += 1;
      }
    }
  }
  if (count === 0) return;
  const aveX = sumX / count;
  const aveY = sumY / count;
  

  let dx = aveX - this.px;
  let dy = aveY - this.py;
  

  if (dx > LENGTH / 2) dx -= LENGTH;
  if (dx < -LENGTH / 2) dx += LENGTH;
  if (dy > WIDTH / 2) dy -= WIDTH;
  if (dy < -WIDTH / 2) dy += WIDTH;
  
  let angleToCenter = Math.atan2(dy, dx);
  let diff = angleToCenter - this.orientation;
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
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
