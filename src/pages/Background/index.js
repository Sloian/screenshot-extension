let url;

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.captureVisibleTab((dataUrl) => {
    chrome.downloads.download({
      filename: "screenshot.jpg",
      url: dataUrl
    })
    url = dataUrl
    showReadme();
  });

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      sendResponse(`${url}`);
    }
  )
})

function showReadme(info, tab) {
  const url = chrome.runtime.getURL("screen.html");
  chrome.tabs.create({ url });
}

