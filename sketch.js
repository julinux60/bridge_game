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
let water_top_image;
let water_bottom_image;

/*
preload
*/

function preload(){
  materials = loadJSON("./materials.json")
  level_data = loadJSON("./levels.json")

  terrain_image = loadImage("./images/Terrain (32x32).png");
  background_image = loadImage("./images/bg3.jpg");
  big_cloud_image = loadImage("./images/Big Clouds.png");

  water_top_image = loadImage("./images/water_top.png");
  water_bottom_image = loadImage("./images/water_bottom.png");
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