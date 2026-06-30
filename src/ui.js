import { loadTasks, saveTasks, addTask, removeTask, editTask, toggleTask } from './tasks.js';

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

  root.addEventListener('change', (event) => {
    if (!event.target.matches('.toggle')) return;
    const id = event.target.closest('li').dataset.id;
    tasks = toggleTask(tasks, id);
    saveTasks(tasks);
    renderTasks(tasks, root);
  });

  root.addEventListener('dblclick', (event) => {
    if (!event.target.matches('.task-text')) return;
    startEditing(event.target);
  });

  function startEditing(textSpan) {
    const id = textSpan.closest('li').dataset.id;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = textSpan.textContent;
    textSpan.replaceWith(input);
    input.focus();

    let done = false;
    const finish = (commit) => {
      if (done) return;
      done = true;
      if (commit) tasks = editTask(tasks, id, input.value);
      saveTasks(tasks);
      renderTasks(tasks, root);
    };

    input.addEventListener('blur', () => finish(true));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') input.blur();
      else if (event.key === 'Escape') finish(false);
    });
  }
}
