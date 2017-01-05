/**
 * Created by Shiraishi Kakuya on 30/12/2016.
 */

function GameEngine() {
    this.currentDimension = 0;
    this.previousDimension = this.currentDimension;
    this.changingDimension = false;
    this.map = new Map();
    this.power=true;

    this.tutorial = true;
    this.gameStartX = 0;

    this.previousTick = null;
    this.tick = 0;
    this.deltaT = 0;

    this.neighbours = [];

    this.texts=[];


    this.frameCurrentState = 0;
    this.currentFloorPosition = null;

    this.player = new Player();
}

GameEngine.prototype.checkRestartGame=function(){
  if(this.player.velocity.y>=20){
      document.getElementById('playDie').pause();
      document.getElementById('playDie').currentTime = 0;
      document.getElementById('playDie').play();

      if(gameEngine.currentDimension != 0){gameEngine.currentDimension=0;gameEngine.changingDimension = true; document.getElementById('playDimension').pause();document.getElementById('playDimension').currentTime = 0;document.getElementById('playDimension').play();}
      this.player.restart();
}
};

GameEngine.prototype.update = function () {

    if(this.tutorial && this.player.position.x > this.gameStartX){
        this.tutorial = false;
        $('#leyenda').show();

        document.getElementById('playTutorial').pause();document.getElementById('playTutorial').currentTime = 0;
        document.getElementById('playGame').pause();document.getElementById('playGame').currentTime = 0;document.getElementById('playGame').play();
    }

    this.checkRestartGame();

    this.nextTick();

    //this.player.position.y = this.player.position.y + this.player.velocity.y;
    //this.player.position.x = this.player.position.x + this.player.velocity.x * this.deltaT/1000;
    //if(this.currentFloorPosition <= this.player.position.y + this.player.radius) {
    //    this.player.position.y = this.currentFloorPosition - this.player.radius;
    //    this.player.velocity = this.player.VELOCITY.clone();
    //    this.player.gravity = this.player.GRAVITY;
    //}
    //this.player.velocity.y = (this.player.position.y - this.player.previousPosition.y);
    //
    //this.player.previousPosition = this.player.position.clone();

    //this.player.levitate(this.deltaT);
};

GameEngine.prototype.init = function () {
    this.map.loadMap(TileMaps["Map2"]);
};


GameEngine.prototype.nextTick = function () {

    this.getTimes();
    this.findCurrentFrame();

    this.nextTickPlayer();
};

GameEngine.prototype.getTimes = function () {
    if (this.previousTick == null) {
        this.previousTick = new Date().getTime();
    } else {
        this.previousTick = this.tick;
    }
    this.tick = new Date().getTime();
    this.deltaT = this.tick - this.previousTick;
};

GameEngine.prototype.nextTickPlayer = function () {
    //si hay collision con algun objeto
    //{}
    this.findNeighbourFrames();



    if(this.neighbours.length > 0){
        for(var i=0; i<this.neighbours.length; i++){
            if(this.neighbours[i].length == 3){
                this.iterateNeighbours(this.neighbours[i][1], this.neighbours[i][2]);
            }else{
                //console.log("MIERDAAAAAAAAAAA");
                this.iterateNeighbours(this.neighbours[i][1], this.neighbours[i][1]);
            }

            var p=(this.neighbours[i][0][1].y-this.neighbours[i][0][0].y)/(this.neighbours[i][0][1].x-this.neighbours[i][0][0].x);
        }

        this.player.velocity.y = this.player.velocity.x*p;


        this.player.velocity=this.player.velocity.normalize().multiply(this.player.VELOCITY.mag());

        this.player.position=this.player.position.add(this.player.velocity);


    }else{
        //si NO hay colisión con nada
        //GRAVEDAD

        this.player.velocity.y += this.deltaT / 1000 * this.player.gravity;
        this.player.position = this.player.position.add(this.player.velocity);
        this.player.velocity.y = this.player.position.y - this.player.previousPosition.y;
    }

    this.checkIntersections();

    for(var ch=0;ch<this.map.checkpoints.length;ch++){
        if(this.player.position.x>this.map.checkpoints[ch].x){

            this.power=true;
            this.player.startposition=this.map.checkpoints[ch];
        }
    }


    this.player.previousPosition = this.player.position;
};

GameEngine.prototype.iterateNeighbours = function(sol1, sol2){
    var vector = (sol1.subtract(sol2).multiply(0.5).add(sol2)).subtract(this.player.position);
    var vectorTrans = this.player.position.add(vector.normalize().multiply(vector.mag()-this.player.radius));

    this.player.position = vectorTrans.clone();
};

GameEngine.prototype.findNeighbourFrames = function () {
    this.neighbours = [];
    for (var i = 0; i < this.map.mapDimensionsTest[this.currentDimension].length; i++) {
        var temp = this.circleLineCollision(this.map.mapDimensionsTest[this.currentDimension][i][0], this.map.mapDimensionsTest[this.currentDimension][i][1]);
        if(temp.length == 2){
            this.neighbours.push([this.map.mapDimensionsTest[this.currentDimension][i],temp[0],temp[1]]);
        }else if(temp.length == 1){
            this.neighbours.push([this.map.mapDimensionsTest[this.currentDimension][i],temp[0]]);
        }
    }
};


