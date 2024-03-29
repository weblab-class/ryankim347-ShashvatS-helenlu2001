class Block {
  constructor(x, y) {
    // coordinates of the top left corner
    this.x = x;
    this.y = y;

    // side length of block
    this.s = 40;
    this.color = "white";
    this.mirror = false;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.s, this.s);
    ctx.fillStyle = "black";
  }

  topLeft() {
    return [this.x, this.y];
  }

  side() {
    return this.s;
  }

  makeMirror() {
    this.mirror = true;
  }
}

module.exports = { Block };
