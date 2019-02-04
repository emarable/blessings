function Protagonist() {
	this.x = 0;
	this.y = 0;
  this.state = "standing";
  this.facing = 1;
  this.animationFrame = 0;
  this.hSpeed = 0;
  this.vSpeed = 0;
  
  this.width = 80;
  this.height = 160;
  this.offset = {
    left: -100,
    right: -170,
    top: -240,
    bottom: 100,
  };
	this.mask = {
		left: -this.width/2,
		top: -this.height/2,
		right: this.width/2,
		bottom: this.height/2
	};
	this.keys = {
		left: false,
		right: false,
		up: false,
		down: false,
		jump: false
	};
  this.active = true;
  this.control = true;
  
  this.isClimbing = true;
  this.isOnGround = true;
  
  this.acceleration = 1;
  this.maxSpeed = 6;
  this.maxJump = 8;
  this.jump = 8;
  this.climbSpeed = 3;
  
  this.animFrame = 0;
  this.animSpeed = 0.1;
}
Protagonist.assets = function () {
  return [
    IMAGE.protagonistIdle1Left,
    IMAGE.protagonistIdle2Left,
    IMAGE.protagonistIdle3Left,
    IMAGE.protagonistIdle1Right,
    IMAGE.protagonistIdle2Right,
    IMAGE.protagonistIdle3Right,
    IMAGE.protagonistMove1Left,
    IMAGE.protagonistMove2Left,
    IMAGE.protagonistMove3Left,
    IMAGE.protagonistMove4Left,
    IMAGE.protagonistMove1Right,
    IMAGE.protagonistMove2Right,
    IMAGE.protagonistMove3Right,
    IMAGE.protagonistMove4Right,
    IMAGE.protagonistRise1Left,
    IMAGE.protagonistRise2Left,
    IMAGE.protagonistRise1Right,
    IMAGE.protagonistRise2Right,
    IMAGE.protagonistFall1Left,
    IMAGE.protagonistFall2Left,
    IMAGE.protagonistFall1Right,
    IMAGE.protagonistFall2Right,
    SOUND.water,
    SOUND.landing,
  ];
};
Protagonist.prototype.step = function (elapsed) {
  if (this.active) {
    this.animFrame += this.animSpeed;
      
    var xPrevious = this.x;
    var yPrevious = this.y;
    this.x += this.hSpeed;
    this.y += this.vSpeed;
    
    var currentMaxSpeed = this.maxSpeed;
    var currentAcceleration = this.acceleration;
    var currentMaxJump = this.maxJump;
    
    var cutscene = this.collide(Game.ui.cutscenes)
    if (cutscene) {
      this.control = false;
       Game.ui.cutscene(cutscene);
    }
    
    if (this.collide(Game.ui.waters)) {
      this.water = true;
      currentMaxSpeed = this.maxSpeed / 3;
      currentAcceleration = this.acceleration / 3;
      currentMaxJump = this.maxJump * 3;
      
      if (this.hSpeed > currentMaxSpeed) this.hSpeed -= currentAcceleration;
      if (this.hSpeed < -currentMaxSpeed) this.hSpeed += currentAcceleration;
      if (this.vSpeed > currentMaxSpeed) this.vSpeed -= currentAcceleration;
      if (this.vSpeed < -currentMaxSpeed) this.vSpeed += currentAcceleration;
      
      if ((this.hSpeed !== 0 || this.vSpeed !== 0) && !SOUND.water.get().isPlaying) {
        SOUND.play(SOUND.water.get());
      }
    } else {
      this.water = false;
    }
    
    if (this.collide(Game.ui.climbs)) {
      this.isClimbing = true;
      this.jump = this.maxJump
      
      for (var i = 0; i < 4; ++i) {
        if (this.vSpeed > this.climbSpeed) this.vSpeed -= currentAcceleration;
      }
      if (this.vSpeed < -this.climbSpeed) this.vSpeed += currentAcceleration;
    } else {
      this.isClimbing = false;
    }
    
    var wallDown = Game.ui.boxCollide(
      this.x + this.mask.left + this.maxSpeed, 
      this.y + this.mask.bottom,
      this.x + this.mask.right - this.maxSpeed,
      this.y + this.mask.bottom,
      Game.ui.walls.concat(Game.ui.platforms)
    );
    var wallLeft = Game.ui.pointCollide(
      this.x + this.mask.left,
      this.y,
      Game.ui.walls
    );
    var wallRight = Game.ui.pointCollide(
      this.x + this.mask.right,
      this.y,
      Game.ui.walls
    );
    var wallUp = Game.ui.pointCollide(
      this.x,
      this.y+this.mask.top,
      Game.ui.walls
    );
    
    if (this.y + this.offset.bottom < 0) {
      this.active = false;
      return Game.ui.complete();
    }
    
    if (this.x + this.mask.left <= 0) {
      wallLeft = {x: 0, mask: {right: 0}}
    }
    if (this.x + this.mask.right >= Game.ui.data.width) {
      wallRight = {x: Game.ui.data.width, mask: {left: 0}}
    }
    if (this.y + this.mask.bottom >= Game.ui.data.height) {
      wallDown = {y: Game.ui.data.height}
    }
    
    if (wallDown) {
      if ((this.vSpeed > 0) && !SOUND.landing.get().isPlaying) {
        SOUND.play(SOUND.landing.get());
      }
      
      this.y = wallDown.y - this.mask.bottom;
      this.vSpeed = Math.min(this.vSpeed,0);
      if (this.vSpeed >= 0) { this.jump = currentMaxJump; }
      this.isOnGround = true;
    } else {
      wallDown = Game.ui.boxCollide(
        this.x + this.mask.left + this.maxSpeed, 
        yPrevious + this.mask.bottom,
        this.x + this.mask.right - this.maxSpeed,
        this.y + this.mask.bottom,
        Game.ui.walls.concat(Game.ui.platforms)
      );
      //wallDown = collision_line(x,y+8,x,yprevious+8,OB_Wall,false,true);
      if (wallDown) {
        if ((this.vSpeed > 0) && !SOUND.landing.get().isPlaying) {
          SOUND.play(SOUND.landing.get());
        }
        
        this.y = wallDown.y - this.mask.bottom;
        this.vSpeed = Math.min(this.vSpeed,0);
        if (this.vSpeed >= 0) { this.jump = currentMaxJump; }
        this.isOnGround = true;
      } else {
        this.state = "falling";
        this.vSpeed += currentAcceleration;
        this.isOnGround = false;
      }
    }
    if (wallLeft) {
      this.x = wallLeft.x + wallLeft.mask.right - this.mask.left;
      this.hSpeed = Math.max(this.hSpeed,0);
    }
    if (wallRight) {
      this.x = wallRight.x + wallRight.mask.left - this.mask.right;
      this.hSpeed = Math.min(this.hSpeed,0);
    }
    if (wallUp) {
      this.y = wallUp.y - this.mask.top;
      this.vSpeed = Math.max(this.vSpeed,0);
    }
   
    if (this.control) {
      if (this.isClimbing) {
        if (this.keys.up) this.vSpeed = -this.climbSpeed;
        if (this.keys.down) this.vSpeed = this.climbSpeed;
        if (this.keys.left) this.hSpeed = -this.climbSpeed;
        else if (this.keys.right) this.hSpeed = this.climbSpeed;
        else {
          if (this.hSpeed < -currentAcceleration) { this.hSpeed += currentAcceleration; }
          else if (this.hSpeed > currentAcceleration) { this.hSpeed -= currentAcceleration; }
          else { this.hSpeed = 0; }
        }
      } else {
        if (this.keys.left) {
          if (this.hSpeed > -currentMaxSpeed) {
            this.hSpeed -= currentAcceleration;
          }
          this.state = "running";
          this.facing = 0;
        } else if (this.keys.right) {
          if (this.hSpeed < currentMaxSpeed) {
            this.hSpeed += currentAcceleration;
          }
          this.state = "running";
          this.facing = 1;
        } else {
          if (this.hSpeed < -currentAcceleration) { this.hSpeed += currentAcceleration; }
          else if (this.hSpeed > currentAcceleration) { this.hSpeed -= currentAcceleration; }
          else { this.hSpeed = 0; this.state = "standing"; }
        }
      
        if (this.keys.up && this.jump > 0 && this.state !== "climbing") {
          this.vSpeed -= 3*currentAcceleration;
          this.jump -= 1;
          this.state = "falling";
        } else if (!wallDown) {
          this.jump = 0;
        }
      }
    } else {
      if (this.hSpeed < -currentAcceleration) { this.hSpeed += currentAcceleration; }
      else if (this.hSpeed > currentAcceleration) { this.hSpeed -= currentAcceleration; }
      else { this.hSpeed = 0; this.state = "standing"; }
    }    
  }
}
Protagonist.prototype.draw = function (ctx, camera) {
  if (this.facing === 1) {
    var frame = IMAGE.protagonistIdle1Right.get();
    if (!this.isOnGround) {
      if (this.vSpeed < 0) {
        switch(Math.floor(this.animFrame) % 2) {
          case 0: frame = IMAGE.protagonistRise1Right.get(); break;
          case 1: frame = IMAGE.protagonistRise2Right.get(); break;
        }
      } else {
        switch(Math.floor(this.animFrame) % 2) {
          case 0: frame = IMAGE.protagonistFall1Right.get(); break;
          case 1: frame = IMAGE.protagonistFall2Right.get(); break;
        }
      }
    } else if (this.state === "standing") {
      switch(Math.floor(this.animFrame) % 3) {
        case 0: frame = IMAGE.protagonistIdle1Right.get(); break;
        case 1: frame = IMAGE.protagonistIdle2Right.get(); break;
        case 2: frame = IMAGE.protagonistIdle3Right.get(); break;
      }
    } else if (this.state === "running") {
      switch(Math.floor(this.animFrame) % 4) {
        case 0: frame = IMAGE.protagonistMove1Right.get(); break;
        case 1: frame = IMAGE.protagonistMove2Right.get(); break;
        case 2: frame = IMAGE.protagonistMove3Right.get(); break;
        case 3: frame = IMAGE.protagonistMove4Right.get(); break;
      }
    } else {
      frame = IMAGE.protagonistIdle1Right.get();
    }
  } else {
    var frame = IMAGE.protagonistIdle1Left.get();
    if (!this.isOnGround) {
      if (this.vSpeed < 0) {
        switch(Math.floor(this.animFrame) % 2) {
          case 0: frame = IMAGE.protagonistRise1Left.get(); break;
          case 1: frame = IMAGE.protagonistRise2Left.get(); break;
        }
      } else {
        switch(Math.floor(this.animFrame) % 2) {
          case 0: frame = IMAGE.protagonistFall1Left.get(); break;
          case 1: frame = IMAGE.protagonistFall2Left.get(); break;
        }
      }
    } else if (this.state === "standing") {
      switch(Math.floor(this.animFrame) % 3) {
        case 0: frame = IMAGE.protagonistIdle1Left.get(); break;
        case 1: frame = IMAGE.protagonistIdle2Left.get(); break;
        case 2: frame = IMAGE.protagonistIdle3Left.get(); break;
      }
    } else if (this.state === "running") {
      switch(Math.floor(this.animFrame) % 4) {
        case 0: frame = IMAGE.protagonistMove1Left.get(); break;
        case 1: frame = IMAGE.protagonistMove2Left.get(); break;
        case 2: frame = IMAGE.protagonistMove3Left.get(); break;
        case 3: frame = IMAGE.protagonistMove4Left.get(); break;
      }
    } else {
      frame = IMAGE.protagonistIdle1Left.get();
    }
  }
 
  var offsetX = (this.facing === 1 ? this.offset.right : this.offset.left);
  var tx = (Math.floor(this.x - camera.x) + offsetX) / camera.w * Game.WIDTH;
  var ty = (Math.floor(this.y - camera.y) + this.offset.top) / camera.h * Game.HEIGHT;
  var tw = frame.width / camera.w * Game.WIDTH;
  var th = frame.height / camera.h * Game.HEIGHT;
  
  ctx.drawImage(frame, 
    0, 0, frame.width, frame.height, 
    tx, ty, tw, th);
 
  //Comments here
  if (Game.DEBUG) {
    tx = (Math.floor(this.x - camera.x) + this.mask.left) / camera.w * Game.WIDTH;
    ty = (Math.floor(this.y - camera.y) + this.mask.top) / camera.h * Game.HEIGHT;
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.rect(tx, ty, (this.mask.right - this.mask.left) / camera.w * Game.WIDTH, (this.mask.bottom - this.mask.top) / camera.h * Game.HEIGHT);
    ctx.stroke();
    ctx.globalAlpha = 0.2;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "black";
    ctx.fillText('('+this.x+','+this.y+')', tx, ty - 16);
  }
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

Protagonist.prototype.collide = function (filter) {
  return Game.ui.boxCollide(
    this.x + this.mask.left, 
    this.y + this.mask.top,
    this.x + this.mask.right,
    this.y + this.mask.bottom,
    filter
  );
}
