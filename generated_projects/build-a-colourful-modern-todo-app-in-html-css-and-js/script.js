// Get tasks from database.json
const tasks = JSON.parse(read_file('database.json')).tasks;

// Function to render task list
function renderTaskList(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `${task.name} - Due: ${task.dueDate} - Priority: ${task.priority}`;
        taskList.appendChild(taskElement);
    });
}

// Render task list on page load
renderTaskList(tasks);

// Add event listener to create task form
document.getElementById('create-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;
    const newTask = { name: taskName, dueDate: dueDate, priority: priority };
    tasks.push(newTask);
    renderTaskList(tasks);
    write_file('database.json', JSON.stringify({ tasks: tasks }));
});

// Add event listener to delete task
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const taskIndex = e.target.dataset.taskIndex;
        tasks.splice(taskIndex, 1);
        renderTaskList(tasks);
        write_file('database.json', JSON.stringify({ tasks: tasks }));
    }
});

// Add event listener to update task
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('update-task')) {
        const taskIndex = e.target.dataset.taskIndex;
        const taskName = prompt('Enter new task name:');
        const dueDate = prompt('Enter new due date:');
        const priority = prompt('Enter new priority:');
        tasks[taskIndex].name = taskName;
        tasks[taskIndex].dueDate = dueDate;
        tasks[taskIndex].priority = priority;
        renderTaskList(tasks);
        write_file('database.json', JSON.stringify({ tasks: tasks }));
    }
});
