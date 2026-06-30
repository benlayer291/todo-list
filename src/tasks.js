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

export function addTask(tasks, text) {
  const trimmed = text.trim();
  if (trimmed === '') return tasks;
  return [...tasks, { id: crypto.randomUUID(), text: trimmed, done: false }];
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}
