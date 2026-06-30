import { describe, it, expect, beforeEach } from 'vitest';
import { renderTasks, mountApp } from '../src/ui.js';
import { saveTasks, loadTasks } from '../src/tasks.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

function makeRoot() {
  const ul = document.createElement('ul');
  document.body.append(ul);
  return ul;
}

function makeShell() {
  document.body.innerHTML = `
    <form id="add-task-form">
      <input id="new-task-input" type="text" />
      <button id="add-task-btn" type="submit">Add</button>
    </form>
    <ul id="task-list"></ul>
  `;
  return {
    root: document.querySelector('#task-list'),
    input: document.querySelector('#new-task-input'),
    form: document.querySelector('#add-task-form'),
  };
}

function submit(form) {
  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}

describe('renderTasks', () => {
  let root;
  beforeEach(() => {
    root = makeRoot();
  });

  it('renders one row per task with its text', () => {
    renderTasks(
      [
        { id: 'a', text: 'Buy milk', done: false },
        { id: 'b', text: 'Call Sam', done: true },
      ],
      root,
    );
    const items = root.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Buy milk');
    expect(items[1].textContent).toContain('Call Sam');
  });

  it('reflects the done state of each task', () => {
    renderTasks(
      [
        { id: 'a', text: 'Buy milk', done: false },
        { id: 'b', text: 'Call Sam', done: true },
      ],
      root,
    );
    const [first, second] = root.querySelectorAll('li');
    expect(first.classList.contains('done')).toBe(false);
    expect(second.classList.contains('done')).toBe(true);
    expect(first.querySelector('input[type="checkbox"]').checked).toBe(false);
    expect(second.querySelector('input[type="checkbox"]').checked).toBe(true);
  });

  it('tags each row with its task id', () => {
    renderTasks([{ id: 'abc', text: 'Buy milk', done: false }], root);
    expect(root.querySelector('li').dataset.id).toBe('abc');
  });

  it('renders an empty list without error', () => {
    expect(() => renderTasks([], root)).not.toThrow();
    expect(root.querySelectorAll('li')).toHaveLength(0);
  });

  it('replaces previous content on each render', () => {
    renderTasks([{ id: 'a', text: 'Buy milk', done: false }], root);
    renderTasks([{ id: 'b', text: 'Call Sam', done: false }], root);
    const items = root.querySelectorAll('li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('Call Sam');
  });

  it('renders task text as text, not HTML', () => {
    renderTasks([{ id: 'a', text: '<b>x</b>', done: false }], root);
    expect(root.querySelector('li').querySelector('b')).toBeNull();
    expect(root.querySelector('li').textContent).toContain('<b>x</b>');
  });
});

describe('mountApp', () => {
  it('loads persisted tasks and renders them', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: true }]);
    const { root } = makeShell();
    mountApp(root);
    const item = root.querySelector('li');
    expect(item.textContent).toContain('Buy milk');
    expect(item.classList.contains('done')).toBe(true);
  });

  it('renders nothing when there are no persisted tasks', () => {
    const { root } = makeShell();
    mountApp(root);
    expect(root.querySelectorAll('li')).toHaveLength(0);
  });
});

describe('add task interaction', () => {
  it('adds a not-done task from the input on submit', () => {
    const { root, input, form } = makeShell();
    mountApp(root);
    input.value = 'Buy milk';
    submit(form);
    const items = root.querySelectorAll('li');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('Buy milk');
    expect(items[0].classList.contains('done')).toBe(false);
  });

  it('clears the input after adding', () => {
    const { root, input, form } = makeShell();
    mountApp(root);
    input.value = 'Buy milk';
    submit(form);
    expect(input.value).toBe('');
  });

  it('persists the added task', () => {
    const { root, input, form } = makeShell();
    mountApp(root);
    input.value = 'Buy milk';
    submit(form);
    expect(loadTasks()).toHaveLength(1);
    expect(loadTasks()[0].text).toBe('Buy milk');
  });

  it('adds nothing when the input is empty or whitespace', () => {
    const { root, input, form } = makeShell();
    mountApp(root);
    input.value = '   ';
    submit(form);
    expect(root.querySelectorAll('li')).toHaveLength(0);
    expect(loadTasks()).toHaveLength(0);
  });

  it('appends to existing tasks across multiple adds', () => {
    const { root, input, form } = makeShell();
    mountApp(root);
    input.value = 'Buy milk';
    submit(form);
    input.value = 'Call Sam';
    submit(form);
    expect(root.querySelectorAll('li')).toHaveLength(2);
    expect(loadTasks()).toHaveLength(2);
  });
});

