var MainMenu = {
	onEnter: function () {
    this.background = IMAGE.bgTitle.get();
		this.buttonStart = new Button(0.672,0.388,0.13,0.11);
		    
    if (!MUSIC.title.get().isPlaying) {
      MUSIC.stopAll();
      MUSIC.play(MUSIC.title.get());
    }
    
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
      SOUND.play(SOUND.start.get());
      
      var init = Game.loader.require(
        IMAGE.bgLevel1,
        IMAGE.fgLevel1,
        IMAGE.ltLevel1,
        IMAGE.leaf1Level1,
        IMAGE.leaf2Level1,
        IMAGE.squirrel,
        IMAGE.speech,
        IMAGE.protagonistIdle1Left,
        IMAGE.protagonistIdle2Left,
        IMAGE.protagonistIdle3Left,
        IMAGE.protagonistIdle1Right,
        IMAGE.protagonistIdle2Right,
        IMAGE.protagonistIdle3Right,
        MUSIC.level1,
        SOUND.water,
        SOUND.landing,
      );
      init.onComplete = function () { 
        Game.currentLevel = 0;
        Game.setState(levels[Game.currentLevel]); 
      };
      Game.setState(init);
		} 
	}
};
