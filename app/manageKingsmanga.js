const topLogo = '.kingsmanga-logo';
const topAds = '.col-md-12.text-center.padding-top-15.new-widget-width';
const rightAds = '.textwidget';
const detailAds = '.text-center';
const mainMenu = '.main-menu';
const dangerMenu = '.alert.alert-danger';
// Tool
function isUsableParam(x) {
  return x !== null && x !== undefined;
}

function removeAds(elname) {
  let element = document.querySelector(elname);
  if (isUsableParam(element)) {
    console.log(`removing ads: ${elname}`);
    element.parentElement.removeChild(element);
  } else {
    console.log(`not found ads: ${elname}`);
  }
}
function removeManyAds(elname) {
  let elementList = document.querySelectorAll(elname);
  Array.prototype.forEach.call(elementList, function(node) {
    node.parentNode.removeChild(node);
  });
}
function removeAdsWithIndex(elname, index) {
  let elementList = document.querySelectorAll(elname);
  let selectElement = elementList[index];
  if (isUsableParam(selectElement)) {
    selectElement.parentNode.removeChild(selectElement);
  }
}
removeAds(topLogo);
removeAds(topAds);
removeAds(mainMenu);
removeManyAds(rightAds);
removeAds(dangerMenu);
removeAdsWithIndex(detailAds, 1);
