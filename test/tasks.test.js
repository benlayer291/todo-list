import { describe, it, expect } from 'vitest';
import {
  STORAGE_KEY,
  loadTasks,
  saveTasks,
  addTask,
  removeTask,
  editTask,
  toggleTask,
} from '../src/tasks.js';

describe('persistence', () => {
  it('loads an empty list when nothing is stored', () => {
    expect(loadTasks()).toEqual([]);
  });

  it('round-trips tasks and their done states', () => {
    const tasks = [
      { id: 'a', text: 'Buy milk', done: false },
      { id: 'b', text: 'Call Sam', done: true },
    ];
    saveTasks(tasks);
    expect(loadTasks()).toEqual(tasks);
  });

  it('loads an empty list when the stored value is invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    expect(loadTasks()).toEqual([]);
  });
});

describe('addTask', () => {
  it('appends a not-done task with the given text', () => {
    const result = addTask([], 'Buy milk');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ text: 'Buy milk', done: false });
    expect(typeof result[0].id).toBe('string');
    expect(result[0].id.length).toBeGreaterThan(0);
  });

  it('trims surrounding whitespace from the text', () => {
    expect(addTask([], '  Buy milk  ')[0].text).toBe('Buy milk');
  });

  it('returns the same array unchanged when text is empty or whitespace', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    expect(addTask(tasks, '   ')).toBe(tasks);
    expect(addTask(tasks, '')).toBe(tasks);
  });

  it('does not mutate the input array', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    addTask(tasks, 'Buy milk');
    expect(tasks).toHaveLength(1);
  });
});

describe('removeTask', () => {
  it('returns a new array without the matching task', () => {
    const tasks = [
      { id: 'a', text: 'x', done: false },
      { id: 'b', text: 'y', done: false },
    ];
    expect(removeTask(tasks, 'a')).toEqual([{ id: 'b', text: 'y', done: false }]);
  });

  it('does not mutate the input array', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    removeTask(tasks, 'a');
    expect(tasks).toHaveLength(1);
  });
});

describe('editTask', () => {
  it('replaces only the matching task text, leaving done unchanged', () => {
    const tasks = [
      { id: 'a', text: 'Buy milk', done: true },
      { id: 'b', text: 'Call Sam', done: false },
    ];
    expect(editTask(tasks, 'a', 'Buy oat milk')).toEqual([
      { id: 'a', text: 'Buy oat milk', done: true },
      { id: 'b', text: 'Call Sam', done: false },
    ]);
  });

  it('trims the new text', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    expect(editTask(tasks, 'a', '  y  ')[0].text).toBe('y');
  });

  it('leaves the task unchanged when the new text is empty or whitespace', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    expect(editTask(tasks, 'a', '   ')).toEqual(tasks);
  });

  it('does not mutate the input array', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    editTask(tasks, 'a', 'y');
    expect(tasks[0].text).toBe('x');
  });
});

describe('toggleTask', () => {
  it('flips a not-done task to done', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    expect(toggleTask(tasks, 'a')).toEqual([{ id: 'a', text: 'x', done: true }]);
  });

  it('flips a done task to not-done', () => {
    const tasks = [{ id: 'a', text: 'x', done: true }];
    expect(toggleTask(tasks, 'a')).toEqual([{ id: 'a', text: 'x', done: false }]);
  });

  it('only flips the matching task', () => {
    const tasks = [
      { id: 'a', text: 'x', done: false },
      { id: 'b', text: 'y', done: false },
    ];
    expect(toggleTask(tasks, 'a')[1].done).toBe(false);
  });

  it('does not mutate the input array', () => {
    const tasks = [{ id: 'a', text: 'x', done: false }];
    toggleTask(tasks, 'a');
    expect(tasks[0].done).toBe(false);
  });
});
