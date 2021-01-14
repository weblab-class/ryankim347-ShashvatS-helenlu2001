import { move } from './client-socket.js';

function handleKeyDown(event) {
  if (event.key === 'ArrowUp') {
    move('up');
  } else if (event.key === 'ArrowDown') {
    move('down');
  } else if (event.key === 'ArrowLeft') {
    move('left');
  } else if (event.key === 'ArrowRight') {
    move('right');
  }
}


window.addEventListener('keydown', handleKeyDown);
