function Button(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
  this.hover = false;
  this.hoverTime = 0;
}
Button.prototype.mousemove = function (x,y) {
	if (x > this.x && x < this.x + this.width &&
		y > this.y && y < this.y + this.height) {
		this.hover = true;
	} else {
		this.hover = false;
	}	
}
Button.prototype.draw = function (ctx) {
	if (this.hover) { 
    if (this.hoverTime < 60) ++ this.hoverTime;
  }
	else if (this.hoverTime > 0) --this.hoverTime;
  
  ctx.globalAlpha = this.hoverTime / 300; 
		
	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.fillStyle = 'white';
  roundRect(ctx,
    this.x * Game.WIDTH,
    this.y * Game.HEIGHT,
    this.width * Game.WIDTH,
    this.height * Game.HEIGHT,
    0.025 * Game.WIDTH);
	ctx.stroke();
	ctx.fill();
  
  ctx.globalAlpha = 1; 
}

function roundRect(ctx, x, y, width, height, radius) {
	//ctx.rect(x,y,width, height);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.arcTo(x + width, y + height, x + width / 2, y + height, radius);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.arcTo(x, y, x + radius, y, radius);
}