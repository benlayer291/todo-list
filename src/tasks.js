export const STORAGE_KEY = 'todo-list.tasks';

export function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
