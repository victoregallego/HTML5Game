/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/19/13
 * Time: 5:02 PM
 * To change this template use File | Settings | File Templates.
 */

    // constructor function
function Sprite() {

    // used for multiple constructors
    switch (arguments.length){
        case 0:
            this.posXY = [0.0,0.0,0.0];
            this.scaleXY = [1.0,1.0,1.0];
            this.rotation = 0;
            break;
        case 1:
            this.posXY = [arguments[0][0],arguments[0][1],0.0];
            this.scaleXY = [1.0,1.0,1.0];
            this.rotation = 0;
            break;
        case 2:
            this.posXY = [arguments[0][0],arguments[0][1],0.0];
            this.scaleXY = [arguments[1][0],arguments[1][1],0.0];
            this.rotation = 0;
            break;
        default :
            console.log("Wrong number of arguments passed to: Sprite constructor");

    }

    // properties for sprite

    this.rotDir = [0.0,0.0,0.0];
    this.textureRowCol = [0,0];


    console.log("\t\tSprite constructor completed: ");
    console.log(this);
}

// A 'static method', it's just like a normal function 
// it has no relation with any 'Sprite' object instance
Sprite.staticMethod = function () {
};

Sprite.prototype.draw = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members


    // set mv identity
    mat4.identity(this.mvMatrix);

    // translate to initial position of mv
    mat4.translate(this.mvMatrix, this.mvMatrix, this.posXY);

    // set mv rotation
    mat4.rotate(this.mvMatrix,this.mvMatrix,Renderer.toRadians(this.rotation),this.rotDir);
};

Sprite.prototype.valuetype_prop = 0;

/**Example Usage
 var myObj = new Sprite(); // new object instance

 myObj.publicMethod();
 Sprite.staticMethod();

 reference:
 https://developers.google.com/speed/articles/optimizing-javascript?hl=es&csw=1
 */