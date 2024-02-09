function restart() {
    springs = [];
    particles = [];

    cursorPoint = -1;
    selectedPoints = [];

    if (physics.behaviors.length != 0) {
        physics.removeBehavior(gravity);
    }

    ({ particles, springs } = createParticlesAndSprings(level_data.tablier.subdivision, level_data.tablier.start_x, level_data.tablier.end_x, level_data.tablier.start_y, level_data.tablier.end_y, materials.road.stiffness, materials.road.max_compression, materials.road.max_extension, level_data.tablier.mass_points_weigth));
    particles[0].lock();
    particles[particles.length - 1].lock();
    for (let i = 0; i < level_data.tablier.initial_fixed_points.length; i++) {
        particles[i].lock();
    }

    for (let i = 0; i < level_data.other_fix_points.length; i++) {
        particles.push(new Particle(level_data.other_fix_points[i].x, level_data.other_fix_points[i].y, 1));
        particles[particles.length - 1].lock();
    }
}

function undo_build() {
    if (lastAction[lastAction.length - 1] == 1) {
        physics.removeParticle(particles[particles.length - 1]);
        particles.pop();
        selectedPoints = [];
        lastAction.pop();
    }
    else if (lastAction[lastAction.length - 1] == 2) {
        physics.removeSpring(springs[springs.length - 1]);
        springs.pop();
        lastAction.pop();
    }
}