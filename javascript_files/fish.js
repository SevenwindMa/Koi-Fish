

function Fish(x,y,dx,dy,radius,id,c){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.time = 0;
  this.positions = [];

  this.speed = this.dx * this.dx + this.dy + this.dy;


  this.draw = function(){
    c.beginPath();

    //the head of the fish
    c.arc (this.x, this.y, this.radius, 0, Math.PI * 2, false );
    c.arc(this.positions[0][0],this.positions[0][1], this.radius, 0 ,Math.PI * 2, false);

    if(id % 3 === 0){
      c.fillStyle = '#ff3300';
    } else if (id % 3 === 1){
      c.fillStyle = '#0f0e0e';
    } else {
      c.fillStyle = '#dadee5';
    }


    c.strokeStyle = 'black';



    c.fill();
    c.stroke();

  }

  this.update = function(){

    //first update positions with the fish coordinates
    this.positions.push([this.x,this.y])

    if (this.positions.length > 30 / Math.sqrt(this.speed)){
      this.positions.shift();
    }

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
      console.log('dy:', this.dy);
      console.log('this.y', this.y);
      console.log('innerHeight', innerHeight);

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

    let ox = -1 * this.dy;
    let oy = this.dx;

    this.time += 0.08;
    let oscillation = 0.295 * Math.sin(this.time);

    //random motion, cuz fish are fish lol.
    this.dx += (this.dx * 0.2) * (Math.random()-0.5)
    this.dx += (this.dy * 0.2) * (Math.random()-0.5)

    //cant go TOO crazy
    if (Math.abs(this.dx) > 1.5*dx){
      this.dx *= (1/1.5);
    }

    if (Math.abs(this.dy) > 1.5*dy){
      this.dy *= (1/1.5);
    }

    this.x += this.dx + oscillation * ox;
    this.y += this.dy + oscillation * oy;

  }
  //this is the end of this.update.




  this.do = function(){
    this.update();
    this.draw();
  }

}

export default Fish;


// let fish2 = new Fish(150,400,1,1,20,2);
// let fish3 = new Fish(400,400,1,1,20,3);
// let fish4 = new Fish(400,150,1,1,20,4);
