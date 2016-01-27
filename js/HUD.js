/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 12/4/13
 * Time: 4:01 PM
 * To change this template use File | Settings | File Templates.
 */

    // constructor function
function HUD() {
    var privateVariable; // private member only available within the constructor fn

    this.privilegedMethod = function () { // it can access private members
        //..
    };

}

// A 'static method', it's just like a normal function 
// it has no relation with any 'HUD' object instance
HUD.increaseScore = function (playerNumber) {

    var score;

    this.scorep1 = document.getElementById("scorep1");
    this.scorep2 = document.getElementById("scorep2");

    if(playerNumber == 0){

        score = parseInt(this.scorep1.textContent);
        score++;
        this.scorep1.textContent = score.toString();

    }else if(playerNumber == 1){

        score = parseInt(this.scorep2.textContent);
        score++;
        this.scorep2.textContent = score.toString();
    }
};

HUD.isGameOver = function () {

    var maxScore = 3;
    var score;

    this.scorep1 = document.getElementById("scorep1");
    this.scorep2 = document.getElementById("scorep2");

    score = parseInt(this.scorep1.textContent);

    if(score >= maxScore ){

        //this.showGameOver(0);

        console.log("Game is Over p1 Wins");
        return true;

    }

    score = parseInt(this.scorep2.textContent);

    if(score >= maxScore ){

        //this.showGameOver(1);
        console.log("Game is Over p2 Wins");
        return true;

    }

    return false;
};

HUD.hideGameOver = function (){

    var gameOver = document.getElementById("gameover");
    gameOver.style.display = "none";
};

HUD.showGameOver = function (winner){

    var gameOver = document.getElementById("gameover");
    var playername = document.getElementById("playername");

    if(winner == 0){  // p1 wins

        playername.style.color = "#00fd0b";
        playername.innerHTML = "Player 1 Wins";

    }else if(winner == 1){

        playername.style.color = "#d909e6";
        playername.innerHTML = "Player 2 Wins";
    }

    gameOver.style.display = "block";
};

HUD.hideMainMenu = function(){

    var instructions = document.getElementById("instructions");
    instructions.style.display = "none";
};

HUD.showMainMenu = function(){

    var instructions = document.getElementById("instructions");
    instructions.style.display = "block";
};

HUD.resetScore = function(){

    document.getElementById("scorep1").textContent = "0";
    document.getElementById("scorep2").textContent = "0";
};

HUD.prototype.publicMethod = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
};

HUD.prototype.valuetype_prop = 0;

/**Example Usage
 var myObj = new HUD(); // new object instance

 myObj.publicMethod();
 HUD.staticMethod();

 reference:
 https://developers.google.com/speed/articles/optimizing-javascript?hl=es&csw=1
 */