/// <reference path="qrcode/qrcode.min.js" />
let tabId = -1;
let currentUrl = '';
const NICEOPPAIWEB = 'niceoppai.net';
const MANGAPARKWEB = 'mangapark.net';
let currentWeb = '';
// Get the current URL.
// @param {function(string)} callback - called when the URL of the current tab is found
function getCurrentTabUrl(callback) {
  // query information for the current tab
  var queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least one tab
    var tab = tabs[0];
    // A tab is a plain object that provides information about the tab.
    var url = tab.url;
    tabId = tab.id;
    currentUrl = url;
    callback(url, tab.id);
  });
}

// fires when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url, tabId) {
    // creates a new QRCode object, by passing a reference to a DOM element
    // and specifing the desired dimensions
    var qrcode = new QRCode(document.getElementById('qrcode'), {
      width: 100,
      height: 100,
    });
    printText(url);
    document.getElementById('left').addEventListener('click', handleLeftClick);
    // document.getElementById('right').addEventListener('click', handleRightClick);
    document.getElementById('right').addEventListener('click', handleClick);
    // document.getElementById('right').addEventListener('click'
    // , function() {
    // printText('RIGHT: ' + currentUrl);
    // printText(
    //   [...document.getElementsByTagName('a')].filter(function(data) {
    //     return data.textContent.indexOf('Next') !== -1;
    //   })[0].textContent
    // );
    // });
    // creates the QR code
    qrcode.makeCode(url);
    mainTask();
  });
});

function updateUrl(tabId, targetUrl) {
  chrome.tabs.update(tabId, { url: targetUrl, active: true });
}
function handleLeftClick() {
  chrome.tabs.executeScript(
    tabId,
    {
      code:
        // '[...document.getElementsByTagName("a")].filter(function(data){return (data.textContent.indexOf("Next")!==-1)})[0].click();',
        getCodeClick('a', 'Prev'),
    },
    function() {
      printText('LEFT is clicked');
    }
  );
}

function handleRightClick() {
  chrome.tabs.executeScript(
    tabId,
    {
      code:
        // '[...document.getElementsByTagName("a")].filter(function(data){return (data.textContent.indexOf("Next")!==-1)})[0].click();',
        getCodeClick('a', 'Next'),
    },
    function() {
      printText('RIGHT is clicked');
    }
  );
}

function getCodeClick(tag, text) {
  return `[...document.getElementsByTagName("${tag}")].filter(function(data){return (data.textContent.indexOf("${text}")!==-1)})[0].click();`;
}
// function handleLeftClick() {
//   printText('LEFT: ' + currentUrl);
// const elList = searchElementByTagText('a', 'Prev');
// if (elList.length > 0) {
//   printText('Clicking: ' + elList[0].textContent);
//   elList[0].click();
// }
// }
// function handleRightClick() {
//   printText('RIGHT: ' + currentUrl);
//   [...document.getElementsByTagName('a')]
//     .filter(function(data) {
//       return data.textContent.indexOf('Next') !== -1;
//     })[0]
//     .click();
//   // const elList = searchElementByTagText('a', 'Next');
//   // // printText('size: ' + elList.length);
//   // if (elList.length > 0) {
//   //   const ele = elList[0];
//   //   printText('Clicking: ' + ele.textContent);
//   //   ele.click();
//   // }
// }

function mainTask() {
  // Check Niceoppai Web
  let targetUrl;
  if (isFoundWeb(currentUrl, NICEOPPAIWEB)) {
    currentWeb = NICEOPPAIWEB;
    printText('found niceoppai');
    if (currentUrl.indexOf('?all') === -1) {
      targetUrl = currentUrl + '?all';
      updateUrl(tabId, targetUrl);
    }
  } else if (isFoundWeb(currentUrl, MANGAPARKWEB)) {
    currentWeb = MANGAPARKWEB;
    printText('found mangapark');
    if (currentUrl.endsWith('/1')) {
      targetUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/1'));
      updateUrl(tabId, targetUrl);
    }
  } else {
    printText('not found match');
  }
}

function printText(input) {
  document.getElementById('currentUrl').textContent = input;
}

function isFoundWeb(input, expect) {
  return input.indexOf(expect) !== -1;
}

function searchElementByTagText(tag, searchText) {
  // let aTags = document.getElementsByTagName(tag);
  // let arr = [...aTags];
  // // let arr = Array.from(aTags)
  // printText('aTags length: ' + aTags.length)
  // console.log('arr length: ' + arr.length);

  // let elList = arr.filter(function(data) {
  //   return data.textContent.indexOf(searchText) !== -1;
  // });
  // return elList;
  return [...document.getElementsByTagName('a')].filter(function(data) {
    return data.textContent.indexOf(searchText) !== -1;
  });
}
// [...document.getElementsByTagName('a')].filter(function(data){return (data.textContent.indexOf('Next')!==-1)}).length
// [...document.getElementsByTagName('span/a')].filter(function(data){return (data.textContent.indexOf('Next')!==-1)}).length
