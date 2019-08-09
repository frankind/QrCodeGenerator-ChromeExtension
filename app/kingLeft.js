console.log('kingleft is hit')
// Tool
function isUsableParam(x) {
  return x !== null && x !== undefined;
}
function clickLeft() {
  const elname = 'a[rel="prev"]';
  const myele = document.querySelector(elname)
  if(isUsableParam(myele)){
    myele.click()
  }
}

clickLeft()
