/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/19/13
 * Time: 8:05 PM
 * To change this template use File | Settings | File Templates.
 */

Paddle.prototype = new Sprite();
Paddle.prototype.constructor = Paddle;
Paddle.constructor = Sprite.prototype.constructor;

// constructor function
function Paddle() {
// used for multiple constructors
    switch (arguments.length){
        case 0:
            this.playerNumber = 0;  // player 0 is red
            this.posXY = [0.0,0.0,0.0];
            this.scaleXY = [1.0,1.0,1.0];
            break;
        case 1:
            this.playerNumber = arguments[0];
            this.posXY = [0.0,0.0,0.0];
            this.scaleXY = [1.0,1.0,1.0];
            break;
        case 2:
            this.playerNumber = arguments[0];
            this.posXY = [arguments[1][0],arguments[1][1],0.0];
            this.scaleXY = [1.0,1.0,1.0];
            break;
        case 3:
            this.playerNumber = arguments[0];
            this.posXY = [arguments[1][0],arguments[1][1],0.0];
            this.scaleXY = [arguments[2][0],arguments[2][1],1.0];
            break;
        default :
            console.log("Wrong number of arguments passed to: Paddle constructor");

    }

    // paddle properties go here
    this.mvMatrix = mat4.create();

    this.hitboxes = this.generateHitboxes();

    this.isDragging = false;


    console.log("\t\t\tPaddle constructor completed: ");
    console.log(this);
}

Paddle.prototype.generateHitboxes = function(){

    var hitboxes = [];

    var numHitboxes = this.scaleXY[1]/this.scaleXY[0];  // 5 of them

    var isOdd = numHitboxes % 2; // true

    var offset = this.scaleXY[0];

    if (isOdd){

        var upper = 1;
        var lower = 1;

        var toggleSwitch =  1;


        // middle one
        hitboxes.push([this.posXY[0],this.posXY[1]]);

        for (var i = 0; i < numHitboxes - 1; i++) {


            if (toggleSwitch > 0) {

                hitboxes.push([this.posXY[0], this.posXY[1] + offset * upper]);
                upper++;
                toggleSwitch = -toggleSwitch;

            }else{

                hitboxes.push([this.posXY[0], this.posXY[1] - offset * lower]);
                lower++;
                toggleSwitch = -toggleSwitch;
            }
        }
    }

// TODO: Remove this
//    console.log("Generated Hitboxes: ");
//    console.log(hitboxes);

    return hitboxes;

};

Paddle.prototype.isSelected = function( mouseEvent ){

    for (var i = 0; i < this.hitboxes.length; i++) {

        var distance = vec2.distance(this.hitboxes[i], [mouseEvent.x, mouseEvent.y]);
        var radius = this.scaleXY[0] * 0.5;

        if(distance < radius){

            console.log(this.hitboxes[i]);
            return true;
        }

    }

    return false;
};

Paddle.prototype.move = function (speed, delta){

    // TODO rework move function based on old game
    vec3.scaleAndAdd(this.posXY,this.posXY,[0,speed,0],1);
};


