/*
Imports
*/

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

/*
Variables
*/

let physics;

let particles = [];
let springs = [];
let gravity;

let selectedPoints = [];
let cursorPoint;

let materials;
let level_data;

/*
preload
*/

function preload(){
  materials = loadJSON("./materials.json")
  level_data = loadJSON("./levels.json")
}

/*
setup
*/

function setup() {
  createCanvas(WIDTH, HEIGHT);
  level_data = level_data.level_1;

  physics = new VerletPhysics2D();
  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  gravity = new GravityBehavior(new Vec2D(level_data.gravity_x, level_data.gravity_y));

  ({ particles, springs } = createParticlesAndSprings(level_data.tablier.subdivision, level_data.tablier.start_x, level_data.tablier.end_x, level_data.tablier.start_y, level_data.tablier.end_y, materials.road.stiffness, materials.road.max_compression, materials.road.max_extension, level_data.tablier.mass_points_weigth));

  particles[0].lock();
  particles[particles.length - 1].lock();
  for (let i = 0; i < level_data.tablier.intial_fixed_points.length; i++){
    particles[i].lock();
  }
}

function draw() {
  background(25);

  physics.update();

  stroke(255);

  cursorPoint = -1;

  for(let i = 0; i < particles.length; i++){
    particles[i].show();

    if(i == selectedPoints[0]){
      circle(particles[i].x, particles[i].y, 10);
    }

    if (dist(particles[i].x, particles[i].y, mouseX, mouseY) < 20) {
      cursorPoint = i;
      circle(particles[i].x, particles[i].y, 20);
    }
  }

  check_rupture();
}

function keyPressed() {
  console.log("OK")

  if(keyCode == 71){ // g
    if (physics.behaviors.length != 0) {
      physics.removeBehavior(gravity);
    }
    else {
      physics.addBehavior(gravity);
    }
  }

  else if (keyCode == 32) {///espace
    if (currentIndex === 0) {
      moveCarAcrossBridge();
    }
  }

}

function mouseClicked() {

  if (cursorPoint == -1) {
    particles.push(new Particle(mouseX, mouseY, 0.2));
    selectedPoints.push(particles.length - 1);
  }
  else {
    if (!selectedPoints.includes(cursorPoint)) {
      selectedPoints.push(cursorPoint);
    } else {
      const index = selectedPoints.indexOf(cursorPoint);
      if (index > -1) {
        selectedPoints.splice(index, 1);
      }
    }
  }

  if (selectedPoints.length == 2) {
    springs.push(new Spring(particles[selectedPoints[0]], particles[selectedPoints[1]], 0.95, materials.wood.max_compression, materials.wood.max_extension));
    selectedPoints.splice(0, 1);
  }
}