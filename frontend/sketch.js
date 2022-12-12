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

    // const trailCycle = getTrailCycle();
    // if (trailCycle) {
    //     console.log(trailCycle);
    //     // console.log(getTrailUntilTurn(trailCycle, 0));
    //     console.log(splitTrailCycleIntoTurns(trailCycle));
    // }

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

// receive a straight line before a turn
function getTrailUntilTurn(remainingTrail) {
    const firstStep = remainingTrail[0];
    const secondStep = remainingTrail[1];

    const direction = {
        x: secondStep.x - firstStep.x,
        y: secondStep.y - firstStep.y,
    };
    const coordinateToCheck = !direction.x ? "x" : "y";

    const turnIndex = remainingTrail.findIndex(
        (step) => step[coordinateToCheck] !== firstStep[coordinateToCheck]
    );

    if (turnIndex < 0) {
        return remainingTrail.splice(0);
    }

    return remainingTrail.slice(0, turnIndex);
}

// split trail cycle into a sequence of turns
function splitTrailCycleIntoTurns(trailCycle) {
    const turns = [];
    while (trailCycle.length) {
        const turn = getTrailUntilTurn(trailCycle);
        trailCycle.splice(0, turn.length - 1);
        turns.push(turn);
    }

    return turns;
}

// complex trail
const testCycle = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 4, y: 2 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
    { x: 1, y: 4 },
    { x: 1, y: 3 },
    { x: 0, y: 3 },
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
];

const turns = splitTrailCycleIntoTurns(testCycle);
console.log(turns);

// find point on the opposite side of the trail cycle
function findOppositePoint(turns, point, coordinateToSave, coordinateToLose) {
    for (let i = 0; i < turns.length; i++) {
        const index = turns[i].findIndex(
            (turn) => turn[coordinateToSave] === point[coordinateToSave]
        );

        if (
            index > -1 &&
            turns[i][index][coordinateToLose] !== point[coordinateToLose]
        ) {
            return turns[i][index];
        }
    }

    return null;
}

// find top left coordinate out of a set of four coordinates which create a rectangle
function findTopLeftPoint(pointSet) {
    const minX = Math.min(...pointSet.map((point) => point.x));
    const minY = Math.min(
        ...pointSet.filter((point) => point.x === minX).map((point) => point.y)
    );

    return { x: minX, y: minY };
}

// assemble a proper rectangle from a set of points for the rectangle
function fromPointSetToRect(topLeftPoint, pointSet) {
    const width =
        pointSet.find(
            (point) => point.y === topLeftPoint.y && point.x !== topLeftPoint.x
        ).x - topLeftPoint.x;
    const height =
        pointSet.find(
            (point) => point.x === topLeftPoint.x && point.y !== topLeftPoint.y
        ).y - topLeftPoint.y;

    return {
        topLeft: topLeftPoint,
        width,
        height,
    };
}

// find a rectangle to colour
function findRectangleToColor(turns) {
    const path = turns[0];

    // find points that lie on the opposite side of the cycle
    const startPoint = path[0];
    const endPoint = path[path.length - 1];

    const direction = {
        x: endPoint.x - startPoint.x,
        y: endPoint.y - startPoint.y,
    };
    const [coordinateToSave, coordinateToLose] = !direction.x
        ? ["y", "x"]
        : ["x", "y"];

    const startPointOpposite = findOppositePoint(
        turns,
        startPoint,
        coordinateToSave,
        coordinateToLose
    );
    const endPointOpposite = findOppositePoint(
        turns,
        endPoint,
        coordinateToSave,
        coordinateToLose
    );

    const coordinateToLoseMinValue = Math.min(
        startPointOpposite[coordinateToLose],
        endPointOpposite[coordinateToLose]
    );

    startPointOpposite[coordinateToLose] = coordinateToLoseMinValue;
    endPointOpposite[coordinateToLose] = coordinateToLoseMinValue;

    // find smallest coordinate out of a set of four creating a rectangle
    const rectPoints = [
        startPoint,
        endPoint,
        startPointOpposite,
        endPointOpposite,
    ];
    const topLeftPoint = findTopLeftPoint(rectPoints);

    // find width and height of a rectangle
    const rect = fromPointSetToRect(topLeftPoint, rectPoints);

    // color this rectangle
    console.log(rect);
}

findRectangleToColor(turns);
