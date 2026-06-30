import { loadTasks, saveTasks, addTask, removeTask } from './tasks.js';

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

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove';
  remove.textContent = 'Remove';

  item.append(toggle, text, remove);
  return item;
}

export function renderTasks(tasks, root) {
  root.replaceChildren(...tasks.map(createTaskItem));
}

export function mountApp(root) {
  let tasks = loadTasks();
  renderTasks(tasks, root);

  const form = document.querySelector('#add-task-form');
  const input = document.querySelector('#new-task-input');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const next = addTask(tasks, input.value);
    if (next === tasks) return;
    tasks = next;
    saveTasks(tasks);
    renderTasks(tasks, root);
    input.value = '';
  });

  root.addEventListener('click', (event) => {
    if (!event.target.matches('.remove')) return;
    const id = event.target.closest('li').dataset.id;
    tasks = removeTask(tasks, id);
    saveTasks(tasks);
    renderTasks(tasks, root);
  });
}
