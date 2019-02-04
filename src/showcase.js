function Showcase(data) {
	this.data = data;
}
Showcase.prototype.onEnter = function () {  
  this.background = IMAGE[this.data.background].get();
  if (this.data.foreground) {
    this.foreground = IMAGE[this.data.foreground].get();
  }
  this.music = MUSIC[this.data.music].get();
  
  this.camera = {
    x: 0,
    y: 0,
    w: this.background.width,
    h: this.background.width / ASPECT_RATIO,
  };
  
  this.startY = this.background.height - this.camera.h;
  this.camera.y = this.startY;
     
  if (!this.music.isPlaying) {
    MUSIC.stopAll();
    MUSIC.play(this.music);
  }
  	
	this.isRunning = false;
  this.isComplete = false;
  this.delay = 0;
  this.fadeIn = true;
  this.length = 1200;
};
Showcase.prototype.step = function (elapsed) {
	if (this.isRunning) {
    this.delay += 1;
    if (this.delay >= this.length) {
      this.camera.y = 0;
      this.isComplete = true;
      this.delay = 0;
      this.isRunning = false;
    } else {
      var y1 = this.startY;
      var y2 = 0;
      var t = this.delay / this.length;
      var t2 = (1-Math.cos(t*Math.PI))/2;
      this.camera.y = y1 * (1-t2) + y2 * t2;
    }
  }
  if (this.isComplete) {
    this.delay += 1;
    MUSIC.fade(1 - this.delay / 60);
    if (this.delay >= 60) {
      MUSIC.fade(0);
      Game.setState(this.data.nextState());
    }
  }
  if (this.fadeIn) {
    this.delay += 1;
    MUSIC.fade(this.delay / 60);
    if (this.delay >= 60) {
      MUSIC.fade(1);
      this.fadeIn = false;
      this.delay = 0;
      this.isRunning = true;
    }
  }
};
Showcase.prototype.draw = function (ctx) {
  ctx.drawImage(this.background, 
    this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
    0, 0, Game.WIDTH, Game.HEIGHT);
    
  if (this.foreground) {
    ctx.drawImage(this.foreground, 
      this.camera.x, this.camera.y, this.camera.w, this.camera.h, 
      0, 0, Game.WIDTH, Game.HEIGHT);
  }
      
  if (this.isComplete) {
    ctx.globalAlpha = this.delay / 60;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0,0,Game.WIDTH, Game.HEIGHT);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (this.fadeIn) {
    ctx.globalAlpha = 1 - (this.delay) / 60;
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect(0,0,Game.WIDTH, Game.HEIGHT);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
};

Showcase.prototype.init = function() { return this.data.init(); }

var showcases = [];
showcases[0] = new Showcase({
  width: 1200,
  height: 3000,
  background: 'bgLevel2',
  music: 'level2',
  init: function () {
    var init = Game.loader.require(
      IMAGE.bgLevel2,
      MUSIC.level2,
    );
    init.onComplete = function () { Game.setState(showcases[0]); };
    return init;
  },
  nextState: function () { return showcases[1].init(); }
});
showcases[1] = new Showcase({
  width: 1200,
  height: 3000,
  background: 'bgLevel3',
  foreground: 'ocelot',
  music: 'level2',
  init: function () {
    var init = Game.loader.require(
      IMAGE.bgLevel3,
      IMAGE.ocelot,
      MUSIC.level2,
    );
    init.onComplete = function () { Game.setState(showcases[1]); };
    return init;
  },
  nextState: function () { return levels[3].init(); }
});
showcases[2] = new Showcase({
  width: 1200,
  height: 3000,
  background: 'bgLevel4',
  music: 'level4',
  init: function () {
    var init = Game.loader.require(
      IMAGE.bgLevel4,
      MUSIC.level4,
    );
    init.onComplete = function () { Game.setState(showcases[2]); };
    return init;
  },
  nextState: function () { return Ending; }
});