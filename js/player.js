/**
 * Created by Shiraishi Kakuya on 30/12/2016.
 */


function Player(){


    this.levitationMax = 13;
    this.levitationMin = 7;
    this.levitationTime = 100;
    this.levitationPos = 0;
    this.levitationDir = 1;

    //this.startposition=new Vector2D(6200,586);
    //this.startposition=new Vector2D(9500,1282);
    //this.startposition=new Vector2D(9500,1282);
    //this.startposition=new Vector2D(23100,318);


    this.startposition=new Vector2D(15,10);

    this.setup();

    Player.prototype.levitate = function(t){
        this.levitationPos = this.levitationPos + (t/this.levitationTime)*this.levitationDir;
        if(this.levitationPos > this.levitationMax){
            this.levitationDir = -1;
        }else if(this.levitationPos < this.levitationMin){
            this.levitationDir = 1;
        }
    };



}

Player.prototype.setup=function() {
    this.position = this.startposition.clone();
    this.previousPosition = this.position.clone();
    this.VELOCITY = new Vector2D(12,0);
    this.velocity = this.VELOCITY.clone();
    this.radius = 10;
    this.GRAVITY = 9.8;
    this.gravity = this.GRAVITY;
};

Player.prototype.restart=function(){
  this.setup();
};