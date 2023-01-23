let url;
let activeTab;

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.captureVisibleTab((dataUrl) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      activeTab = tabs[0].id;
      console.log(tabs[0])
    });
    console.log(activeTab);
    url = dataUrl
    showReadme();
  });

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      sendResponse({ url, activeTab });
    }
  )
})

function showReadme(info, tab) {
  const url = chrome.runtime.getURL("screen.html");
  chrome.tabs.create({ url });
}

