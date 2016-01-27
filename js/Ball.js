/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/19/13
 * Time: 8:05 PM
 * To change this template use File | Settings | File Templates.
 */

Ball.prototype = new Sprite();
Ball.prototype.constructor = Ball;
Ball.constructor = Sprite.prototype.constructor;

// constructor function
function Ball() {
// used for multiple constructors
    switch (arguments.length){
        case 0:
            this.ballNumber = 0;  // player 0 is red
            this.posXY = [0.0,0.0,0.0];
            this.scaleXY = [1.0,1.0,1.0];
            break;
        case 1:
            this.ballNumber = arguments[0];
            this.posXY = [0.0,0.0,0.0];
            this.scaleXY = [1.0,1.0,1.0];
            break;
        case 2:
            this.ballNumber = arguments[0];
            this.posXY = [arguments[1][0],arguments[1][1],0.0];
            this.scaleXY = [1.0,1.0,1.0];
            break;
        case 3:
            this.ballNumber = arguments[0];
            this.posXY = [arguments[1][0],arguments[1][1],0.0];
            this.scaleXY = [arguments[2][0],arguments[2][1],1.0];
            break;
        default :
            console.log("Wrong number of arguments passed to: Ball constructor");

    }

    // Ball properties go here
    this.mvMatrix = mat4.create();

    this.velocityXY = [200.0,0.0,0.0];
    this.mass = 25;

    console.log("\t\t\tBall constructor completed: ");
    console.log(this);
}

Ball.prototype.update = function(delta){

    if(delta>1000.0){

        delta = 0; // fixes out of bounds error when debugger is paused
    }

    vec3.scaleAndAdd(this.posXY,this.posXY,this.velocityXY,(delta)/1000.0);
};


