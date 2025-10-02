// ===== Select DOM Elements =====
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");
const tagsInput = document.getElementById("tags");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed");
const sortBtn = document.getElementById("sort-btn");

// ===== Task Array (load from localStorage if available) =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ===== Utility: Save to localStorage =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== Render Tasks =====
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true; // all
  });

  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(index));

    // Title
    const title = document.createElement("span");
    title.textContent = task.title;
    title.className = "task-title";
    if (task.completed) title.classList.add("completed");

    // Meta info (date + priority + tags)
    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.textContent = [
      task.dueDate ? `Due: ${task.dueDate}` : "",
      `Priority: ${task.priority}`,
      task.tags ? `Tags: ${task.tags}` : ""
    ].filter(Boolean).join(" | ");

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "action-btn";
    delBtn.addEventListener("click", () => deleteTask(index));

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(meta);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

// ===== Add Task =====
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = {
    title: taskInput.value.trim(),
    dueDate: dueDateInput.value,
    priority: priorityInput.value,
    tags: tagsInput.value.trim(),
    completed: false,
  };

  if (newTask.title !== "") {
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
  }
});

// ===== Toggle Complete =====
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// ===== Delete Task =====
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// ===== Filters =====
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== Clear Completed =====
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// ===== Sort by Due Date =====
sortBtn.addEventListener("click", () => {
  tasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  saveTasks();
  renderTasks();
});

// ===== Render Tasks =====
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Checkbox for main task
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(index));

    // Title
    const title = document.createElement("span");
    title.textContent = task.title;
    title.className = "task-title";
    if (task.completed) title.classList.add("completed");

    // Meta info
    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.textContent = [
      task.dueDate ? `Due: ${task.dueDate}` : "",
      `Priority: ${task.priority}`,
      task.tags ? `Tags: ${task.tags}` : ""
    ].filter(Boolean).join(" | ");

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "action-btn";
    delBtn.addEventListener("click", () => deleteTask(index));

    // ===== Subtasks Section =====
    const subtaskContainer = document.createElement("div");
    subtaskContainer.className = "subtasks";

    // Subtask list
    const subtaskList = document.createElement("ul");
    subtaskList.className = "subtask-list";

    task.subtasks.forEach((sub, sIndex) => {
      const subLi = document.createElement("li");

      const subCheckbox = document.createElement("input");
      subCheckbox.type = "checkbox";
      subCheckbox.checked = sub.completed;
      subCheckbox.addEventListener("change", () =>
        toggleSubtask(index, sIndex)
      );

      const subTitle = document.createElement("span");
      subTitle.textContent = sub.title;
      if (sub.completed) subTitle.classList.add("completed");

      const subDelBtn = document.createElement("button");
      subDelBtn.textContent = "✕";
      subDelBtn.className = "action-btn";
      subDelBtn.addEventListener("click", () => deleteSubtask(index, sIndex));

      subLi.appendChild(subCheckbox);
      subLi.appendChild(subTitle);
      subLi.appendChild(subDelBtn);
      subtaskList.appendChild(subLi);
    });

    // Subtask add form
    const subtaskForm = document.createElement("form");
    subtaskForm.className = "subtask-form";
    const subInput = document.createElement("input");
    subInput.type = "text";
    subInput.placeholder = "Add subtask...";
    subInput.required = true;

    subtaskForm.appendChild(subInput);
    subtaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      addSubtask(index, subInput.value.trim());
      subInput.value = "";
    });

    // ===== Progress Indicator =====
    const progress = document.createElement("div");
    progress.className = "task-progress";

    if (task.subtasks.length > 0) {
      const completedCount = task.subtasks.filter(s => s.completed).length;
      const total = task.subtasks.length;
      const percent = Math.round((completedCount / total) * 100);

      progress.textContent = `Progress: ${completedCount}/${total} (${percent}%)`;
    } else {
      progress.textContent = "No subtasks yet";
    }

    subtaskContainer.appendChild(progress);
    subtaskContainer.appendChild(subtaskList);
    subtaskContainer.appendChild(subtaskForm);

    // ===== Append to li =====
    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(meta);
    li.appendChild(delBtn);
    li.appendChild(subtaskContainer);

    taskList.appendChild(li);
  });
}

// ===== Initial Render =====
renderTasks();
