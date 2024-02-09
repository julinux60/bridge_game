class Particle extends VerletParticle2D {
  constructor(x, y, weight) {
    super(x, y, weight);
    this.r = 2;
    physics.addParticle(this);
  }

  show() {
    fill(0);
    circle(this.x, this.y, this.r * 2);
  }
}
