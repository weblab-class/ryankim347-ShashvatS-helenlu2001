const speed = 10;

const segmentCircleIntersect = (x1, y1, x2, y2, xc, yc, r) => {
  let ACx = xc - x1;
  let ACy = yc - y1;
  let BCx = xc - x2;
  let BCy = yc - y2;
  let ABx = x2 - x1;
  let ABy = y2 - y1;
  let AB = Math.sqrt(ABx * ABx + ABy * ABy);
  let BC = Math.sqrt(BCx * BCx + BCy * BCy);
  let AC = Math.sqrt(ACx * ACx + ACy * ACy);
  //first check if either endpoint is inside
  if (AC <= r || BC <= r) {
    return true;
  }
  //i dont think this next part is actually necessary but it's cool, check for other intersections with circle
  let proj = (ACx * ABx + ACy * ABy) / AB;
  if (proj < 0 || proj > AB) {
    return false;
  }
  let unitX = ABx / AB;
  let unitY = ABy / AB;
  let Dx = x1 + unitX * proj;
  let Dy = y1 + unitY * proj;
  let dist = Math.sqrt((Dx - xc) * (Dx - xc) + (Dy - yc) * (Dy - yc));
  if (dist > r) {
    return false;
  }
  return true;
};

// Stolen from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a, b, c, d, p, q, r, s) {
  let det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
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
    if (!this.stillGoing) {
      return;
    }

    this.x += speed * this.velX;
    this.y += speed * this.velY;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const hits = this.checkBlock(block.topLeft()[0], block.topLeft()[1], block.side());

      if (hits && block.mirror) {
        return this.createReflectedBullet(block);
      }
    }

    return null;
  }

  getEndCoords() {
    return [
      this.x - this.length * this.velX,
      this.y - this.length * this.velY,
      this.x + this.length * this.velX,
      this.y + this.length * this.velY,
    ];
  }

  checkBlock(topLeftX, topLeftY, side) {
    let c = this.getEndCoords();
    if (
      segmentCircleIntersect(
        c[0],
        c[1],
        c[2],
        c[3],
        topLeftX + side / 2,
        topLeftY + side / 2,
        side / 2
      )
    ) {
      this.stillGoing = false;
      return true;
    }

    return false;
  }

  /**
   *
   * @param {Block} block
   */
  createReflectedBullet(block) {
    const c = this.getEndCoords();

    let dir = -1;

    if (
      intersects(c[0], c[1], c[2], c[3], block.x, block.y, block.x + block.s, block.y) &&
      this.velY >= 0
    )
      dir = 1;
    else if (
      intersects(
        c[0],
        c[1],
        c[2],
        c[3],
        block.x + block.s,
        block.y,
        block.x + block.s,
        block.y + block.s
      ) &&
      this.velX <= 0
    )
      dir = 2;
    else if (
      intersects(
        c[0],
        c[1],
        c[2],
        c[3],
        block.x,
        block.y + block.s,
        block.x + block.s,
        block.y + block.s
      ) &&
      this.velY <= 0
    )
      dir = 3;
    else if (
      intersects(c[0], c[1], c[2], c[3], block.x, block.y, block.x, block.y + block.s) &&
      this.velX >= 0
    )
      dir = 4;

    let x = this.x;
    let y = this.y;
    let velX = this.velX;
    let velY = this.velY;

    if (dir == 1 || dir == 3) {
      velY *= -1;
    } else if (dir == 2 || dir == 4) {
      velX *= -1;
    }

    // TODO: the (x, y) position needs to be updated too, technically
    // But, I can't even tell the different right now so

    return new Bullet(x, y, velX, velY, this.color);
  }

  // TODO: need to handle case when we have a kabob when shooting -- should only kill the person that is closest

  killed() {
    this.stillGoing = false;
  }
}

module.exports = { Bullet };
