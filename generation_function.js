function createParticlesAndSprings(subDivision, startX, endX, startY, endY, stiffness, max_compression, max_extension, mass_weight) {
    let particles = [];
    let springs = [];

    // Calculate the distance between each particle based on subDivision
    let deltaX = (endX - startX) / subDivision;
    let deltaY = (endY - startY) / subDivision;

    // Create particles
    for (let i = 0; i <= subDivision; i++) {
        let x = startX + i * deltaX;
        let y = startY + i * deltaY; // This assumes a linear distribution, adjust if necessary
        particles.push(new Particle(x, y, mass_weight));
    }
    // Create springs between consecutive particles
    for (let i = 0; i < particles.length - 1; i++) {
        springs.push(new Spring(particles[i], particles[i + 1], stiffness, max_compression, max_extension, "road"));
    }
    return { particles, springs };
}

