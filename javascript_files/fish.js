

function Fish(x,y,dx,dy,radius,id,c,foodarr){


  this.fishLength = 20;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.time = 0;
  this.positions = [];

  let totalSpeed = Math.sqrt(dx*dx + dy*dy)

  this.speed = this.dx * this.dx + this.dy + this.dy;

  this.draw = function(){
    //the tail of the fish




    if (this.positions.length < this.fishLength){
      for (var i = 0 ; i < this.fishLength ; i++){
        this.positions.push([x + i * dx , y + i * dy])
      }
    }


    c.beginPath();
    c.arc(this.positions[0][0],this.positions[0][1], this.radius, 0 ,Math.PI * 2, false);
    c.fillStyle = 'black';
    c.fill();
    c.stroke();


    // the midsection of the fish

    c.beginPath();
    let midpoint = Math.round((this.positions.length /2)+3);


    c.arc (this.positions[midpoint][0],this.positions[midpoint][1], this.radius, 0, Math.PI*2, false);
    c.fillStyle = 'orange';
    c.fill();


    //the head of the fish



    let headAngle = Math.atan(this.dy/this.dx);
    let startAngle = headAngle - (Math.PI/2);

    let cc = true;
    if (this.dx > 0 ){
      cc = false;
    }




    c.beginPath();
    c.arc (this.x, this.y, this.radius, startAngle, startAngle + Math.PI, cc );
    c.fillStyle = 'white';
    c.fill();
    c.stroke();

  }

  function distance(x0,y0,x1,y1){
    return Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2))
  }

  let yDif;
  let xDif;
  let angle;


  this.speedDif = function(initial,desired){
    return Math.abs(initial - desired)/Math.abs(initial);
  }

  this.chaseFood = function() {
    //has access to foodarr
    //first find the piece of food the fish is closest to.

    let turnChange = 0.3;

    //assume that its sorted already...
    yDif = foodarr[0].y - this.y;
    xDif = foodarr[0].x - this.x;
    angle = Math.atan(yDif/xDif);


    let foodDir = 1;
    //adjust the angle!
    if (xDif < 0){
      foodDir = -1;
    }

    this.dfy = totalSpeed * Math.sin(angle) * foodDir;
    this.dfx = totalSpeed * Math.cos(angle) * foodDir;

    //eat the food
    if (distance(this.x,this.y,foodarr[0].x,foodarr[0].y) < 50){
      foodarr.splice(0,1);
    }

    if (this.speedDif(this.dx,this.dfx) < 0.001 ){
      this.dx = this.dfx;
    } else {
      this.dx += turnChange * this.dfx;
    }

    if (this.speedDif(this.dy,this.dfy) < 0.5 ){
      this.dy = this.dfy;
    } else {
      this.dy += turnChange * this.dfy;
    }


  }

  this.record = function(){
    console.log(this.positions.length);
    this.positions.push([this.x,this.y])


    if (this.positions.length > this.fishLength){
      this.positions.shift();
    }
  }

  this.update = function(){

    //first update positions with the fish coordinates


    //deals with collisions

    //try making the motion more smooth

    // if it goes too close to the right boundary and its still moving towards that boundary...
    if (this.x + this.radius > 0.93 * innerWidth){
      //the fish is moving towards the boundary
      if (this.dx > 0){

        if (this.x + this.radius > 0.97 * innerWidth){
          this.dx *= 0.1;
        } else if (this.x + this.radius > 0.95 * innerWidth){
          this.dx *= 0.2;
        } else {
          this.dx *= 0.8;
        }

      }

      if (this.dx < 0 ){
        if (this.x + this.radius > 0.95 * innerWidth){
          this.dx = -1 * 0.1 * dx;
        } else {
          this.dx = -1 * 0.2 * dx;
        }
      }
    }

    if (this.x - this.radius < 0.07 * innerWidth){
      //the fish is moving towards the boundary
      if (this.dx < 0){
        if (this.x - this.radius < 0.03 * innerWidth){
          this.dx *= 0.1;
        } else if (this.x - this.radius < 0.05 * innerWidth) {
          this.dx *= 0.2
        } else {
          this.dx *= 0.8;
        }
      }

      if (this.dx > 0 ){
        if (this.x + this.radius < 0.05 * innerWidth){
          this.dx =  0.1 * dx;
        } else {
          this.dx = 0.2 * dx;
        }
      }
    }

    //vertical boundaries!

    //lower boundary

    if (this.y + this.radius > 0.935 * innerHeight){

      //moving towards the border

      if (Math.abs(this.dy) < 0.1 * dy){
        this.dy = -0.2 * dy;
        this.dx *= 1.5;
      }
      if (this.dy > 0 ){
        if (this.y + this.radius > 0.97 * innerHeight){
          this.dy *= 0.3;
        } else if (this.y + this.radius > 0.95 * innerHeight){
          this.dy *= 0.6;
        } else {
          this.dy *= 0.8;
        }
      }

      if (this.dy < 0 ){
        this.dy *= 1.1;
      }

    }

    //upper boundary

    if (this.y - this.radius < 0.065 * innerHeight){
      if (Math.abs(this.dy) < 0.1 * dy){
        this.dy = 0.5 * dy;
        this.dx *= 1.5;
      }

      if (this.dy < 0 ){
        if (this.y - this.radius < 0.03 * innerHeight){
          this.dy *= 0.3;
        } else if (this.y - this.radius < 0.05 * innerHeight){
          this.dy *= 0.6;
        } else {
          this.dy *= 0.8;
        }
      }

      if (this.dy > 0 ){
        this.dy *= 1.1;
      }


    }




    //once it really hits the edge, it should make a u turn.

    if (this.x + this.radius > 0.98 * innerWidth || this.x - this.radius < 0.02 * innerWidth){
      this.dx = -this.dx;
    }

    if (this.y + this.radius > 0.98 * innerHeight  || this.y - this.radius < 0.02 * innerHeight){
      this.dy = -this.dy;
    }




    //side to side oscillation, based on normal vector and Sin.


  }
  //this is the end of this.update.

  this.calcSpeed = function(xv,yv){
    return Math.sqrt(xv*xv + yv*yv)
  }

  this.controlSpeed = function () {

        //random motion, cuz fish are fish lol.
        this.dx += (this.dx * 0.3) * (Math.random()-0.5)
        this.dx += (this.dy * 0.3) * (Math.random()-0.5)


        if (this.calcSpeed(this.dx,this.dy) > (dx + dy)){
          this.dx *= (1/1.2);
          this.dy *= (1/1.2);
        }

        if (this.calcSpeed(this.dx,this.dy) < 0.7 * (dx + dy )){
          this.dx *= (1/0.7);
          this.dy *= (1/0.7);
        }





        //
        // if (Math.abs(this.dx) < 0.7 * dx){
        //   this.dx *= (1/0.7);
        // }
        //
        // if (Math.abs(this.dy) < 0.7 * dy){
        //   this.dy *= (1/0.7);
        // }
  }

  this.oscillate = function(){
    let ox = -1 * this.dy;
    let oy = this.dx;

    this.time += 0.08;
    let oscillation = 0.295 * Math.sin(this.time);


    this.x += this.dx + oscillation * ox;
    this.y += this.dy + oscillation * oy;
  }



  this.do = function(){


    if (foodarr.length === 0){
      this.update();
    } else {
      this.chaseFood();
    }

    this.record();

    this.controlSpeed();
    this.oscillate();
    this.draw();


  }

}

export default Fish;


// let fish2 = new Fish(150,400,1,1,20,2);
// let fish3 = new Fish(400,400,1,1,20,3);
// let fish4 = new Fish(400,150,1,1,20,4);