describe('remove task interaction', () => {
  it('removes a task from the list and from storage when its control is clicked', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: false }]);
    const { root } = makeShell();
    mountApp(root);
    root.querySelector('li[data-id="a"] .remove').click();
    expect(root.querySelectorAll('li')).toHaveLength(0);
    expect(loadTasks()).toHaveLength(0);
  });

  it('removes only the targeted task, leaving the rest intact', () => {
    saveTasks([
      { id: 'a', text: 'Buy milk', done: false },
      { id: 'b', text: 'Call Sam', done: true },
      { id: 'c', text: 'Book dentist', done: false },
    ]);
    const { root } = makeShell();
    mountApp(root);
    root.querySelector('li[data-id="b"] .remove').click();
    const remaining = loadTasks();
    expect(remaining.map((task) => task.id)).toEqual(['a', 'c']);
    expect(root.querySelector('li[data-id="b"]')).toBeNull();
    expect(root.querySelector('li[data-id="a"]')).not.toBeNull();
    expect(root.querySelector('li[data-id="c"]')).not.toBeNull();
  });
});

describe('edit task interaction', () => {
  function startEdit(root, id) {
    root
      .querySelector(`li[data-id="${id}"] .task-text`)
      .dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    return root.querySelector(`li[data-id="${id}"] .edit-input`);
  }

  it('turns the text into an input on double-click', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: false }]);
    const { root } = makeShell();
    mountApp(root);
    const input = startEdit(root, 'a');
    expect(input).not.toBeNull();
    expect(input.value).toBe('Buy milk');
  });

  it('commits the new text on blur, in place, without duplicating', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: true }]);
    const { root } = makeShell();
    mountApp(root);
    const input = startEdit(root, 'a');
    input.value = 'Buy oat milk';
    input.dispatchEvent(new Event('blur'));
    expect(root.querySelectorAll('li')).toHaveLength(1);
    expect(root.querySelector('li[data-id="a"] .task-text').textContent).toBe('Buy oat milk');
    expect(loadTasks()).toEqual([{ id: 'a', text: 'Buy oat milk', done: true }]);
  });

  it('commits on Enter', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: false }]);
    const { root } = makeShell();
    mountApp(root);
    const input = startEdit(root, 'a');
    input.value = 'Buy oat milk';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(loadTasks()[0].text).toBe('Buy oat milk');
  });

  it('leaves the task unchanged when committed text is empty', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: false }]);
    const { root } = makeShell();
    mountApp(root);
    const input = startEdit(root, 'a');
    input.value = '   ';
    input.dispatchEvent(new Event('blur'));
    expect(root.querySelector('li[data-id="a"] .task-text').textContent).toBe('Buy milk');
    expect(loadTasks()[0].text).toBe('Buy milk');
  });

  it('cancels the edit on Escape without changing the task', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: false }]);
    const { root } = makeShell();
    mountApp(root);
    const input = startEdit(root, 'a');
    input.value = 'Discarded';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(root.querySelector('li[data-id="a"] .task-text').textContent).toBe('Buy milk');
    expect(loadTasks()[0].text).toBe('Buy milk');
  });
});

describe('toggle task interaction', () => {
  it('marks a not-done task as done when its checkbox is toggled', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: false }]);
    const { root } = makeShell();
    mountApp(root);
    root.querySelector('li[data-id="a"] .toggle').click();
    expect(root.querySelector('li[data-id="a"]').classList.contains('done')).toBe(true);
    expect(loadTasks()[0].done).toBe(true);
  });

  it('marks a done task as not-done when its checkbox is toggled', () => {
    saveTasks([{ id: 'a', text: 'Buy milk', done: true }]);
    const { root } = makeShell();
    mountApp(root);
    root.querySelector('li[data-id="a"] .toggle').click();
    expect(root.querySelector('li[data-id="a"]').classList.contains('done')).toBe(false);
    expect(loadTasks()[0].done).toBe(false);
  });

  it('toggles only the targeted task', () => {
    saveTasks([
      { id: 'a', text: 'Buy milk', done: false },
      { id: 'b', text: 'Call Sam', done: false },
    ]);
    const { root } = makeShell();
    mountApp(root);
    root.querySelector('li[data-id="a"] .toggle').click();
    const stored = loadTasks();
    expect(stored.find((task) => task.id === 'a').done).toBe(true);
    expect(stored.find((task) => task.id === 'b').done).toBe(false);
  });
});
