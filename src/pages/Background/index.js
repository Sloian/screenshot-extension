let url;

chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.captureVisibleTab((dataUrl) => {
    chrome.downloads.download({
      filename: "screenshot.jpg",
      url: dataUrl
    })
    url = dataUrl
    showReadme();
  });

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      sendResponse(`${url}`);
    }
  )
})

function showReadme(info, tab) {
  let url = chrome.runtime.getURL("screen.html");
  chrome.tabs.create({ url });
}

