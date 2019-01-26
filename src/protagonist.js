function Protagonist() {
	this.x = 0;
	this.y = 0;
  this.state = "standing";
  this.facing = 1;
  this.animationFrame = 0;
  this.hSpeed = 0;
  this.vSpeed = 0;
	this.mask = {
		left: -8,
		top: -8,
		right: 8,
		bottom: 8
	};
	this.keys = {
		left: false,
		right: false,
		up: false,
		down: false,
		jump: false
	};
  this.control = true;
  
  this.acceleration = 0.25;
  this.maxSpeed = 8;
  this.jump = 8;
}
Protagonist.prototype.step = function (elapsed) {
  var xPrevious = this.x;
  var yPrevious = this.y;
  this.x += this.hSpeed;
  this.y += this.vSpeed;
  
	if (this.control) {
		if (this.keys.left) {
      if (this.hSpeed > -this.maxSpeed) {
        this.hSpeed -= this.acceleration;
      }
      this.state = "running";
      this.facing = 0;
    } else if (this.keys.right) {
      if (this.hSpeed < this.maxSpeed) {
        this.hSpeed += this.acceleration;
      }
      this.state = "running";
      this.facing = 1;
    } else {
      if (this.hSpeed < -this.acceleration) { this.hSpeed += this.acceleration; }
      else if (this.hSpeed > this.acceleration) { this.hSpeed -= this.acceleration; }
      else { this.hSpeed = 0; this.state = "standing"; }
    }
    
    var wallDown = Game.ui.pointCollide(this.x,this.y+8,Game.ui.walls);
    var wallLeft = Game.ui.pointCollide(this.x - 8,this.y,Game.ui.walls);
    var wallRight = Game.ui.pointCollide(this.x + 8,this.y,Game.ui.walls);
    var wallUp = Game.ui.pointCollide(this.x,this.y-8,Game.ui.walls);
    
    if (wallDown) {
      this.y = wallDown.y - 16;
      this.vSpeed = Math.min(this.vSpeed,0);
      if (this.vSpeed >= 0) { this.jump = 8; }
    } else {
      //wallDown = collision_line(x,y+8,x,yprevious+8,OB_Wall,false,true);
      if (wallDown) {
        this.y = wallDown.y - 16;
        this.vSpeed = Math.min(this.vSpeed,0);
        if (this.vSpeed >= 0) { this.jump = 8; }
      }
      
      this.state = "falling";
      this.vSpeed += this.acceleration;
    }
    if (wallLeft) {
      this.x = wallLeft.x + 16;
      this.hSpeed = Math.max(this.hSpeed,0);
    }
    if (wallRight) {
      this.x = wallRight.x - 16;
      this.hSpeed = Math.min(this.hSpeed,0);
    }
    if (wallUp) {
      this.y = wallUp.y + 16;
      this.vSpeed = Math.max(this.vSpeed,0);
    }
   
    if (this.keys.jump && this.jump > 0) {
      this.vSpeed -= 3*this.acceleration;
      this.jump -= 1;
      this.state = "falling";
    } else if (!wallDown) {
      this.jump = 0;
    }
	}
}
Protagonist.prototype.draw = function (ctx, cameraX, cameraY) {
	// Character
  var hFrame = 0;
  if (this.state === "standing") {
    hFrame = 0;
  } else if (this.state == "running") {
    this.animationFrame += Math.abs(this.hSpeed);
    if (this.animationFrame < 30) {
      hFrame = 1;
    } else if (this.animationFrame < 60) {
      hFrame = 2;
    } else {
      hFrame = 2;
      this.animationFrame = 0;
    }
  } else if (this.state = "falling") {
    if (this.vSpeed < 0) { hFrame = 4; }
    else { hFrame = 3; }
  }
  var vFrame = (this.facing === 1 ? 0 : 1);
  
  var tx = (Math.floor(this.x - cameraX) - 8) * 2;
  var ty = (Math.floor(this.y - cameraY) - 8) * 2;
	ctx.drawImage(IMAGE.edward.get(), 
    hFrame * 16, vFrame * 16, 16, 16, 
    tx, ty, 32, 32);
    
  ctx.fillStyle = "black";
	ctx.fillText('('+this.x+','+this.y+')', tx, ty - 16);
}
Protagonist.prototype.keydown = function (ev) {
	switch(ev.keyCode) {
		case 37: // Key Left
			this.keys.left = true; break;
		case 38: // Key Up
			this.keys.up = true; break;
		case 39: // Key Right
			this.keys.right = true; break;
		case 40: // Key Down
			this.keys.down = true; break;
		case 90: // Key Z
			this.keys.jump = true; break;
	}
}
Protagonist.prototype.keyup = function (ev) {
	switch(ev.keyCode) {
		case 37: // Key Left
			this.keys.left = false; break;
		case 38: // Key Up
			this.keys.up = false; break;
		case 39: // Key Right
			this.keys.right = false; break;
		case 40: // Key Down
			this.keys.down = false; break;
		case 90: // Key Z
			this.keys.jump = false; break;
	}
}
