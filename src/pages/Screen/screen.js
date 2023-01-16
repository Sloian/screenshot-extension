chrome.runtime.sendMessage('get-user-data', (response) => {
  const img = document.createElement('img');
  img.src = response;
  document.body.append(img);
});
