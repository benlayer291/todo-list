import { loadTasks } from './tasks.js';

function createTaskItem(task) {
  const item = document.createElement('li');
  item.className = task.done ? 'task done' : 'task';
  item.dataset.id = task.id;

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'toggle';
  toggle.checked = task.done;

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  item.append(toggle, text);
  return item;
}

export function renderTasks(tasks, root) {
  root.replaceChildren(...tasks.map(createTaskItem));
}

export function mountApp(root) {
  renderTasks(loadTasks(), root);
}
