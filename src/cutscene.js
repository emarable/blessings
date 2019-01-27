var breakpoints = [
{
  at: 640,
  fontSize: 16,
  marginHorizontal: 20,
  marginVertical: 20,
  strokeWidth: 1.5,
},
{
  at: 1000,
  fontSize: 28,
  marginHorizontal: 40,
  marginVertical: 40,
  strokeWidth: 2,
},
{
  at: Infinity,
  fontSize: 40,
  marginHorizontal: 60,
  marginVertical: 60,
  strokeWidth: 3,
}
];

function font(breakpoint) {
  return 'bold '+breakpoint.fontSize +'px sans-serif';
}

function Cutscene(data) {
  this.x = data.x;
  this.y = data.y;
  this.data = data;
  this.currentText = 0;
  this.scroll = 0;
  
  this.textSpeed = 5;
  this.textFade = 60;
  this.textBounce = 2;
  this.shadow = 2;
}
Cutscene.prototype.step = function (elapsed) {
  this.scroll += 1;
};
Cutscene.prototype.draw = function (ctx, camera) {
  var text = this.data.texts[this.currentText];
  var tx = this.x * Game.WIDTH;
  var ty = this.y * Game.HEIGHT;
  
  var style = breakpoints.find(function (b) { return Game.WIDTH <= b.at; });
    
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = font(style);
  
  var textSize = ctx.measureText(text);
  
  // ctx.beginPath();
  // ctx.rect(tx,ty,textSize.width + 40,46);
  // ctx.fill();
  
  ctx.drawImage(this.speechImage, 
    tx, ty, textSize.width + style.marginHorizontal * 2, style.fontSize + style.marginVertical * 2);
  
  ctx.lineWidth = style.strokeWidth * 2;
  ctx.strokeStyle = 'black';
  for (var i = 0; i < text.length; ++i) {
    if (this.scroll < i * this.textSpeed) break;
    
    var bounce = Math.sin(-(this.scroll + i * this.textSpeed) * Math.PI/60) * this.textBounce;
    var fade = Math.min(1, (this.scroll - i * this.textSpeed) / this.textFade);
    
    ctx.fillStyle = 'black';
    ctx.globalAlpha = fade / 2;
    ctx.fillText(text[i], 
      tx + style.marginHorizontal + ctx.measureText(text.slice(0,i)).width + this.shadow * style.strokeWidth, 
      ty + style.marginVertical + bounce + this.shadow * style.strokeWidth);
      
    ctx.fillStyle = 'white';
    ctx.globalAlpha = fade;
    ctx.strokeText(text[i], 
      tx + style.marginHorizontal + ctx.measureText(text.slice(0,i)).width, 
      ty + style.marginVertical + bounce);
    ctx.fillText(text[i], 
      tx + style.marginHorizontal + ctx.measureText(text.slice(0,i)).width, 
      ty + style.marginVertical + bounce);
  }
  
  ctx.globalAlpha = 1;
};
Cutscene.prototype.keydown = function (ev) {
};
Cutscene.prototype.keyup = function (elapsed) {
  var text = this.data.texts[this.currentText];
  if (this.scroll >= text.length * this.textSpeed + this.textFade) {
    SOUND.play(SOUND.dialogue.get());
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
  this.speechImage = IMAGE.speech.get();
  
  SOUND.play(SOUND.dialogue.get());
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