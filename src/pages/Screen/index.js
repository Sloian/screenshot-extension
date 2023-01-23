
// chrome.runtime.sendMessage('get-user-data', (response) => {
//   const img = document.createElement('img');
//   img.src = response;
//   document.body.append(img);
// });


import React from 'react';
import { render } from 'react-dom';

import Screen from '../../components/Screen';

render(<Screen />,
  window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();




