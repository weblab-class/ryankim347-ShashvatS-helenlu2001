class Block {
  constructor(x, y, mirror = false, s = 40) {
    // coordinates of the top left corner
    this.x = x;
    this.y = y;

    // side length of block
    this.s = s;
    this.mirror = mirror;
    this.color = "white";
  }

  draw(ctx, playerX, playerY) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    if (this.mirror) {
      ctx.strokeStyle = this.color;
      ctx.rect(this.x - playerX, this.y - playerY, this.s, this.s);
      ctx.stroke();
    } else {
      ctx.fillRect(this.x - playerX, this.y - playerY, this.s, this.s);
    }

    ctx.fillStyle = "black";
  }

  topLeft() {
    return [this.x, this.y];
  }

  side() {
    return this.s;
  }
}

export default Block;
