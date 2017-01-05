/**
 * Created by Shiraishi Kakuya on 30/12/2016.
 */


function Render() {
    this.canvas = null;
    this.context = null;

    this.camera = {
        x: 0,
        y: 0,
        width: 1200,
        height: 800,
        paddingLeft: 150 - 10,
        paddingTop: 400 - 10
    }
}

// Importing relevant classes
var Lamp = illuminated.Lamp
    , RectangleObject = illuminated.RectangleObject
    , PolygonObject = illuminated.PolygonObject
    , DiscObject = illuminated.DiscObject
    , Vec2 = illuminated.Vec2
    , Lighting = illuminated.Lighting
    ;

var light = new Lamp({
    position: new Vec2(0, 0),
    distance: 800,
    diffuse: 1,
    color: 'rgba(150,220,150,0.8)',
    radius: 5,
    samples: 2
});

var previousLightRadius = 800;
var newLightRadius = 10;

var lights = [
    new Lamp({
        position: new Vec2(0, 0),
        distance: 800,
        diffuse: 1,
        color: 'rgba(150,220,150,0.8)',
        radius: 5,
        samples: 2
    }),
    new Lamp({
        position: new Vec2(0, 0),
        distance: 800,
        diffuse: 1,
        color: 'rgba(150,197,220,0.8)',
        radius: 5,
        samples: 2
    }),
    new Lamp({
        position: new Vec2(0, 0),
        distance: 800,
        diffuse: 1,
        color: 'rgba(220,213,149,0.8)',
        radius: 5,
        samples: 2
    }),
    new Lamp({
        position: new Vec2(0, 0),
        distance: 800,
        diffuse: 1,
        color: 'rgba(220,150,150,0.8)',
        radius: 5,
        samples: 2
    })
];


var hexcolor = [
    '#96dc96',
    '#96c5dc',
    '#dcd595',
    '#dc9696'
];

var objects = [];


Render.prototype.init = function () {
    this.canvas = document.getElementById("gameCanvas");
    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();
    this.context = this.canvas.getContext('2d');
};
Render.prototype.resize = function () {
    var w = Math.max(document.documentElement.clientWidth || 0);
    var h = Math.max(document.documentElement.clientHeight || 0);

    this.canvas.width = w;
    this.canvas.height = h;
    this.camera.width = w;
    this.camera.height = h;
    this.camera.paddingLeft = w/8;
    this.camera.paddingTop=h/2;
};

Render.prototype.initIllumination = function () {

    var light = new Lamp({
        position: new Vec2(gameEngine.player.position.x, gameEngine.player.position.y),
        distance: 500
    });

    var rect = new RectangleObject({
        topleft: new Vec2(250, 200),
        bottomright: new Vec2(350, 250)
    });

    var lighting = new Lighting({
        light: light,
        objects: [rect]
    });
    lighting.compute(this.canvas.width, this.canvas.height);
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    lighting.render(this.context);

};


Render.prototype.drawLight = function (x, y, r) {
    light.position = new Vec2(x, y);
    light.radius = r;

};


Render.prototype.draw = function () {

    this.camera.x = gameEngine.player.position.x - this.camera.paddingLeft;
    this.camera.y = gameEngine.player.position.y - this.camera.paddingTop;

    //this.context.clearRect(0,0,this.camera.width,this.camera.height);

    if (gameEngine.changingDimension) {

        this.drawMap();
        this.drawPlayerInterdimensional();
    } else {

        this.drawMap();
        this.drawPlayer();
    }
    //this.context.save();
    //this.context.translate(gameEngine.player.position.x, gameEngine.player.position.y);
    //this.context.restore();

    var lighting = new Lighting({
        light: light,
        objects: objects
    });
    lighting.compute(this.canvas.width, this.canvas.height);
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    lighting.render(this.context);


    for (var t = 0; t < gameEngine.map.texts.length; t++) {

        if (gameEngine.player.position.x + this.camera.width - this.camera.paddingLeft >= gameEngine.map.texts[t].position.x
        ) {


            this.drawText(gameEngine.map.texts[t]);


        }


    }


    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < gameEngine.map.mapDimensionsTest[j].length; i++) {
            this.context.beginPath();
            this.context.strokeStyle = hexcolor[j];
            this.context.lineWidth = 4;
            this.context.moveTo(gameEngine.map.mapDimensionsTest[j][i][0].x - this.camera.x, gameEngine.map.mapDimensionsTest[j][i][0].y - this.camera.y);
            this.context.lineTo(gameEngine.map.mapDimensionsTest[j][i][1].x - this.camera.x, gameEngine.map.mapDimensionsTest[j][i][1].y - this.camera.y);
            this.context.stroke();
        }
    }

    drawblurrycircle(this.context, gameEngine.player.position.x - this.camera.x, gameEngine.player.position.y - this.camera.y, gameEngine.player.radius, 5);


};


