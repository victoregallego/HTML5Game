/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/25/13
 * Time: 4:05 PM
 * To change this template use File | Settings | File Templates.
 */

    // constructor function
function Spritebatch() {

    switch (arguments.length){
        case 0:
            this.data = [];
            break;
        case 1:
            this.data = arguments[0];
            break;
        //..
        default :
            console.log("Wrong number of arguments passed to: Spritebatch constructor");

    }
}

// A 'static method', it's just like a normal function 
// it has no relation with any 'Spritebatch' object instance
Spritebatch.staticMethod = function () {
};

Spritebatch.prototype.add = function ( spriteObj) {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
    this.data.push(spriteObj);

};

Spritebatch.prototype.getLength = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members

    return this.data.length;

};
Spritebatch.prototype.drawAll = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members

    for (var i = 0; i < this.getLength(); i++) {
        this.data[i].draw();
    }

};
Spritebatch.prototype.remove = function ( spriteObj) {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members

    var index = this.data.indexOf(spriteObj);
    this.data.splice(index, 1);

    console.log("The new Spritebatch is: ");
    console.log(this.data);

    return index;

};

Spritebatch.prototype.valuetype_prop = 0;

/**Example Usage
 var myObj = new Spritebatch(); // new object instance

 myObj.publicMethod();
 Spritebatch.staticMethod();

 reference:
 https://developers.google.com/speed/articles/optimizing-javascript?hl=es&csw=1
 */