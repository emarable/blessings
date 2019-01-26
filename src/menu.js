var MainMenu = {
	onEnter: function () {
		this.buttonStart = new Button(16,176,"Start");
		this.buttonLoad = new Button(16,224,"Load");
		this.buttonEditor = new Button(16,272,"Level Editor");
		    
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
    ctx.drawImage(IMAGE.bgTitle.get(), 0, 0);
		
		this.buttonStart.draw(ctx);
    this.buttonEditor.draw(ctx);
    if (this.savedGame.level > 0) {
      this.buttonLoad.draw(ctx);
      ctx.fillStyle = 'white';
      ctx.fillText('Level: '+(this.savedGame.level + 1), 160, 224);
    }
	},
	mousemove: function (ev) {
		var mx = ev.pageX - canvasX;
		var my = ev.pageY - canvasY;
		
		this.buttonStart.mousemove(mx,my);
		this.buttonLoad.mousemove(mx,my);
		this.buttonEditor.mousemove(mx,my);
	},
	mouseup: function (ev) {
		if (this.buttonStart.hover) {
        Game.currentLevel = 0;
        Game.setState(levels[Game.currentLevel]);
		}
		if (this.buttonLoad.hover) {
      if (this.savedGame.level > 0) {
        Game.currentLevel = this.savedGame.level;
        Game.setState(levels[Game.currentLevel]);
      }
		}
    if (this.buttonEditor.hover) {
        Game.setState(new Editor());
    }
	}
};