GameEngine.prototype.checkIntersections=function(){
    for (var i = 0; i < this.map.mapDimensionsTest[this.currentDimension].length; i++) {
        if (this.lineIntersect([this.player.previousPosition, this.player.position], [this.map.mapDimensionsTest[this.currentDimension][i][0], this.map.mapDimensionsTest[this.currentDimension][i][1]])) {
            //console.log("JODEEEEEER");
        }
    }
};

GameEngine.prototype.lineIntersect = function(segment1, segment2) {
        var x1 = segment1[0].x;
        var y1 = segment1[0].y;
        var x2 = segment1[1].x;
        var y2 = segment1[1].y;

        var x3 = segment2[0].x;
        var y3 = segment2[0].y;
        var x4 = segment2[1].x;
        var y4 = segment2[1].y;



        var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
        var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
        if (isNaN(x)||isNaN(y)) {
            return false;
        } else {
            if (x1>=x2) {
                if (!(x2<=x&&x<=x1)) {return false;}
            } else {
                if (!(x1<=x&&x<=x2)) {return false;}
            }
            if (y1>=y2) {
                if (!(y2<=y&&y<=y1)) {return false;}
            } else {
                if (!(y1<=y&&y<=y2)) {return false;}
            }
            if (x3>=x4) {
                if (!(x4<=x&&x<=x3)) {return false;}
            } else {
                if (!(x3<=x&&x<=x4)) {return false;}
            }
            if (y3>=y4) {
                if (!(y4<=y&&y<=y3)) {return false;}
            } else {
                if (!(y3<=y&&y<=y4)) {return false;}
            }
        }

        this.player.position=new Vector2D(x,y-this.player.radius/2);
        this.player.velocity.y=0;

        return true;

};



GameEngine.prototype.circleLineCollision = function (p1, p2){

    var localP1 = p1.subtract(this.player.position);
    var localP2 = p2.subtract(this.player.position);
    var P2minusP1 = localP2.subtract(localP1);

    var a = P2minusP1.x * P2minusP1.x + P2minusP1.y * P2minusP1.y;
    var b = 2*((P2minusP1.x * localP1.x) + (P2minusP1.y * localP1.y));
    var c = localP1.x * localP1.x + localP1.y * localP1.y - this.player.radius * this.player.radius;
    var delta = b*b - (4*a*c);

    if(delta < 0){
        return [];
    }else if(delta == 0){

        var u = -b / (2 * a);

        var sol1 = (p1.add(P2minusP1.multiply(u)));
        if((sol1.subtract(p1).mag() + sol1.subtract(p2).mag()) <= (p1.subtract(p2).mag())){
            return [sol1];
        }else{
            return [];
        }
    }else{
        var SquareRootDelta = Math.sqrt(delta);

        var u1 = (-b + SquareRootDelta) / (2 * a);
        var u2 = (-b - SquareRootDelta) / (2 * a);

        var sol1 = p1.add(P2minusP1.multiply(u1));
        var sol2 = p1.add(P2minusP1.multiply(u2));

        if((sol1.subtract(p1).mag() + sol1.subtract(p2).mag()) <= p1.subtract(p2).mag() ||
            ((sol2.subtract(p1).mag() + sol2.subtract(p2).mag()) <= p1.subtract(p2).mag())){
            return [sol1,sol2];
        }else{
            return [];
        }
    }
};

GameEngine.prototype.distancePointVector = function () {

};

GameEngine.prototype.findCurrentFrame = function () {
    for (var i = 0; i < this.map.mapDimensionsTest[this.currentDimension].length; i++) {
        if (this.map.mapDimensionsTest[this.currentDimension][0][1].x < this.player.position.x) {

        } else {
            this.frameCurrentState = i;
            return;
        }
    }
};

GameEngine.prototype.isFloorDown = function () {
    return (this.player.position.x > this.map.mapDimensionsTest[this.currentDimension][0][0].x && this.player.position.x < this.map.mapDimensionsTest[this.currentDimension][0][1].x && this.getFloorPosition() > this.player.position.y);
};

//Se restringe su uso únicamente para cuando es una polilínea actual
GameEngine.prototype.getFloorPosition = function () {
    return ((this.player.position.x - this.map.mapDimensionsTest[this.currentDimension][0][0].x) * this.getFloorSlope()) + this.map.mapDimensionsTest[this.currentDimension][0][0].y
};

//Se restringe su uso únicamente para cuando es una polilínea actual
GameEngine.prototype.getFloorPositionX = function (posY) {
    if (this.getFloorSlope() != 0) {
        return (this.getFloorPosition() - this.map.mapDimensionsTest[this.currentDimension][0][0].y / this.getFloorSlope()) + this.map.mapDimensionsTest[this.currentDimension][0][0].x;
    } else {
        return this.player.position.x;
    }
};

//Se restringe su uso únicamente para cuando es una polilínea actual
GameEngine.prototype.getFloorSlope = function () {
    return (this.map.mapDimensionsTest[this.currentDimension][0][1].y - this.map.mapDimensionsTest[this.currentDimension][0][0].y) / (this.map.mapDimensionsTest[this.currentDimension][0][1].x - this.map.mapDimensionsTest[this.currentDimension][0][0].x);
};

GameEngine.prototype.checkCollision = function () {

};
