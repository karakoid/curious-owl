const settings = {
    // field
    fieldWidth: 400,
    fieldHeight: 400,
    fieldColor: "grey",
    //player
    playerMovementDelta: 2,
};
let player;

function setup() {
    createCanvas(settings.fieldWidth, settings.fieldHeight);
    drawBackground();

    player = new Player(0, 0);

    // loadImage(
    //     "https://di.phncdn.com/videos/202211/12/419413161/original/(m=qHXOG3XbeafTGgaaaa)(mh=uSZHCBvj0tN-kqDC)0.jpg",
    //     (img) => {
    //         image(img, 0, 0);
    //     }
    // );
}

function draw() {
    drawBackground();

    movePlayer();

    const trailCycle = getTrailCycle();
    if (trailCycle) {
        console.log(trailCycle);
        // console.log(getTrailUntilTurn(trailCycle, 0));
        console.log(splitTrailCycleIntoTurns(trailCycle));
    }

    player.draw();
}

function drawBackground() {
    clear();
    background(settings.fieldColor);
}

function movePlayer() {
    const delta = settings.playerMovementDelta;

    let directionX;
    let directionY;

    if (keyIsDown(LEFT_ARROW)) {
        directionX = -1;
        directionY = 0;
    } else if (keyIsDown(RIGHT_ARROW)) {
        directionX = 1;
        directionY = 0;
    } else if (keyIsDown(UP_ARROW)) {
        directionX = 0;
        directionY = -1;
    } else if (keyIsDown(DOWN_ARROW)) {
        directionX = 0;
        directionY = 1;
    }

    if (!directionX && !directionY) {
        return;
    }

    const deltas = {
        x: directionX * delta,
        y: directionY * delta,
    };
    const playerPosition = player.getPosition();
    const nextPosition = {
        x: playerPosition.x + deltas.x,
        y: playerPosition.y + deltas.y,
    };
    if (isOutOfBounds(nextPosition)) {
        return;
    }

    player.move(deltas.x, deltas.y);
}

function isOutOfBounds(position) {
    return (
        position.x < 0 ||
        position.y < 0 ||
        position.x > settings.fieldWidth ||
        position.y > settings.fieldHeight
    );
}

///////////////////////////////////////////////////////////////////////////////
// АЛГОРИТМ ЗАКРАШИВАНИЯ ЦИКЛА

// square
// const testCycle = [
//     { x: 0, y: 0 },
//     { x: 1, y: 0 },
//     { x: 2, y: 0 },
//     { x: 2, y: 1 },
//     { x: 1, y: 1 },
//     { x: 0, y: 1 },
//     { x: 0, y: 0 },
// ];

// complex trail
// const testCycle = [
//     { x: 0, y: 0 },
//     { x: 1, y: 0 },
//     { x: 1, y: 1 },
//     { x: 2, y: 1 },
//     { x: 3, y: 1 },
//     { x: 4, y: 1 },
//     { x: 4, y: 2 },
//     { x: 3, y: 2 },
//     { x: 3, y: 3 },
//     { x: 2, y: 3 },
//     { x: 2, y: 4 },
//     { x: 1, y: 4 },
//     { x: 1, y: 3 },
//     { x: 0, y: 3 },
//     { x: 0, y: 2 },
//     { x: 0, y: 1 },
//     { x: 0, y: 0 },
// ];

// console.log(splitTrailCycleIntoTurns(testCycle));

// console.log(JSON.stringify(testCycle));

// const first = getTrailUntilTurn(testCycle);
// console.log(first);
// testCycle.splice(0, first.length - 1);
// console.log(JSON.stringify(testCycle));

// const second = getTrailUntilTurn(testCycle);
// console.log(second);
// testCycle.splice(0, second.length - 1);
// console.log(JSON.stringify(testCycle));

// const third = getTrailUntilTurn(testCycle);
// console.log(third);
// testCycle.splice(0, third.length - 1);
// console.log(JSON.stringify(testCycle));

// const fourth = getTrailUntilTurn(testCycle);
// console.log(fourth);
// testCycle.splice(0, fourth.length - 1);
// console.log(JSON.stringify(testCycle));

// console.log(splitTrailCycleIntoTurns(testCycle));

// searching for trail cycle
function getTrailCycle() {
    const trail = player.getTrail();

    for (let i = 0; i < trail.length; i++) {
        for (let j = 0; j < trail.length; j++) {
            if (i !== j) {
                if (trail[i].x === trail[j].x && trail[i].y === trail[j].y) {
                    return trail.slice(i, j + 1);
                }
            }
        }
    }

    return null;
}

// searching for a straight line until turn
function getTrailUntilTurn(remainingTrail) {
    const firstStep = remainingTrail[0];
    const secondStep = remainingTrail[1];

    const direction = {
        x: secondStep.x - firstStep.x,
        y: secondStep.y - firstStep.y,
    };
    console.log(direction);
    const coordinateToCheck = !direction.x ? "x" : "y";

    const turnIndex = remainingTrail.findIndex(
        (step) => step[coordinateToCheck] !== firstStep[coordinateToCheck]
    );
    console.log(turnIndex);

    if (turnIndex < 0) {
        return remainingTrail.splice(0);
    }

    return remainingTrail.slice(0, turnIndex);
}

// splitting a whole trail cycle into a sequence of turns
function splitTrailCycleIntoTurns(trailCycle) {
    const turns = [];
    while (trailCycle.length) {
        const turn = getTrailUntilTurn(trailCycle);
        trailCycle.splice(0, turn.length - 1);
        turns.push(turn);
    }

    return turns;
}
