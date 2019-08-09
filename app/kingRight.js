console.log('right is hit')
// Tool
function isUsableParam(x) {
  return x !== null && x !== undefined;
}
function clickRight() {
  const elname = 'a[rel="next"]';
  const myele = document.querySelector(elname)
  if(isUsableParam(myele)){
    myele.click()
  }
}

clickRight()
