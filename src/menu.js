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
      
      var init = Game.loader.require(
        IMAGE.bgLevel1,
        IMAGE.fgLevel1,
        IMAGE.ltLevel1,
        IMAGE.leaf1Level1,
        IMAGE.leaf2Level1,
        IMAGE.bgLevel2,
        IMAGE.fgLevel2,
        IMAGE.ltLevel2,
        IMAGE.bgLevel3,
        IMAGE.fgLevel3,
        IMAGE.ltLevel3,
        IMAGE.bgLevel4,
        IMAGE.fgLevel4,
        IMAGE.ltLevel4,
        IMAGE.squirrel,
        IMAGE.speech,
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
        MUSIC.level1,
        MUSIC.level2,
        MUSIC.level4,
        MUSIC.ending,
        SOUND.water,
        SOUND.landing,
        SOUND.dialogue,
      );
      init.onComplete = function () { 
        Game.currentLevel = 3;
        Game.setState(levels[Game.currentLevel]); 
        // Game.setState(showcases[1].init());
        // Game.setState(Ending.init());
      };
      
      this.nextState = init;
      this.fadeOut = true;
		} 
	}
};
