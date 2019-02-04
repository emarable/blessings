var MainMenu = {
	onEnter: function () {
    this.background = IMAGE.bgTitle.get();
		this.buttonStart = new Button(0.672,0.388,0.13,0.11);
		    
    if (!MUSIC.title.get().isPlaying) {
      MUSIC.stopAll();
      MUSIC.play(MUSIC.title.get());
      MUSIC.fade(1);
    }
    
    this.fadeOut = false;
    this.fade = 0;
	},
	step: function (elapsed) {
    if (this.fadeOut) {
      ++this.fade;
      MUSIC.fade(1 - this.fade / 60);
      if (this.fade >= 60) {
        MUSIC.fade(0);
        Game.setState(this.nextState);
      }
    }    
	},
	draw: function (ctx) {
		// Clear the background
		ctx.drawImage(this.background, 0, 0, this.background.width, this.background.height,
      0, 0, Game.WIDTH, Game.HEIGHT);
		
		this.buttonStart.draw(ctx);
    
    if (this.fadeOut) {
      ctx.globalAlpha = this.fade / 60;
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.rect(0,0,Game.WIDTH,Game.HEIGHT);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
	},
	mousemove: function (ev) {
		var mx = (ev.pageX - canvasX) / Game.WIDTH;
		var my = (ev.pageY - canvasY) / Game.HEIGHT;
		
		this.buttonStart.mousemove(mx,my);
	},
	mouseup: function (ev) {
		if (this.buttonStart.hover) {
      SOUND.play(SOUND.start.get());
      
      Game.currentLevel = 0;
      this.nextState = levels[Game.currentLevel].init();
      this.fadeOut = true;
		} 
	}
};
