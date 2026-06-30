import { describe, it, expect, beforeEach } from 'vitest';
import { renderTasks, mountApp } from '../src/ui.js';
import { saveTasks } from '../src/tasks.js';

function makeRoot() {
  const ul = document.createElement('ul');
  document.body.append(ul);
  return ul;
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
    const root = makeRoot();
    mountApp(root);
    const item = root.querySelector('li');
    expect(item.textContent).toContain('Buy milk');
    expect(item.classList.contains('done')).toBe(true);
  });

  it('renders nothing when there are no persisted tasks', () => {
    const root = makeRoot();
    mountApp(root);
    expect(root.querySelectorAll('li')).toHaveLength(0);
  });
});
