var font = '30px serif';

function Cutscene(data) {
  this.x = data.x;
  this.y = data.y;
  this.data = data;
  this.currentText = 0;
  this.scroll = 0;
  
  this.textSpeed = 5;
  this.textFade = 60;
  this.textBounce = 2;
}
Cutscene.prototype.step = function (elapsed) {
  this.scroll += 1;
};
Cutscene.prototype.draw = function (ctx, camera) {
  var text = this.data.texts[this.currentText];
  var tx = this.x * Game.WIDTH;
  var ty = this.y * Game.HEIGHT;
    
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = font;
  
  var textSize = ctx.measureText(text);
  
  ctx.beginPath();
  ctx.rect(tx,ty,textSize.width + 40,46);
  ctx.fill();
  
  ctx.fillStyle = 'black';
  for (var i = 0; i < text.length; ++i) {
    if (this.scroll < i * this.textSpeed) break;
    
    var bounce = Math.sin(-(this.scroll + i * this.textSpeed) * Math.PI/60) * this.textBounce;
    
    ctx.globalAlpha = Math.min(1, (this.scroll - i * this.textSpeed) / this.textFade);
    ctx.fillText(text[i], tx + 8 + ctx.measureText(text.slice(0,i)).width, ty + 8 + bounce);
  }
  
  ctx.globalAlpha = 1;
};
Cutscene.prototype.keydown = function (ev) {
};
Cutscene.prototype.keyup = function (elapsed) {
  var text = this.data.texts[this.currentText];
  if (this.scroll >= text.length * this.textSpeed + this.textFade) {
    this.currentText += 1;
    this.scroll = 0;
    if (this.data.texts.length <= this.currentText) {
      Game.ui.endCutscene();
    }
  }
};

Cutscene.prototype.start = function () {
  this.x = this.data.x;
  this.y = this.data.y;
  this.currentText = 0;
  this.scroll = 0;
};

var cutscenes = [];
cutscenes[0] = new Cutscene({
  x: 0.4,
  y: 0.1,
  texts: [
    "I am a squirrel",
    "Jack will fill this in later",
  ]
});