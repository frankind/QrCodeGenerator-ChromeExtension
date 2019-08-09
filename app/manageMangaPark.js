const header = '.cm';

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
function showAllPage() {
  console.log('showAllPage');
  let currentUrl = location.href;
  if (!currentUrl.endsWith('mangapark.net')) {
    if (currentUrl.endsWith('/1')) {
      let targetUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/1'));
      location.replace(targetUrl);
    }
  } else {
    console.log('Not Doing set all');
  }
}
showAllPage();
removeAds(header);
