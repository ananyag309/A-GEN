// script.js - Persistent data layer and UI rendering for ColorfulTodo

// Storage key used in localStorage
const STORAGE_KEY = 'colorfulTodo.tasks';

/**
 * Task class representing a single todo item.
 * @property {string} id - Unique identifier (UUID).
 * @property {string} text - Task description.
 * @property {string|null} dueDate - ISO date string or null.
 * @property {boolean} completed - Completion status.
 * @property {number} order - Ordering index for display.
 */
class Task {
  /**
   * @param {Object} param0
   * @param {string} [param0.id] - If omitted a new UUID will be generated.
   * @param {string} param0.text
   * @param {string|null} [param0.dueDate]
   * @param {boolean} [param0.completed]
   * @param {number} [param0.order]
   */
  constructor({ id = generateId(), text, dueDate = null, completed = false, order = 0 } = {}) {
    this.id = id;
    this.text = text;
    this.dueDate = dueDate;
    this.completed = completed;
    this.order = order;
  }
}

/** Generate a new UUID using the Web Crypto API */
function generateId() {
  // crypto.randomUUID is widely supported in modern browsers.
  return crypto.randomUUID();
}

/**
 * Load tasks from localStorage.
 * @returns {Task[]} Sorted array of Task instances.
 */
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    // Ensure we have an array; map plain objects to Task instances.
    const tasks = Array.isArray(parsed)
      ? parsed.map(item => new Task(item))
      : [];
    // Sort by the `order` property to maintain UI order.
    tasks.sort((a, b) => a.order - b.order);
    return tasks;
  } catch (e) {
    console.error('Failed to parse tasks from localStorage:', e);
    return [];
  }
}

/**
 * Save an array of tasks to localStorage.
 * @param {Task[]} tasks
 */
function saveTasks(tasks) {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e);
  }
}

// ---------------------------------------------------------------------------
// UI Rendering Layer
// ---------------------------------------------------------------------------

// DOM element references (imported from index.html)
const taskListEl = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const newTaskDate = document.getElementById('new-task-date');
const addTaskBtn = document.getElementById('add-task-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Global in‑memory task list – will be kept in sync with localStorage.
let tasks = loadTasks();

/**
 * Apply the current filter to the rendered list.
 * @param {string} filter - "all", "active" or "completed"
 */
function applyFilter(filter) {
  const items = taskListEl.children;
  for (const li of items) {
    const taskId = li.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) continue;
    let visible = true;
    if (filter === 'active') visible = !task.completed;
    else if (filter === 'completed') visible = task.completed;
    // "all" leaves visible = true
    li.style.display = visible ? '' : 'none';
  }
}

/**
 * Render the task list UI.
 * @param {string} [filter='all'] - Current filter to apply after rendering.
 */
function renderTasks(filter = 'all') {
  // Clear existing content.
  taskListEl.innerHTML = '';

  // Ensure tasks are sorted by their `order` property.
  tasks.sort((a, b) => a.order - b.order);

  // Build DOM for each task.
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    // Checkbox for completion toggle.
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'complete-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      // Persist and re‑render.
      saveTasks(tasks);
      renderTasks(filter);
    });
    li.appendChild(checkbox);

    // Container for text and optional due date.
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    // Editable text span.
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.contentEditable = 'true';
    textSpan.textContent = task.text;
    // Save changes on blur (or Enter key).
    const commitText = () => {
      const newText = textSpan.textContent.trim();
      if (newText && newText !== task.text) {
        task.text = newText;
        saveTasks(tasks);
      }
    };
    textSpan.addEventListener('blur', commitText);
    textSpan.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        textSpan.blur();
      }
    });
    contentDiv.appendChild(textSpan);

    // Optional due date.
    if (task.dueDate) {
      const timeEl = document.createElement('time');
      timeEl.className = 'task-due';
      timeEl.datetime = task.dueDate;
      const dateObj = new Date(task.dueDate);
      // Use locale date string for readability.
      timeEl.textContent = dateObj.toLocaleDateString();
      contentDiv.appendChild(timeEl);
    }
    li.appendChild(contentDiv);

    // Delete button.
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '✖';
    deleteBtn.addEventListener('click', () => {
      // Remove from the array.
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks(tasks);
      renderTasks(filter);
    });
    li.appendChild(deleteBtn);

    taskListEl.appendChild(li);
  }

  // Apply the requested filter after the list is built.
  applyFilter(filter);
}

/**
 * Helper to add a new task based on the input fields.
 */
function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;
  const dueDateValue = newTaskDate.value ? new Date(newTaskDate.value).toISOString() : null;
  // Determine the next order value (append to end).
  const maxOrder = tasks.length ? Math.max(...tasks.map(t => t.order)) : 0;
  const newTask = new Task({ text, dueDate: dueDateValue, order: maxOrder + 1 });
  tasks.push(newTask);
  saveTasks(tasks);
  newTaskInput.value = '';
  newTaskDate.value = '';
  renderTasks(currentFilter);
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------

let currentFilter = 'all'; // Tracks the active filter for re‑renders.

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active UI state.
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks(currentFilter);
  });
});

// Simple dark‑mode toggle – not part of the core rendering spec but referenced in UI.
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    // Persist theme preference if desired (optional).
  });
}

// Initial render on page load.
// Ensure the filter button for "all" is marked active.
const defaultFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
if (defaultFilterBtn) defaultFilterBtn.classList.add('active');
renderTasks(currentFilter);

// Export for potential external use (tests, other modules).
window.renderTasks = renderTasks;
window.applyFilter = applyFilter;
window.addTask = addTask;
window.tasks = tasks;

// Export persistence helpers (already exported earlier, but keep for clarity).
window.loadTasks = loadTasks;
window.saveTasks = saveTasks;
window.Task = Task;
