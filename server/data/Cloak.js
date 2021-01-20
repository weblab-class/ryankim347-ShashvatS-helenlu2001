class Cloak {
  constructor(x, y) {
    // coordinates of the top left corner
    this.x = x;
    this.y = y;

    // side length of block
    this.s = 40;
    this.color = "grey";

    this.used = false;
  }

  draw(ctx, playerX, playerY) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x-playerX, this.y-playerY, this.s, this.s);
    ctx.fillStyle = 'black';
  }

  topLeft() {
    return [this.x, this.y];
  }

  side() {
    return this.s;
  }

  use() {
    this.used = true;
  }

  isUsed() {
    return this.used;
  }
}

module.exports = { Cloak };
