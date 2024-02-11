function restart() {
    springs = [];
    particles = [];

    cursorPoint = -1;
    selectedPoints = [];
    lastAction = [];

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

function keyPressed() {
    console.log("OK")

    if (keyCode == 71) { // g
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