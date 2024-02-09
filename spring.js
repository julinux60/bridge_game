class Spring extends VerletSpring2D {
  constructor(a, b, strength, max_compression, max_extension) {
    let length = dist(a.x, a.y, b.x, b.y);
    super(a, b, length, strength);
    this.max_compression = max_compression;
    this.max_extension = max_extension; 
    physics.addSpring(this);
    console.log(this.max_extension)
  }

  show() {
    let normalizedLength = this.getLength() / this.getRestLength();
    let r, g, bl;
    if (normalizedLength == 1) { // Spring is at rest length
      r = 255; g = 255; bl = 255;
    } else if (normalizedLength > 1) { // Spring is stretched
      let blueIntensity = map(normalizedLength, 1, 2, 255, 0); // Adjust 2 as needed
      r = 0; g = 0; bl = blueIntensity;
    } else { // Spring is compressed
      let redIntensity = map(normalizedLength, 0.5, 1, 0, 255); // Adjust 0.5 as needed
      r = redIntensity; g = 0; bl = 0;
    }

    stroke(r, g, bl);

    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }

  getLength(){
    return dist(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
