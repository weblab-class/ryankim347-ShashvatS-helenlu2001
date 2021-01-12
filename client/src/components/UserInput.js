// TODO implement a move function that emits from client to server in ./ client socket

function handleInput(event) {
  if (event.key === 'ArrowUp') {
    console.log('move up')
  } else if (event.key === 'ArrowDown') {
    console.log('move down')
  } else if (event.key === 'ArrowLeft') {
    console.log('move left')
  } else if (event.key === 'ArrowRight') {
    console.log('move right')
  }
}

window.addEventListener('keydown', handleInput);
