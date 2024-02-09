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

let tic = 0;

let selectedPoints = [];
let cursorPoint;

let lastAction = [];

let materials;
let level_data;

//image

let terrain_image;
let background_image;
let big_cloud_image;

/*
preload
*/

function preload(){
  materials = loadJSON("./materials.json")
  level_data = loadJSON("./levels.json")

  terrain_image = loadImage("./images/Terrain (32x32).png");
  background_image = loadImage("./images/BG Image.png");
  big_cloud_image = loadImage("./images/Big Clouds.png");
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
  for (let i = 0; i < level_data.tablier.initial_fixed_points.length; i++){
    particles[i].lock();
  }

  for (let i = 0; i < level_data.other_fix_points.length; i++) {
    particles.push(new Particle(level_data.other_fix_points[i].x, level_data.other_fix_points[i].y, 1));
    particles[particles.length - 1].lock();
  }
}

function draw() {
  //drawing asset
  drawBackground();

  physics.update();


  cursorPoint = -1;

  check_rupture();
  stroke(255);
  strokeWeight(STROKE_POINTS);

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
  
  }

  else if (keyCode == 82) {//r
    restart();
  }

  else if (keyCode == 90) {//z
    undo_build();
  }
  else if (keyCode == 65) {//z
    selectedPoints = []
  }

}

function mouseClicked() {

  if (cursorPoint == -1) {
    particles.push(new Particle(mouseX, mouseY, 0.2));
    selectedPoints.push(particles.length - 1);
    lastAction.push(1);
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
    springs.push(new Spring(particles[selectedPoints[0]], particles[selectedPoints[1]], 0.95, materials.wood.max_compression, materials.wood.max_extension, "wood"));
    selectedPoints.splice(0, 1);
    lastAction.push(2);
  }
}

function drawBackground(){
  background(221, 198, 161);

  image(background_image, 0, 0, width, height, 0, 0, background_image.width, background_image.height, COVER)

  tic++;
  image(big_cloud_image, tic, 100, big_cloud_image.width * 3, big_cloud_image.height * 3, 0, 0, big_cloud_image.width, big_cloud_image.height)

  //image(terrain_image, 0, 0, 50, 50, 0, 0, 32, 32);
  image(terrain_image, 0, 320, 50, 50, 32, 0, 32, 32);
  image(terrain_image, 0, 370, 50, 50, 32, 32, 32, 32);
  image(terrain_image, 0, 420, 50, 50, 32, 32, 32, 32);
  image(terrain_image, 0, 470, 50, 50, 32, 32, 32, 32);
  image(terrain_image, 0, 520, 50, 50, 32, 32, 32, 32);
  image(terrain_image, 0, 570, 50, 50, 32, 32, 32, 32);

  image(terrain_image, 50, 320, 50, 50, 64, 0, 32, 32);
  image(terrain_image, 50, 320, 50, 50, 64, 0, 32, 32);
  image(terrain_image, 50, 370, 50, 50, 64, 32, 32, 32);
  image(terrain_image, 50, 420, 50, 50, 64, 32, 32, 32);
  image(terrain_image, 50, 470, 50, 50, 64, 32, 32, 32);
  image(terrain_image, 50, 520, 50, 50, 64, 32, 32, 32);
  image(terrain_image, 50, 570, 50, 50, 64, 32, 32, 32);

  image(terrain_image, 800, 400, 50, 50, 0, 0, 32, 32);
  for (let i = 0; i < 4; i++) {
    image(terrain_image, 800, 450 + i * 50, 50, 50, 0, 32, 32, 32);
  }

  image(terrain_image, 850, 400, 50, 50, 32, 0, 32, 32);
  for (let i = 0; i < 4; i++) {
    image(terrain_image, 850, 450 + i * 50, 50, 50, 32, 32, 32, 32);
  }

  image(terrain_image, 900, 400, 50, 50, 32, 0, 32, 32);
  for (let i = 0; i < 4; i++) {
    image(terrain_image, 900, 450 + i * 50, 50, 50, 32, 32, 32, 32);
  }

  image(terrain_image, 950, 400, 50, 50, 32, 0, 32, 32);
  for (let i = 0; i < 4; i++) {
    image(terrain_image, 950, 450 + i * 50, 50, 50, 32, 32, 32, 32);
  }
}