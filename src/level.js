function Level(data) {
	this.data = data;
}
Level.prototype.onEnter = function () {  
  this.background = IMAGE[this.data.background].get();
  this.foreground = IMAGE[this.data.foreground].get();
  this.lighting = IMAGE[this.data.lighting].get();
  
  this.camera = {
    x: 0,
    y: 0,
    w: 800,
    h: 800 / ASPECT_RATIO,
  };
     
  if (!MUSIC.level1.get().isPlaying) {
    MUSIC.stopAll();
    MUSIC.play(MUSIC.level1.get());
  }
  
	this.protagonist = new Protagonist();
  this.protagonist.x = this.data.protagonist[0];
  this.protagonist.y = this.data.protagonist[1];
  
  var level = this;
  function initObjects(constructor, name) {
    level[name] = [];
    for (var i = 0; i < level.data[name].length; ++i) {
      level[name].push(
        new (Function.prototype.bind.apply(
          constructor, [constructor, level.data[name][i]]
        ))
      );
    }
  }
  
  initObjects(StaticBox, 'walls');
  initObjects(StaticBox, 'platforms');
  initObjects(StaticBox, 'waters');
  initObjects(StaticBox, 'climbs');
  initObjects(StaticBox, 'cutscenes');
  initObjects(Doodad, 'doodads');
  
  this.dynamic = [];
  for (var i = 0; i < this.data.dynamic.length; ++i) {
    this.dynamic.push(
      new (Function.prototype.bind.apply(
        this.data.dynamic[i][0],
        [this.data.dynamic[i][0], this.data.dynamic[i].slice(1)]
      ))
    );
  }
  	
	this.isRunning = true;
  this.isComplete = false;
  this.activeCutscene = null;
  this.delay = 0;
};
Level.prototype.step = function (elapsed) {
	if (this.isRunning) {
		this.protagonist.step(elapsed);
    
    for (var i = 0; i < this.dynamic.length; ++i) {
      this.dynamic[i].step(elapsed);
    }
    
    this.camera.x = Math.max(0,Math.min(this.data.width - this.camera.w, this.protagonist.x - this.camera.h / 2));
    this.camera.y = Math.max(0,Math.min(this.data.height - this.camera.h, this.protagonist.y - this.camera.h / 2));
	}
  if (this.activeCutscene) {
    this.activeCutscene.step(elapsed);
  }
  if (this.isComplete) {
    this.delay += 1;
    if (this.delay > 300) {
      Game.setState(MainMenu);
    }
  }
};
Level.prototype.draw = function (ctx) {
  ctx.drawImage(this.background, 
    this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
    0, 0, Game.WIDTH, Game.HEIGHT);
  
	this.protagonist.draw(ctx, this.camera);
    
  for (var i = 0; i < this.doodads.length; ++i) {
    this.doodads[i].draw(ctx, this.camera);
  }
  
  ctx.drawImage(this.foreground, 
    this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
    0, 0, Game.WIDTH, Game.HEIGHT);
    
  for (var i = 0; i < this.dynamic.length; ++i) {
    this.dynamic[i].draw(ctx, this.camera);
  }
        
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(this.lighting, 
    this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
    0, 0, Game.WIDTH, Game.HEIGHT);
  ctx.globalCompositeOperation = 'source-over';
  
  var camera = this.camera;
  this.walls.concat(this.platforms)
    .concat(this.waters)
    .concat(this.climbs)
    .concat(this.cutscenes)
    .forEach(function (w) {
      w.draw(ctx,camera);
    });
    
  if (this.activeCutscene) {
    this.activeCutscene.draw(ctx, camera);
  }
    
  if (this.isComplete && this.delay > 60) {
    ctx.globalAlpha = (this.delay - 60) / 240;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0,0,Game.WIDTH, Game.HEIGHT);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
};
Level.prototype.keydown = function (ev) {
	this.protagonist.keydown(ev);
  if (this.activeCutscene) {
    this.activeCutscene.keydown(ev);
  }
};
Level.prototype.keyup = function (ev) {
	this.protagonist.keyup(ev);
  if (this.activeCutscene) {
    this.activeCutscene.keyup(ev);
  }
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
Level.prototype.boxCollide = function (left, top, right, bottom, filter) {
  return filter.find(function (obj) {
    var l = obj.x + obj.mask.left;
    var r = obj.x + obj.mask.right;
    var t = obj.y + obj.mask.top;
    var b = obj.y + obj.mask.bottom;
        
    return (right >= l && left <= r && bottom >= t && top <= b);
  });  
};

Level.prototype.complete = function () {
  this.isComplete = true;
  this.delay = 0;
};
Level.prototype.cutscene = function (trigger) {
  this.activeCutscene = cutscenes[trigger.data.cutscene];
  this.activeCutscene.start();
  this.cutscenes.splice(this.cutscenes.indexOf(trigger));
};
Level.prototype.endCutscene = function () {
  this.activeCutscene = null;
  this.protagonist.control = true;
};

var levels = [];
levels[0] = new Level({
  width: 1200,
  height: 2000,
  background: 'bgLevel1',
  foreground: 'fgLevel1',
  lighting: 'ltLevel1',
  music: 'level1',
  walls: [
    [880,1800,100,100],
    [860,1820,400,100],
    [0,1880,520,100],
  ],
  platforms: [
    [940,1600,100,10],
    [590,1640,60,10],
    [550,1600,60,10],
    [480,1570,100,10],
    [470,1460,80,10],
    // L2
    [0,1300,500,10],
    [800,1340,500,10],
    // Rock
    [140,1160,140,10],
    [80,1080,80,10],
    [30,990,60,10],
    // Big leaf 1
    [350,730,220,10],
    // Leaves
    [280,520,130,10],
    [380,290,150,10],
    [140,120,150,10],
    // Big leaf 2
    [640,560,160,10],
    [790,400,160,10],
  ],
  waters: [
    [0,1910,1200,90],
  ],
  climbs: [
    [750,1480,20,300],
    [110,800,50,50],
  ],
  dynamic: [
    [BigLeaf,'leaf1Level1',250,700,100,10,220,40],
    [BigLeaf,'leaf2Level1',578,305,62,235,160,40],
  ],
  doodads: [
    ['squirrel',300,1700],
  ],
  cutscenes: [
    [200,1600,10, 300, {cutscene: 0}],
  ],
  protagonist: [100,1800],
  //protagonist: [440,200],
});

function StaticBox(data) {
  this.x = data[0];
  this.y = data[1];
  this.mask = {
    left: 0,
    top: 0,
    right: data[2],
    bottom: data[3],
  };
  this.data = data[4];
}
StaticBox.prototype.draw = function (ctx, camera) {
  var tx = (Math.floor(this.x - camera.x) + this.mask.left) / camera.w * Game.WIDTH;
  var ty = (Math.floor(this.y - camera.y) + this.mask.top) / camera.h * Game.HEIGHT;
  
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.rect(tx, ty, (this.mask.right - this.mask.left) / camera.w * Game.WIDTH, (this.mask.bottom - this.mask.top) / camera.h * Game.HEIGHT);
  ctx.stroke();
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function Doodad(data) {
  this.image = IMAGE[data[0]].get();
  this.x = data[1];
  this.y = data[2];
}
Doodad.prototype.draw = function (ctx, camera) {
  var tx = (this.x-camera.x) / camera.w * Game.WIDTH;
  var ty = (this.y-camera.y) / camera.h * Game.HEIGHT;
  var tw = this.image.width / camera.w * Game.WIDTH;
  var th = this.image.height / camera.h * Game.HEIGHT;
  
  ctx.drawImage(this.image, 
    0, 0, this.image.width, this.image.height, 
    tx, ty, tw, th);
}

function BigLeaf(data) {
  this.image = IMAGE[data[0]].get();
  this.x = data[1];
  this.y = data[2];
  this.mask = {
    left: data[3],
    top: data[4],
    right: data[3] + data[5],
    bottom: data[4] + data[6],
  };
  this.baseY = data[2];
  this.touch = 0;
  
  this.vSpeed = 0;
  this.elasticity = 0.2;
  this.friction = 0.2;
  this.clamp = 5;
}
BigLeaf.prototype.step = function (elapsed) {
  var held = Game.ui.boxCollide(
    this.x + this.mask.left, 
    this.baseY + this.mask.top,
    this.x + this.mask.right,
    this.baseY + this.mask.bottom,
    [Game.ui.protagonist]
  );
  
  var targetY = this.baseY;
  
  
  if (held) { targetY = Game.ui.protagonist.y + Game.ui.protagonist.mask.bottom - this.mask.top; }
  this.vSpeed += (targetY - this.y) * this.elasticity;
  
  this.y += this.vSpeed;
  if (this.vSpeed > this.friction) {
    this.vSpeed -= this.friction;
  } else if (this.vSpeed < this.friction) {
    this.vSpeed += this.friction;
  } else {
    this.vSpeed = 0;
  }
  
  this.vSpeed = Math.min(this.clamp, Math.max(-this.clamp, this.vSpeed));
};
BigLeaf.prototype.draw = function (ctx, camera) {
  var tx = (this.x-camera.x) / camera.w * Game.WIDTH;
  var ty = (this.y-camera.y) / camera.h * Game.HEIGHT;
  var tw = this.image.width / camera.w * Game.WIDTH;
  var th = this.image.height / camera.h * Game.HEIGHT;
  
  ctx.drawImage(this.image, 
    0, 0, this.image.width, this.image.height, 
    tx, ty, tw, th);
    
  // tx = (Math.floor(this.x - camera.x) + this.mask.left) / camera.w * Game.WIDTH;
  // ty = (Math.floor(this.y - camera.y) + this.mask.top) / camera.h * Game.HEIGHT;
    
  // ctx.beginPath();
  // ctx.strokeStyle = 'white';
  // ctx.fillStyle = 'white';
  // ctx.rect(tx, ty, (this.mask.right - this.mask.left) / camera.w * Game.WIDTH, (this.mask.bottom - this.mask.top) / camera.h * Game.HEIGHT);
  // ctx.stroke();
  // ctx.globalAlpha = 0.2;
  // ctx.fill();
  // ctx.globalAlpha = 1;
}