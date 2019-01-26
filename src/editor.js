function Editor() {
}
Editor.prototype.onEnter = function () {  
  this.data = {
    width: 640,
    height: 480,
    background: '#00ffff',
    objects: [],
  };
  
  this.currentTileX = -1;
  this.currentTileY = -1;
  
  var _this = this;
  this.tray = new Tray(0,0);
  this.tray.onSave = function () {
    promptDownload('edward_level.json',JSON.stringify(_this.data));
  }
};
Editor.prototype.step = function (elapsed) {
};
Editor.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.fillStyle = this.data.background;
	ctx.rect(16,0,Game.WIDTH,Game.HEIGHT);
	ctx.fill();
  
  this.tray.draw(ctx);
  
  if (this.isInGameArea()) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.rect(this.currentTileX * 16 + 0.5,this.currentTileY * 16 + 0.5,16,16);
    ctx.stroke();
  }
  
  for (var oY = 0; oY < this.data.objects.length; ++oY) {
    for (var oX = 0; oX < this.data.objects[oY].length; ++oX) {
      var o = this.data.objects[oY][oX];
      if (o >= 0) {
        objects[o][1](ctx, (oX + 1) * 16, oY * 16);
      }
    }
  }
};
Editor.prototype.keydown = function (ev) {
};
Editor.prototype.keyup = function (ev) {
};
Editor.prototype.mousemove = function (ev) {
  var mx = ev.pageX - canvasX;
  var my = ev.pageY - canvasY;
  
  this.currentTileX = Math.floor(mx / 16);
  this.currentTileY = Math.floor(my / 16);
  
  this.tray.mousemove(mx, my);
  
  if (this.mouseHeld && this.isInGameArea()) {
    this.placeTile();
  }
};
Editor.prototype.mousedown = function (ev) {
  this.mouseHeld = true;
  
  if (this.isInGameArea()) {
    this.placeTile();
  }
};
Editor.prototype.mouseup = function (ev) {
  this.mouseHeld = false;
  
  if (!this.isInGameArea()) {
    this.tray.mouseup(ev);
  } 
};

Editor.prototype.isInGameArea = function () {
  return this.currentTileX > 0 && this.currentTileY < (Game.HEIGHT / 16 - 3);
}

Editor.prototype.placeTile = function() {
  while (this.data.objects.length < this.currentTileY + 1) {
    this.data.objects.push([]);
  }
  while(this.data.objects[this.currentTileY].length < this.currentTileX) {
    this.data.objects[this.currentTileY].push(0);
  }
  this.data.objects[this.currentTileY][this.currentTileX - 1] = this.tray.selected;
};

var objects = [
  ['air', function (ctx, x, y) {} ],
  ['protagonist', function (ctx, x, y) { ctx.drawImage(IMAGE.edward.get(), 0, 0, 16, 16, x, y, 16, 16);} ],
  ['wallGrass', function (ctx, x, y) { ctx.drawImage(IMAGE.wallGrass.get(), 0, 0, 16, 16, x, y, 16, 16);} ],
]

function Tray() {
  this.selected = 0;
  this.hovered = 0;
  
  this.buttonSave = new Button(Game.WIDTH - 144,Game.HEIGHT-40,"Save");
}
Tray.prototype.step = function (elapsed) {
  
}
Tray.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.fillStyle = '#204080';
	ctx.rect(0,0,17,Game.HEIGHT);
	ctx.rect(0,Game.HEIGHT-48,Game.WIDTH,48);
	ctx.fill();
  
  for (var i = 0; i < objects.length; ++i) {
    objects[i][1](ctx,0,0 + i * 16);
  }
  
  if (this.selected >= 0) {
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.rect(1,1 + this.selected * 16,15,15);
    ctx.stroke();
  }
  if (this.hovered >= 0 && this.hovered < objects.length) {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.rect(0.5,this.hovered * 16 + 0.5,16,16);
    ctx.stroke();
  }
  
  this.buttonSave.draw(ctx);
}
Tray.prototype.mousemove = function (x,y) {
  if (x >= 0 && x <= 16) {
    this.hovered = Math.floor(y / 16);
  } else {
    this.hovered = -1;
  }
  
  this.buttonSave.mousemove(x,y);
};
Tray.prototype.mouseup = function (ev) {
  if (this.hovered !== -1) {
    this.selected = this.hovered;
  }
  if (this.buttonSave.hover && this.onSave) {
    this.onSave();
  }
};

function promptDownload(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}