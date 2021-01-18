const speed = 10;
const segmentCircleIntersect = (x1,y1,x2,y2,xc,yc,r) => {
  let ACx = xc-x1
  let ACy = yc-y1
  let BCx = xc-x2
  let BCy = yc-y2
  let ABx = x2-x1
  let ABy = y2-y1
  let AB = Math.sqrt(ABx*ABx + ABy*ABy)
  let BC = Math.sqrt(BCx*BCx + BCy*BCy)
  let AC = Math.sqrt(ACx*ACx + ACy*ACy)
  //first check if either endpoint is inside
  if (AC <= r || BC <= r) {
    return true
  }
  //i dont think this next part is actually necessary but it's cool, check for other intersections with circle
  let proj = (ACx*ABx+ACy*ABy)/AB
  if ((proj<0) || (proj > AB)) {
    return false
  }
  let unitX = ABx/AB
  let unitY = ABy/AB
  let Dx = x1 + unitX*proj
  let Dy = y1 + unitY*proj
  let dist = Math.sqrt((Dx-xc)*(Dx-xc)+(Dy-yc)*(Dy-yc))
  if (dist > r) {
    return false
  }
  return true
}
class Bullet {
  constructor(posX, posY, velX, velY, color) {
    this.length = 10;
    this.x = posX;
    this.y = posY;
    this.color = color;

    this.velX = velX;
    this.velY = velY;

    this.stillGoing = true;
  }

  move(blocks) {
    if(!this.stillGoing) {
      return;
    }

    this.x += speed * this.velX;
    this.y += speed * this.velY;

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      this.checkBlock(block.topLeft()[0], block.topLeft()[1], block.side());
    }
  }
  getEndCoords() {
    return [this.x-this.length*this.velX,this.y-this.length*this.velY,this.x+this.length*this.velX,this.y+this.length*this.velY]
  }
  checkBlock(topLeftX,topLeftY,side) {
    let c = this.getEndCoords()
    if (segmentCircleIntersect(c[0],c[1],c[2],c[3],topLeftX+side/2,topLeftY+side/2,side/2)) {
      this.stillGoing = false
    }
  }
  // TODO: need to handle case when we have a kabob when shooting -- should only kill the person that is closest
  shoot(players) {
    if(!this.stillGoing) {
      return;
    }

    this.shot = true;
    for(let i = 0; i < players.length; i++) {
      let player = players[i];
      if(player.color === this.color || player.isDead) {
        continue;
      }
      if(this.checkKilled(player)) {
        this.points += 1;
        break;
      }
    }

    setTimeout(() => this.shot = false, 250); // shoots for 0.5 sec
  }


  killed() {
    this.stillGoing = false;
  }

  distFromCenter(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return Math.sqrt(dx*dx + dy*dy);
  }

}

module.exports = { Bullet };
