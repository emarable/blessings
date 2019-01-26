function Level(data) {
	this.data = data;
}
Level.prototype.onEnter = function () {  
  this.background = IMAGE[this.data.background].get();
  
  this.camera = {
    x: 0,
    y: 0,
    w: 800,
    h: 800 / ASPECT_RATIO,
  };
  
  // if (!MUSIC.mission.get().isPlaying) {
    // MUSIC.stopAll();
    // MUSIC.play(Game.audioContext, MUSIC.mission.get());
  // }
  
	this.protagonist = new Protagonist();
  this.protagonist.x = this.data.protagonist[0];
  this.protagonist.y = this.data.protagonist[1];
  
  this.walls = [];
  for (var i = 0; i < this.data.walls.length; ++i) {
    this.walls.push(new Wall(this.data.walls[i]));
  }
	
	this.isRunning = true;
};
Level.prototype.step = function (elapsed) {
	if (this.isRunning) {
		this.protagonist.step(elapsed);
    
    this.camera.x = Math.max(0,Math.min(this.data.width - this.camera.w, this.protagonist.x - this.camera.h / 2));
    this.camera.y = Math.max(0,Math.min(this.data.height - this.camera.h, this.protagonist.y - this.camera.h / 2));
	}
};
Level.prototype.draw = function (ctx) {
  ctx.drawImage(this.background, 
    this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
    0, 0, Game.WIDTH, Game.HEIGHT);
  
  this.walls.forEach(function (wall) {
    wall.draw(ctx, this.camera.x, this.camera.y);
  });
  
	//this.background.draw(ctx);
	this.protagonist.draw(ctx, this.camera);
};
Level.prototype.keydown = function (ev) {
	this.protagonist.keydown(ev);
};
Level.prototype.keyup = function (ev) {
	this.protagonist.keyup(ev);
};

Level.prototype.pointCollide = function (x, y, filter) {
  return filter.find(function (obj) {
    var l = obj.x + obj.mask.left;
    var r = obj.x + obj.mask.right;
    var t = obj.y + obj.mask.top;
    var b = obj.y + obj.mask.bottom;
    return (x >= l && x <= r && y >= t && y <= b);
  });
};

function checkCollision(obj1, obj2) {
	var l1 = obj1.x + obj1.mask.left;
	var r1 = obj1.x + obj1.mask.right;
	var l2 = obj2.x + obj2.mask.left;
	var r2 = obj2.x + obj2.mask.right;
	if (l1 < r2 && l2 < r1) {
		var t1 = obj1.y + obj1.mask.top;
		var b1 = obj1.y + obj1.mask.bottom;
		var t2 = obj2.y + obj1.mask.top;
		var b2 = obj2.y + obj1.mask.bottom;
		if (t1 < b2 && t2 < b1) {
			return true;
		}
	}
	return false;
};

var levels = [];
levels[0] = new Level({
  width: 1200,
  height: 2000,
  background: 'bgLevel1',
  walls: [],
  protagonist: [100,0],
});

function Wall(data) {
  this.x = data[0] * 16 + 8;
  this.y = data[1] * 16 + 8;
  switch(data[2]) {
    //case 1: this.image = IMAGE.wallGrass.get(); break;
    default: this.image = null;
  }
	this.mask = {
		left: -8,
		top: -8,
		right: 8,
		bottom: 8
	};
}
Wall.prototype.draw = function (ctx, cameraX, cameraY) {
  if (this.image) {
    var tx = (Math.floor(this.x - cameraX) - 8) * 2;
    var ty = (Math.floor(this.y - cameraY) - 8) * 2;
    ctx.drawImage(this.image, 
      (0) * 16, 0, 16, 16, 
      tx, ty, 32, 32);
  }
}