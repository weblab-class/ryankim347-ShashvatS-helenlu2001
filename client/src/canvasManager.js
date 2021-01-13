const ctx = document.getElementById('canvas').getContext('2d');

// radius of player circle
const playerSize = 15;
// side length of block square
const blockSize = 40;


/** DRAWING FUNCTIONS */
function drawPlayer(ctx, x, y, color) {
  const {drawX, drawY} = convertCoord(x,y);
  fillCircle(ctx, drawX, drawY, playerSize, color);
}

function drawBlock(ctx, x, y, color) {
  const {drawX, drawY} = convertCoord(x,y);
  fillCircle(ctx, drawX, drawY, blockSize, color);
}


/** UTILITY DRAWING FUNCTIONS */
function fillCircle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function fillSquare(ctx, x, y, s, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);
}

/** UTILITY FUNCTIONS */

// TODO: change the method so that it will work for our purpose of keeping person
//       within a certain distance from the center

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoord = (x, y) => {
  if (!canvas) return;
  return {
    drawX: canvas.width / 2 + x,
    drawY: canvas.height / 2 - y,
  };
};

//////////////////////////////////////////////////////////////////////////

// TODO finish drawing function after determine the api between client and server
/** MAIN DRAWING FUNCTION */
export function drawCanvas(drawState) {

  // clears the contents of the canvas
  ctx.fillStyle= 'black';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  console.log('unimplemented')
}
