/**
 * Created with JetBrains WebStorm.
 * User: VictorE
 * Date: 11/25/13
 * Time: 5:13 PM
 * To change this template use File | Settings | File Templates.
 */

    // constructor function
function Renderer() {
    var privateVariable; // private member only available within the constructor fn

    this.privilegedMethod = function () { // it can access private members
        //..
    };


}

// A 'static method', it's just like a normal function 
// it has no relation with any 'Renderer' object instance
Renderer.staticMethod = function () {
};

Renderer.perspectiveMatrix = mat4.create();

Renderer.newVerts = [];

Renderer.newTexCoords = [];

Renderer.applyScale = function(scaleXYZ){
    var vertices =
        [ -0.5, 0.5, 0.0, //tleft
            0.5, 0.5, 0.0,    //tright
            -0.5, -0.5, 0.0,  //bleft

            0.5, -0.5, 0.0,    //bright
            -0.5, -0.5, 0.0,  //bleft
            0.5, 0.5, 0.0    //tright
        ];

    return vec3.forEach(vertices,0,0,0,
        function(out, v3, arg){
            vec3.multiply(out,v3,arg);
        },scaleXYZ);  //TODO scale XYZ
};

Renderer.applyUVMapping = function(tRow, tCol){

    var row, col;
    row = tRow;
    col = (textureAtlasInfo.atlasHeight - 1)- tCol; // invert the y direction
    // row and col are zero indexed


    var texWide = 1.0 / textureAtlasInfo.atlasWidth ;
    var texHigh = 1.0 / textureAtlasInfo.atlasHeight ;
    var startX = row * texWide;
    var startY = col * texHigh;
    var endX = startX + texWide;
    var endY = startY + texHigh;

    var UVList = [
        startX,endY, // 0,1  tleft
        endX,endY, // 1,1    tright
        startX,startY, // 0,0 bleft

        endX,startY, // 1,0    bright
        startX,startY, // 0,0 bleft
        endX,endY // 1,1    tright
    ];

    return UVList;
};

Renderer.applyTransformation = function(vertices, mvMatrix){

    return vec3.forEach(vertices,0,0,0,
        function(out, v3, arg){
            vec3.transformMat4(out,v3,arg);
        },mvMatrix);
};

Renderer.generateVboData = function(spriteBatch) {

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObj);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // build the transformed vertex array

    Renderer.newVerts.length = 0;

    // applies the model view scale and transformation
    for (var i = 0; i < spriteBatch.getLength(); i++) {

         var sprite = spriteBatch.data[i];

        Renderer.newVerts.push.apply(Renderer.newVerts,Renderer.applyTransformation(
            Renderer.applyScale(spriteBatch.data[i].scaleXY), sprite.mvMatrix
        ));
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Renderer.newVerts), gl.DYNAMIC_DRAW);
};

Renderer.generateTexData = function(spriteBatch) {

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObj);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    // build the texture coordinate array
    Renderer.newTexCoords.length = 0;


    // applies uv mappings for each vertex in each sprite
    for (var i = 0; i < spriteBatch.getLength(); i++) {

        var sprite = spriteBatch.data[i];
        Renderer.newTexCoords.push.apply(Renderer.newTexCoords, Renderer.applyUVMapping(sprite.textureRowCol[0],
                                                                                                sprite.textureRowCol[1]));
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Renderer.newTexCoords), gl.DYNAMIC_DRAW);

};

Renderer.prototype.publicMethod = function () {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
};

Renderer.prototype.valuetype_prop = 0;


//
// Matrix utility functions
//

Renderer.setMatrixUniforms = function() {

    // perspective matrix is shared by all sprites
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, Renderer.perspectiveMatrix);
};

Renderer.toRadians = function(angle){
    return angle * Math.PI / 180.0;
};

/**Example Usage
 var myObj = new Renderer(); // new object instance

 myObj.publicMethod();
 Renderer.staticMethod();

 reference:
 https://developers.google.com/speed/articles/optimizing-javascript?hl=es&csw=1
 */