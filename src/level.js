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
  this.protagonist.x = this.data.protagonist[0] * 16 + 8;
  this.protagonist.y = this.data.protagonist[1] * 16 + 8;
  
  this.walls = [];
  for (var i = 0; i < this.data.walls.length; ++i) {
    this.walls.push(new Wall(this.data.walls[i]));
  }
	
	this.isRunning = true;
};
Level.prototype.step = function (elapsed) {
	if (this.isRunning) {
		this.protagonist.step(elapsed);
	}
};
Level.prototype.draw = function (ctx) {
  ctx.drawImage(this.background, 
    this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
    0, 0, Game.WIDTH, Game.HEIGHT);
  
  var cameraX = Math.max(0,Math.min(this.data.width - 320, this.protagonist.x - 160));
  var cameraY = Math.max(0,Math.min(this.data.height - 240, this.protagonist.y - 120));
  
  ctx.fillStyle = "black";
	ctx.fillText('('+cameraX+','+cameraY+')', 0, 0);
  
  
  this.walls.forEach(function (wall) {
    wall.draw(ctx, cameraX, cameraY);
  });
  
	//this.background.draw(ctx);
	this.protagonist.draw(ctx, cameraX, cameraY);
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
  width: 1000,
  height: 480,
  background: 'bgLevel1',
  walls: [
    [0,0,0], [0,1,0], [0,2,0], [0,3,0], [0,4,0], [0,5,0], [0,6,0], [0,7,0],
    [0,8,0], [0,9,0], [0,10,0], [0,11,0], [0,12,0], [0,13,0], [0,14,0], [0,15,0],
    [0,16,0], [0,17,0], [0,18,0], [0,19,0], [0,20,0], [0,21,0], [0,22,0], [0,23,0],
    [0,24,0], [0,25,0], [0,26,0], [0,27,0], 
    [0,28,1], [1,28,1], [2,28,1], [3,28,1], [4,28,1], [5,28,1], [6,28,1], [7,28,1], 
    [0,29,1], [1,29,1], [2,29,1], [3,29,1], [4,29,1], [5,29,1], [6,29,1], [7,29,1],
  ],
  protagonist: [1,27],
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