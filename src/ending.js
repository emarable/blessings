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
  },
  step: function (elapsed) {
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
  },
  draw: function (ctx) {
    ctx.drawImage(this.endingImage, 
      0, 0, this.endingImage.width, this.endingImage.height, 
      0, 0, Game.WIDTH, Game.HEIGHT);
    
    if (this.fadeIn) {
      ctx.globalAlpha = 1 - (this.delay) / 60;
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.rect(0,0,Game.WIDTH, Game.HEIGHT);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  },
  keyup: function (ev) {
    Game.setState(MainMenu);
  }
};