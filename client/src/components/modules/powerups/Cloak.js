import cloak from './cloak.png';

class Cloak {
  constructor(x, y, s=40) {
    // coordinates of the top left corner
    this.x = x;
    this.y = y;

    // side length of block
    this.s = s;
    this.color = 'grey'
  }

  draw(ctx, playerX, playerY) {
    let img = new Image();
    img.src = cloak;
    ctx.drawImage(img, this.x-playerX, this.y-playerY, img.width*0.0204, img.height*0.0204);
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

export default Cloak;