function drawblurrycircle(context, x, y, radius, blur) {
    context.shadowBlur = blur;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = "#FFFFFF";
    context.shadowColor = "#000000"; //set the shadow colour to that of the fill

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fill();
    context.fillStyle = "#000000";
    context.shadowBlur = 0;
}

Render.prototype.drawPlayer = function () {


    this.drawLight(gameEngine.player.position.x - this.camera.x, gameEngine.player.position.y - this.camera.y, gameEngine.player.radius);

    //this.context.beginPath();
    //this.context.arc(gameEngine.player.position.x - this.camera.x, gameEngine.player.position.y - gameEngine.player.levitationPos - this.camera.y, gameEngine.player.radius, 0, 2 * Math.PI, true);
    //this.context.closePath();
    //this.context.fill();

};


Render.prototype.drawText = function (text) {

    this.context.save();
    this.context.font = "90px Roboto";

    this.context.fillStyle = "#FFFFFF";
    this.context.fillText(text.text, text.position.x - this.camera.x, text.position.y - this.camera.y);


};


Render.prototype.drawPlayerInterdimensional = function () {
    var x = gameEngine.player.position.x - this.camera.x;
    var y = gameEngine.player.position.y - this.camera.y;
    var r = gameEngine.player.radius;

    light.position = new Vec2(x, y);
    light.radius = r;
    previousLightRadius -= 100;
    light.distance = previousLightRadius;
    if (previousLightRadius < 10 && newLightRadius == 10) {
        light = lights[gameEngine.currentDimension];
        light.position = new Vec2(x, y);
        light.radius = r;
        newLightRadius += 100;
    }
    if (newLightRadius > 10) {
        newLightRadius += 100;
        light.distance = newLightRadius;
        if (newLightRadius >= 800) {
            gameEngine.previousDimension = gameEngine.currentDimension;
            gameEngine.changingDimension = false;
            gameEngine.previousTick = new Date().getTime();
            previousLightRadius = 800;
            newLightRadius = 10;
        }
    }
};

Render.prototype.drawMap = function () {

    objects = [];


    for (var i = 0; i < gameEngine.map.mapDimensionsTest[gameEngine.currentDimension].length; i++) {

        objects.push(
            P = new PolygonObject({
                "points": $.map([
                        {
                            "x": gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].x - this.camera.x,
                            "y": gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].y - this.camera.y
                        },
                        {
                            "x": gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].x - this.camera.x,
                            "y": gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].y - this.camera.y
                        },
                        //{"x":gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].x - this.camera.x,"y":gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].y - this.camera.y+20},
                        //{"x":gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].x - this.camera.x,"y":gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].y - this.camera.y+20}
                    ],

                    function (p) {
                        return new Vec2(p.x, p.y)
                    })
            }));

        //objects.push(new PolygonObject(new Vec2(gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].x - this.camera.x, gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].y - this.camera.y), new Vec2(gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].x - this.camera.x, gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].y - this.camera.y)));

        /*this.context.beginPath();
         this.context.moveTo(gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].x - this.camera.x, gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][0].y - this.camera.y);
         this.context.lineTo(gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].x - this.camera.x, gameEngine.map.mapDimensionsTest[gameEngine.currentDimension][i][1].y - this.camera.y);
         this.context.stroke();*/
    }


};
