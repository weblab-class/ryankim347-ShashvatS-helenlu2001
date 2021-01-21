import potion from './potion.png';

class Shrink {
  constructor(x, y, s=20) {
    // coordinates of the top left corner
    this.x = x;
    this.y = y;

    // side length of block
    this.s = s;
    this.color = 'red'
  }

  draw(ctx, playerX, playerY) {
    let img = new Image();
    img.src = potion;
    ctx.drawImage(img, this.x-playerX, this.y-playerY, img.width, img.height);

    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x-playerX, this.y-playerY, this.s, this.s);
    // ctx.fillStyle = 'black';
  }

  topLeft() {
    return [this.x, this.y];
  }

  side() {
    return this.s;
  }


}

export default Shrink;
