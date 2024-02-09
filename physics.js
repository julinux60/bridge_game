function check_rupture(){
    for (let i = 0; i < springs.length; i++) {
        if ((springs[i].getLength() / springs[i].getRestLength() >= springs[i].max_extension) || (springs[i].getLength() / springs[i].getRestLength() <= springs[i].max_compression)) {
            physics.removeSpring(springs[i]);
            springs.splice(i, 1);
            console.log("spring breaks")
        }
        else {
            springs[i].show();
        }

    }
}