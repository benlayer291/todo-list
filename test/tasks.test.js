import { describe, it, expect } from 'vitest';
import { STORAGE_KEY, loadTasks, saveTasks } from '../src/tasks.js';

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
