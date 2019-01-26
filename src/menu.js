var MainMenu = {
	onEnter: function () {
    this.background = IMAGE.bgTitle.get();
		this.buttonStart = new Button(0.62,0.38,0.13,0.11);
		    
    // if (!MUSIC.menu.get().isPlaying) {
      // MUSIC.stopAll();
      // MUSIC.play(Game.audioContext, MUSIC.menu.get());
    // }
    
    try {
      this.savedGame = {
        level: parseInt(localStorage.getItem('gad.tuesday.level')) || 0,
      };
    } catch (ex) {
      this.savedGame = {
        level: 0
      };
    }
	},
	step: function (elapsed) {
	},
	draw: function (ctx) {
		// Clear the background
		ctx.drawImage(this.background, 0, 0, this.background.width, this.background.height,
      0, 0, Game.WIDTH, Game.HEIGHT);
		
		this.buttonStart.draw(ctx);
	},
	mousemove: function (ev) {
		var mx = (ev.pageX - canvasX) / Game.WIDTH;
		var my = (ev.pageY - canvasY) / Game.HEIGHT;
		
		this.buttonStart.mousemove(mx,my);
	},
	mouseup: function (ev) {
		if (this.buttonStart.hover) {
			Game.currentLevel = 0;
			Game.setState(levels[Game.currentLevel]);
		}
	}
};
