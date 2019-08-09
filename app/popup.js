/// <reference path="qrcode/qrcode.min.js" />
let tabId = -1;
let currentUrl = '';
const NICEOPPAIWEB = 'niceoppai.net';
const MANGAPARKWEB = 'mangapark.net';
let currentWeb = '';

function handleButton() {
  let changeColor = document.getElementById('changeColor');
  chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
  });
  changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
    });
  };
}

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
    document.getElementById('right').addEventListener('click', handleRightClick);
    // creates the QR code
    qrcode.makeCode(url);
    mainTask();
  });
});

function updateUrl(tabId, targetUrl) {
  chrome.tabs.update(tabId, { url: targetUrl, active: true });
}
function handleLeftClick() {
  if (currentWeb === MANGAPARKWEB) mangaparkPrevClick();
  else if (currentWeb === NICEOPPAIWEB) niceoppaiPrevChapter();
}

function handleRightClick() {
  if (currentWeb === MANGAPARKWEB) mangaparkNextClick();
  else if (currentWeb === NICEOPPAIWEB) niceoppaiNextChapter();
}

function getCodeClick(tag, text) {
  return `[...document.getElementsByTagName("${tag}")].filter(function(data){return (data.textContent.indexOf("${text}")!==-1)})[0].click();`;
}
function getCodePreviousChapter() {
  return `[...document.getElementsByTagName("cbo_wpm_chp")].filter(function(data){return (data.textContent.indexOf("${text}")!==-1)})[0].click();`;
}
function niceoppaiPrevChapter() {
  printText(`action left yet: ${currentUrl}`);
  // let previousChapter;
  function prevChapter() {
    let currentUrl = document.URL
    let targetUrl = currentUrl;
    let select = document.querySelector('.cbo_wpm_chp');
    let currentIndex = select.options[select.selectedIndex].value;
    let prevIndex = select.options[select.selectedIndex + 1].value;
    // previousChapter = prevIndex;
    function goToPreviousChapter() {
      // replace current chapter
      targetUrl = currentUrl.replace(currentIndex, prevIndex);
      if (currentUrl.indexOf('?all') === -1) {
        targetUrl = targetUrl + '?all'
      }
      location.replace(targetUrl)
    }
    goToPreviousChapter();
  }
  chrome.tabs.executeScript({
    code: '(' + prevChapter + ')();',
  });
}
function niceoppaiNextChapter() {
  printText(`action right yet: ${currentUrl}`);
  // let previousChapter;
  function nextChapter() {
    let currentUrl = document.URL
    let targetUrl = currentUrl;
    let select = document.querySelector('.cbo_wpm_chp');
    let currentIndex = select.options[select.selectedIndex].value;
    let nextIndex = select.options[select.selectedIndex - 1].value;
    // previousChapter = prevIndex;
    function goToNextChapter() {
      // replace current chapter
      targetUrl = currentUrl.replace(currentIndex, nextIndex);
      if (currentUrl.indexOf('?all') === -1) {
        targetUrl = targetUrl + '?all'
      }
      location.replace(targetUrl)
    }
    goToNextChapter();
  }
  chrome.tabs.executeScript({
    code: '(' + nextChapter + ')();',
  });
}
function mangaparkPrevClick() {
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
function mangaparkNextClick() {
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
function removeNiceOppaiAds() {
  printText(`Remove ads: ${currentUrl}`);
  // let previousChapter;
  function removeAds() {
    function doRemoveAds() {
      let elementList = document.querySelectorAll('.textwidget')
      Array.prototype.forEach.call( elementList, function( node ) {
        node.parentNode.removeChild( node );
    });
    }
    doRemoveAds();
  }
  chrome.tabs.executeScript({
    code: '(' + removeAds + ')();',
  });
}
function mainTask() {
  // Check Niceoppai Web
  let targetUrl;
  handleButton();
  if (isFoundWeb(currentUrl, NICEOPPAIWEB)) {
    currentWeb = NICEOPPAIWEB;
    printText('found niceoppai');
    // removeNiceOppaiAds()
    if (currentUrl.indexOf('?all') === -1) {
      targetUrl = currentUrl + '/?all';
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
