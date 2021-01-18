//inspired by https://stackoverflow.com/a/1079478
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

export {segmentCircleIntersect}
