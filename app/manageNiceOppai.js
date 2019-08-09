const topAds = '.top_page.widget_text';
const topAdsChp = '#sct_top_banner';
const bottomAdsChp = '#sct_footer_banner';
const rightAds = '#sct_col_r';

// function removeNiceOppaiTopAds() {
//   let elementList = document.querySelectorAll('.textwidget');
//   let firstElement = elementList[0]
//   firstElement.parentNode.removeChild(firstElement)
//   // Array.prototype.forEach.call(elementList, function(node) {
//   //   node.parentNode.removeChild(node);

//   // });
// }
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
  if (!currentUrl.endsWith('niceoppai.net')) {
    if (currentUrl.indexOf('?all') === -1) {
      let addAll = '?all';
      if (!currentUrl.endsWith('/')) {
        addAll = '/' + addAll;
      }
      console.log('Doing set all');
      location.replace(currentUrl + addAll);
    }
  } else {
    console.log('Not Doing set all');
  }
}
showAllPage();
removeAds(topAds);
removeAds(topAdsChp);
removeAds(bottomAdsChp);
removeAds(rightAds);
