function Button(x,y,text) {
	this.x = x;
	this.y = y;
	this.width = 128;
	this.height = 32;
	this.text = text;
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
	if (this.hover) { ctx.globalAlpha = 1; }
	else { ctx.globalAlpha = 0.6; }
		
	ctx.beginPath();
	ctx.strokeStyle = 'maroon';
	ctx.fillStyle = 'red';
	ctx.rect(this.x,this.y,this.width,this.height);
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = "black";
	ctx.font = "12pt sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(this.text, this.x+2, this.y+2);
	ctx.globalAlpha = 1;
}