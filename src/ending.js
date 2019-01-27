var Ending = {
  init: function () {
    var init = Game.loader.require(
      IMAGE.bgEnding,
      IMAGE.bgCredits,
      MUSIC.ending,
    );
    init.onComplete = function () { Game.setState(Ending); };
    return init;
  },
  onEnter: function () {
    this.endingImage = IMAGE.bgEnding.get();
    this.creditsImage = IMAGE.bgCredits.get();
    this.music = MUSIC.ending.get();
    
    if (!this.music.isPlaying) {
      MUSIC.stopAll();
      MUSIC.play(this.music);
    }
    
    this.delay = 0;
    this.fadeIn = true;
    this.crossFade = false;
    this.isEnding = true;
    this.isCredits = false;
    this.length = 600;
  },
  step: function (elapsed) {
    if (this.fadeIn) {
      this.delay += 1;
      MUSIC.fade(this.delay / 60);
      if (this.delay >= 60) {
        MUSIC.fade(1);
        this.fadeIn = false;
        this.delay = 0;
      }
    } else if (this.crossFade) {
      this.delay += 1;
      if (this.delay >= 60) {
        this.isCredits = true;
        this.isEnding = false;
        this.crossFade = false;
        this.delay = 0;
      }
    } else if (this.isCredits) {
      
    } else if (this.isEnding) {
      this.delay += 1;
      if (this.delay >= this.length) {
        this.crossFade = true;
        this.delay = 0;
      }
    }
  },
  draw: function (ctx) {
    if (this.isEnding) {
      ctx.drawImage(this.endingImage, 
        0, 0, this.endingImage.width, this.endingImage.height, 
        0, 0, Game.WIDTH, Game.HEIGHT);
    }
    if (this.isCredits) {
      ctx.drawImage(this.creditsImage, 
        0, 0, this.creditsImage.width, this.creditsImage.height, 
        0, 0, Game.WIDTH, Game.HEIGHT);
    }
    if (this.crossFade) {
      ctx.globalAlpha = (this.delay) / 60;
      ctx.drawImage(this.creditsImage, 
        0, 0, this.creditsImage.width, this.creditsImage.height, 
        0, 0, Game.WIDTH, Game.HEIGHT);
    }
    
    if (this.fadeIn) {
      ctx.globalAlpha = 1 - (this.delay) / 60;
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.rect(0,0,Game.WIDTH, Game.HEIGHT);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
  keyup: function (ev) {
    if (this.isCredits) {
      Game.setState(MainMenu);
    }
  }
};