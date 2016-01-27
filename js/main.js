/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/19/13
 * Time: 4:17 PM
 * To change this template use File | Settings | File Templates.
 */

// for webgl context
var canvas;
var gl;

// for game
var game;

// for shaders
var shaderProgram;
var vertexPositionAttribute;
var scaleUniformLocation;
var textureCoordAttribute;

// VBO for vertices sent to the gpu
var vertexBufferObj;

// for dynamic texture coordinates
var texture;
var texLoc;
var img;
var texCoordBufferObj;

// for texture atlas properties
var textureAtlasInfo = {

    atlasSrc: 'textures/pong_glow_atlas.png',
    atlasWidth: 2, // how many sprites wide
    atlasHeight: 2 // how many sprites high

};

// audio handles
var sound_boing = new Audio('audio/pong_boing.ogg');
var sound_ding = new Audio('audio/pong_ding.ogg');

sound_boing.addEventListener('ended', function() {

    // this resets the sound to beginning
    this.pause();
    this.src = this.src;

}, false);

sound_ding.addEventListener('ended', function() {

    // this resets the sound to beginning
    this.pause();
    this.src = this.src;

}, false);

/* Main Function, called on page load*/
function main(){

    canvas = document.getElementById("glcanvas");

    initWebGL(); //initialize GL context

    if (gl) {

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Near things obscure far things, default gl,lequal , gl.notequal gets rid of border
        gl.depthFunc(gl.LEQUAL);
        // Clear the color as well as the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // Initialize the shaders; this is where all the lighting for the
        // vertices and so forth is established.

        initShaders();

        // Here's where we call the routine that builds all the objects
        // we'll be drawing.

        initBuffers();

        // Initializes the textures; this is where all the texture atlas
        // information is loaded from an image file

        initTextures();

    }else{

        console.log("gl context Object not initialized: ");
        console.log(gl);
    }


    console.log("Main Function complete: ");
    console.log(canvas);

}

function initWebGL() {

    //init global variable gl to null

    gl = null;

    try {

        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    } catch (e) {

    }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");

    }

    console.log("\tinitWebGL Function complete: ");
    console.log(gl);
}

function initShaders() {

    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Create the shader program

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);

    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    scaleUniformLocation = gl.getUniformLocation(shaderProgram, "uScale");

    textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTexCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);

    console.log("initShaders Function complete: ");
    console.log(shaderProgram);

}

function getShader(gl, id) {

    var shaderScript;
    var theSource;
    var currentChild;
    var shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // Unknown shader type
        return null;
    }

    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initBuffers() {

    vertexBufferObj = gl.createBuffer();

    // provide texture coordinates for the quad.
    texCoordBufferObj = gl.createBuffer();

    // For placing Texture upright map coordinates as shown below:

    // .---->
    // |   /|
    // |  / |
    // | /  |
    // >----$

    // Where start = . and end = $

    console.log("initBuffers Function complete: ");
    console.log(vertexBufferObj);
    console.log(texCoordBufferObj);
}

function initTextures() {

    // 1. Create the texture
    texture = gl.createTexture();

    img = new Image();

    img.onload = function() {

        // 2. Set the active texture (For a different texture add new index)
        gl.activeTexture(gl.TEXTURE0);
        // 3. Bind the created texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 4. Get a reference to the sampler in the fragment shader program
        texLoc = gl.getUniformLocation(shaderProgram, "uSampler");
        gl.uniform1i(texLoc, 0 ); // the index passed is the active texture

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // corrects t-axis inversion


        // 5. Load the image into the active texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, img);
        // 6. Set some parameters for the active texture
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

        // used to render alpha channel
        gl.enable(gl.BLEND);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObj);
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // game assets are ready
        ready();
    };

    img.src = textureAtlasInfo.atlasSrc;
}

function ready(){

    // TODO: will start the game here

    game = new Game();

    game.drawScene();

    game.updateScene();

    // create key and mouse event bindings
    //canvas.onmousedown = game.mouseDown;
    canvas.addEventListener("mousedown", mouseDown, false);
    window.addEventListener("mouseup", mouseUp, false);
    window.addEventListener("mousemove", mouseMove, false);

    // create touch event bindings
    canvas.addEventListener("touchstart",touchDown, false);
    window.addEventListener("touchend",touchUp, false);
    window.addEventListener("touchmove",touchMove, false);

    document.getElementById("play").addEventListener("touchstart",start, false);
    document.getElementById("playagain").addEventListener("touchstart",restart, false);
    document.getElementById("back").addEventListener("touchstart",backToMainMenu, false);

    console.log("Textures are now ready");
}


function mouseDown(e){

    var mouseEvent = {x: e.clientX, y: (canvas.clientHeight - e.clientY)};
    game.mouseDown(mouseEvent);
}

function mouseUp(e){

    var mouseEvent = {x: e.clientX, y: (canvas.clientHeight - e.clientY)};
    game.mouseUp(mouseEvent);
}

function mouseMove(e){

    var mouseEvent = {x: e.clientX, y: (canvas.clientHeight - e.clientY)};
    game.mouseMove(mouseEvent);
}

function touchDown(e){

    var touchEvent = {x: parseInt(e.changedTouches[0].clientX), y: (canvas.clientHeight - parseInt(e.changedTouches[0].clientY))};

    e.preventDefault();

    game.mouseDown(touchEvent);
}

function touchUp(e){

    var touchEvent = {x: parseInt(e.changedTouches[0].clientX), y: (canvas.clientHeight - parseInt(e.changedTouches[0].clientY))};
    e.preventDefault();
    game.mouseUp(touchEvent);
}

function touchMove(e){

    var touchEvent = {x: parseInt(e.changedTouches[0].clientX), y: (canvas.clientHeight - parseInt(e.changedTouches[0].clientY))};
   // fix for pinch zoom
   // e.preventDefault();
    game.mouseMove(touchEvent);
}

function start(){

    HUD.hideMainMenu();

    HUD.resetScore();

    game.playerZero.posXY = [50.0,225.0,0.0];
    game.playerOne.posXY = [710.0,225.0,0.0];
    game.ballZero.posXY = [400.0,225.0,0.0];

    game.currentState = game.state.waiting;
}

function restart(){

    // will restart the game here
    HUD.resetScore();

    HUD.hideGameOver();

    game.playerZero.posXY = [50.0,225.0,0.0];
    game.playerOne.posXY = [710.0,225.0,0.0];
    game.ballZero.posXY = [400.0,225.0,0.0];

    game.currentState = game.state.waiting;
}

function backToMainMenu(){

    HUD.hideGameOver();

    HUD.showMainMenu();
}