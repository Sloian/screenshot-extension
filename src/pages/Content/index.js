import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// function logTabs(tabs) {
//   for (const tab of tabs) {
//     // tab.url requires the `tabs` permission or a matching host permission.
//     console.log('fdsfdsfdsfdsfdsfds', tab.url);
//   }
// }

// function onError(error) {
//   console.error(`Error: ${error}`);
// }

// browser.tabs.query({ currentWindow: true }).then(logTabs, onError);
