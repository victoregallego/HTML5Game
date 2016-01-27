/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/27/13
 * Time: 3:42 PM
 * To change this template use File | Settings | File Templates.
 */

    // constructor function
function Physics() {
    var privateVariable; // private member only available within the constructor fn

    this.privilegedMethod = function () { // it can access private members
        //..
    };
}

// A 'static method', it's just like a normal function 
// it has no relation with any 'Physics' object instance
Physics.collisonCircleToCircle = function (delta, spriteBatch) {

    // look for collisions
    for (var i = 0; i < spriteBatch.getLength(); i++) {

        for (var j = 0; j < spriteBatch.getLength(); j++) {

            if (spriteBatch.data[i] != spriteBatch.data[j]) {

                var distance = vec3.distance(spriteBatch.data[i].posXY, spriteBatch.data[j].posXY);
                var combinedRadii = (spriteBatch.data[i].scaleXY[0] * 0.5) + spriteBatch.data[j].scaleXY[0] * 0.5;

                if (distance < combinedRadii) {

                    var mass1= spriteBatch.data[i].mass;
                    var mass2= spriteBatch.data[j].mass;
                    var massSum = mass1 + mass2;
                    var velX1 = spriteBatch.data[i].velocityXY[0];
                    var velX2 = spriteBatch.data[j].velocityXY[0];
                    var velY1 = spriteBatch.data[i].velocityXY[1];
                    var velY2 = spriteBatch.data[j].velocityXY[1];

                    var newVelX1 = (velX1 * (mass1 - mass2) + (2 * mass2 * velX2)) / massSum;
                    var newVelX2 = (velX2 * (mass2 - mass1) + (2 * mass1 * velX1)) / massSum;
                    var newVelY1 = (velY1 * (mass1 - mass2) + (2 * mass2 * velY2)) / massSum;
                    var newVelY2 = (velY2 * (mass2 - mass1) + (2 * mass1 * velY1)) / massSum;

                    spriteBatch.data[i].velocityXY[0] = newVelX1;
                    spriteBatch.data[j].velocityXY[0] = newVelX2;
                    spriteBatch.data[i].velocityXY[1] = newVelY1;
                    spriteBatch.data[j].velocityXY[1] = newVelY2;

//                    spriteBatch.data[i].capMaxvelocityXY();
//                    spriteBatch.data[j].capMaxvelocityXY();

                    spriteBatch.data[i].posXY[0] += spriteBatch.data[i].velocityXY[0] * (delta/1000.0);
                    spriteBatch.data[j].posXY[0] += spriteBatch.data[j].velocityXY[0] * (delta/1000.0);
                    spriteBatch.data[i].posXY[1] += spriteBatch.data[i].velocityXY[1] * (delta/1000.0);
                    spriteBatch.data[j].posXY[1] += spriteBatch.data[j].velocityXY[1] * (delta/1000.0);

                }
            }

        }

    }

};

Physics.collisionPaddleToWall = function (paddle){

    var length = paddle.hitboxes.length;
    var tophit = paddle.hitboxes[length -2];
    var bottomhit = paddle.hitboxes[length -1];
    var radius = paddle.scaleXY[0] * 0.5;

    if(tophit[1] + radius > canvas.clientHeight){

        paddle.posXY[1] -= (tophit[1] + radius) - canvas.clientHeight;

    }else if(bottomhit[1] - radius < 0){

        paddle.posXY[1] -= (bottomhit[1] - radius);

    }

};

Physics.collisionBallToPaddle = function(ball, paddle){

    var num = Math.floor(Math.random()*85) + 1; // this will get a number between 1 and 99;
    num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

    var length = paddle.hitboxes.length;
    var radius = ball.scaleXY[0] * 0.5;
    var hitradius = paddle.scaleXY[0] * 0.5;

    var isSpecial = false;

    // Loop through all paddle hitboxes
    for (var i = 0; i < paddle.hitboxes.length; i++) {

        var distance = vec2.distance(paddle.hitboxes[i], [ball.posXY[0],ball.posXY[1]]);

        var combinedRadii = (hitradius + radius);

        if(distance < combinedRadii){ // hit is detected

//            sound_boing.pause(); // Perhaps optional
//            sound_boing.currentTime = 0;

            /**
             * From: https://sites.google.com/site/t3hprogrammer/research/circle-circle-collision-tutorial#TOC-Dynamic-Static-Circle-Collision-Detection
             *
             * Dynamic-Static Circle Collision Response
             *
             double collisiondist = Math.sqrt(Math.pow(circle2.x - c_x, 2) + Math.pow(circle2.y - c_y, 2);
             double n_x = (circle2.x - c_x) / collisiondist;
             double n_y = (circle2.y - c_y) / collisiondist;
             double p = 2 * (circle1.vx * n_x + circle1.vy * n_y) / (circle1.mass + circle2.mass);
             double w_x = circle1.vx - p * circle1.mass * n_x - p * circle2.mass * n_x;
             double w_y = circle2.vy - p * circle1.mass * n_y - p * circle2.mass * n_y;
             * */

            if(ball.posXY[1] > (paddle.hitboxes[length - 2][1] + (radius ))){  // top

                ball.velocityXY[1] = -ball.velocityXY[1];
                ball.posXY[1] =  paddle.hitboxes[length - 2][1]+(radius + hitradius);
                isSpecial = true;

            }else if(ball.posXY[1] < (paddle.hitboxes[length - 1][1] - (radius))){  // bottom

                ball.velocityXY[1] = -ball.velocityXY[1];
                ball.posXY[1] =  paddle.hitboxes[length - 1][1]-(radius + hitradius);
                isSpecial = true;

            }

            if (isSpecial == false) {

                ball.velocityXY[0] = -ball.velocityXY[0] * 1.0;

                if (ball.velocityXY[0] < 0 ) {   // left

                    ball.velocityXY[1] += num;

                    ball.posXY[0] = paddle.hitboxes[i][0] - (radius + hitradius);

                }else if(ball.velocityXY[0] > 0 ){ // right

                    ball.velocityXY[1] += num;

                    ball.posXY[0] = paddle.hitboxes[i][0] + (radius + hitradius);
                }
            }

            sound_boing.play();
            break;

        }

    }

};

Physics.collisionBallToWalls = function(ball){

    var radius = ball.scaleXY[0] * 0.5;

    // checking bottom
    if ((ball.posXY[1] - radius) < 0) {
        ball.velocityXY[1] = -ball.velocityXY[1];
        ball.posXY[1] = radius;

        sound_ding.play();

    } else
    // checking top
    if ((ball.posXY[1] + radius) > canvas.clientHeight) {
        ball.velocityXY[1] = -ball.velocityXY[1];
        ball.posXY[1] = canvas.clientHeight - radius;

        sound_ding.play();
    }
};

Physics.prototype.publicMethod = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
};

Physics.prototype.valuetype_prop = 0;

/**Example Usage
 var myObj = new Physics(); // new object instance

 myObj.publicMethod();
 Physics.staticMethod();

 reference:
 https://developers.google.com/speed/articles/optimizing-javascript?hl=es&csw=1
 */