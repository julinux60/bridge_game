const IMAGE_DIM = 32;
const IMAGE_DISPLAY_DIM = 80;

const BLOCK_REFERENCE = {
    T_LEFT: { x: 0, y: 0 },
    T_MIDDLE: {x: 1, y: 0},
    T_RIGHT: { x: 2, y: 0 },

    M_LEFT: { x: 0, y: 1 },
    M_MIDDLE: { x: 1, y: 1 },
    M_RIGHT: { x: 2, y: 1 },

    B_LEFT: { x: 0, y: 2 },
    B_MIDDLE: { x: 1, y: 2 },
    B_RIGHT: { x: 2, y: 2}
}

function drawBackground() {

    background(255);
    tint(200, 127);
    image(background_image, 0, 0, width, height, 0, 0, background_image.width, background_image.height, COVER)
    tint(255, 255);


    drawWater(0, 450, 12, 3);

    drawBlock(-50, 250, 2, 4);
    drawBlock(750, 300, 4, 5);
    
}

function drawTextureFromIndex(x, y, indexX, indexY) {
    image(terrain_image, x, y, IMAGE_DISPLAY_DIM, IMAGE_DISPLAY_DIM, indexX * IMAGE_DIM, indexY * IMAGE_DIM, IMAGE_DIM, IMAGE_DIM);
}

function drawTexture(x, y, type) {
    if (BLOCK_REFERENCE.hasOwnProperty(type)) {
        drawTextureFromIndex(x, y, BLOCK_REFERENCE[type].x, BLOCK_REFERENCE[type].y);
    } else {
        console.error("Unknown type:", type);
    }
}

function drawBlock(x, y, sizeX, sizeY) {
    // Calculate the number of texture blocks to draw horizontally and vertically
    const numBlocksX = sizeX;
    const numBlocksY = sizeY;

    // Draw the top border
    drawTexture(x, y, "T_LEFT");
    for (let i = 1; i < numBlocksX - 1; i++) {
        drawTexture(x + i * IMAGE_DISPLAY_DIM, y, "T_MIDDLE");
    }
    drawTexture(x + (numBlocksX - 1) * IMAGE_DISPLAY_DIM, y, "T_RIGHT");

    // Draw the middle part
    for (let j = 1; j < numBlocksY - 1; j++) {
        drawTexture(x, y + j * IMAGE_DISPLAY_DIM, "M_LEFT");
        for (let i = 1; i < numBlocksX - 1; i++) {
            drawTexture(x + i * IMAGE_DISPLAY_DIM, y + j * IMAGE_DISPLAY_DIM, "M_MIDDLE");
        }
        drawTexture(x + (numBlocksX - 1) * IMAGE_DISPLAY_DIM, y + j * IMAGE_DISPLAY_DIM, "M_RIGHT");
    }

    // Draw the bottom border
    drawTexture(x, y + (numBlocksY - 1) * IMAGE_DISPLAY_DIM, "B_LEFT");
    for (let i = 1; i < numBlocksX - 1; i++) {
        drawTexture(x + i * IMAGE_DISPLAY_DIM, y + (numBlocksY - 1) * IMAGE_DISPLAY_DIM, "B_MIDDLE");
    }
    drawTexture(x + (numBlocksX - 1) * IMAGE_DISPLAY_DIM, y + (numBlocksY - 1) * IMAGE_DISPLAY_DIM, "B_RIGHT");
}

function drawWater(x, y, sizeX, sizeY){
    for(let i = 0; i < sizeX; i++){
        image(water_top_image, x + i * IMAGE_DISPLAY_DIM, y, IMAGE_DISPLAY_DIM, IMAGE_DISPLAY_DIM);
    }

    for(let j = 0; j < sizeY-1; j++){
        for (let i = 0; i < sizeX; i++) {
            image(water_bottom_image, x + i * IMAGE_DISPLAY_DIM, y + j * IMAGE_DISPLAY_DIM, IMAGE_DISPLAY_DIM, IMAGE_DISPLAY_DIM);
        }
    }
}