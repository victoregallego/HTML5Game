/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/19/13
 * Time: 4:27 PM
 * To change this template use File | Settings | File Templates.
 */

    // constructor function
function Game() {

    // used for multiple constructors
    switch (arguments.length){
        case 0:
            this.lastUpdateTime = 0;
            break;
        case 1:
            this.lastUpdateTime = arguments[0];
            break;
        default :
            console.log("Wrong number of arguments passed to: Game constructor");

    }


    // state variables
    this.state = {playing: 0, waiting: 1, stopped: 2};
    this.currentState = this.state.stopped;
    this.waitingCounter = 0;

    this.spriteBatch = new Spritebatch();

    this.playerZero = new Paddle(0,[50.0,225.0],[30,210]);
    this.playerOne = new Paddle(1,[710.0,225.0],[30,210]);
    this.ballZero = new Ball(0,[400.0,225.0],[25,25]);

    // set the texture coord of player and ball
    this.playerZero.textureRowCol = [0,0];
    this.playerOne.textureRowCol = [0,1];
    this.ballZero.textureRowCol = [1,0];

    // add Sprite objects to the Spritebatch
    this.spriteBatch.add(this.playerZero);
    this.spriteBatch.add(this.playerOne);
    this.spriteBatch.add(this.ballZero);

    // for input // WORKING: switching, not concurrently
    this.lastmouseXY = [-1,-1];
    this.mousetravel = 0;

    console.log("\tGame constructor completed: ");
    console.log(this);
}

// A 'static method', it's just like a normal function 
// it has no relation with any 'Game' object instance
Game.staticMethod = function () {
};

Game.prototype.updateScene = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members

    var currentTime = Date.now(); //optimized version, no object creation

    if (this.lastUpdateTime) {

        var delta = currentTime - this.lastUpdateTime;

        if (this.currentState == this.state.playing) {  // while the game is playing

            this.ballZero.update(delta);


            // handle input
            if (this.playerZero.isDragging == true) {

                this.playerZero.move(this.mousetravel, delta);

                this.mousetravel = 0;

            } else if (this.playerOne.isDragging == true) {

                this.playerOne.move(this.mousetravel, delta);

                this.mousetravel = 0;
            }

            // generate new hitboxes based on new position
            this.playerZero.hitboxes = this.playerZero.generateHitboxes();
            this.playerOne.hitboxes = this.playerOne.generateHitboxes();

            Physics.collisionPaddleToWall(this.playerZero);
            Physics.collisionPaddleToWall(this.playerOne);
            Physics.collisionBallToPaddle(this.ballZero, this.playerZero);
            Physics.collisionBallToPaddle(this.ballZero, this.playerOne);
            Physics.collisionBallToWalls(this.ballZero);

            this.checkScore();

        }else if(this.currentState == this.state.waiting){  // a player has just scored

            if(this.waitingCounter > 180){

                // change state
                this.currentState = this.state.playing;

                // reset counter
                this.waitingCounter = -1;

                // reset ball position
                this.ballZero.posXY = [400.0, 225.0, 0.0];

            }

            this.waitingCounter++;

        }else if(this.currentState == this.state.stopped){

            this.ballZero.posXY = [400.0,225.0,0.0];

        }



    }

    this.lastUpdateTime = currentTime;

    // request the next frame from the browser
    requestAnimationFrame(this.updateScene.bind(this));
};

Game.prototype.drawScene = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // apparently clientWidth/Height is preferred

    mat4.ortho(Renderer.perspectiveMatrix, canvas.clientLeft, canvas.clientWidth ,canvas.clientTop,canvas.clientHeight,-1,1);

    // draw all the sprites
    this.spriteBatch.drawAll();

    // updates the vbo with transformed vertex data
    Renderer.generateVboData(this.spriteBatch);

    // generate texture coordinate data
    Renderer.generateTexData(this.spriteBatch);

    // set the shared perspective matrix
    Renderer.setMatrixUniforms();

    // do the actual draw to the canvas object
    gl.drawArrays(gl.TRIANGLES, 0, 6*this.spriteBatch.getLength() );


    // request the next frame from the browser
    requestAnimationFrame(this.drawScene.bind(this));

};


Game.prototype.mouseDown  = function(mouseEvent){

    //TODO : Enter Move Mode for each Paddle

    // is it player 0, player 1, or none?
    if(this.playerZero.isSelected(mouseEvent) == true){

        this.playerZero.isDragging = true;
        console.log(mouseEvent);

    }else if(this.playerOne.isSelected(mouseEvent) == true){

        this.playerOne.isDragging = true;
        console.log(mouseEvent);
    }else{
        // do nothing
        console.log(mouseEvent);
    }

};

Game.prototype.mouseUp = function(mouseEvent){

    this.playerZero.isDragging = false;
    this.playerOne.isDragging = false;

    this.mousetravel = 0;
    this.lastmouseXY = [-1,-1];

    console.log(mouseEvent);
    console.log(this.spriteBatch);

};

Game.prototype.mouseMove = function(mouseEvent){

    if (this.playerZero.isDragging == true) {

        if (this.lastmouseXY[1] > -1) {
            this.mousetravel += mouseEvent.y-this.lastmouseXY[1];
        }

        this.lastmouseXY = [mouseEvent.x, mouseEvent.y];

        console.log(mouseEvent);
    }else if(this.playerOne.isDragging == true){

        if (this.lastmouseXY[1] > -1) {
            this.mousetravel += mouseEvent.y-this.lastmouseXY[1];
        }

        this.lastmouseXY = [mouseEvent.x, mouseEvent.y];

        console.log(mouseEvent);
    }else{
        // do nothing
    }
};

Game.prototype.checkScore = function(){

    if(this.ballZero.posXY[0] < (0 - this.ballZero.scaleXY[0])){  //left side goal

       this.currentState = this.state.waiting;
       // increase score for right side player
        HUD.increaseScore(this.playerOne.playerNumber);

        if(HUD.isGameOver()){

            this.currentState = this.state.stopped;
            HUD.showGameOver(this.playerOne.playerNumber);

        }

    }else if(this.ballZero.posXY[0] > (canvas.clientWidth + this.ballZero.scaleXY[0])){
     // right side goal

        this.currentState = this.state.waiting;
        // increase score for left side player
        HUD.increaseScore(this.playerZero.playerNumber);

        if(HUD.isGameOver()){

            this.currentState = this.state.stopped;
            HUD.showGameOver(this.playerZero.playerNumber);
        }
    }

};

Game.prototype.valuetype_prop = 0;

/**Example Usage
 var myObj = new Game(); // new object instance

 myObj.publicMethod();
 Game.staticMethod();

 reference:
 https://developers.google.com/speed/articles/optimizing-javascript?hl=es&csw=1
 */