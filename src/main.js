import { mountApp } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
  mountApp(document.querySelector('#task-list'));
});
