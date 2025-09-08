// Load tasks when page loads
window.onload = function() {
    loadTasks();
};

function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let task = { text: taskText, done: false };
    saveTask(task);

    input.value = "";
    loadTasks(); // refresh list
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // clear old list

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        if (task.done) li.classList.add("done");

        let span = document.createElement("span");
        span.textContent = task.text;

        // Buttons
        let buttonDiv = document.createElement("div");
        buttonDiv.classList.add("task-buttons");

        // Edit Button
        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function() {
            let newTask = prompt("Edit your task:", span.textContent);
            if (newTask !== null && newTask.trim() !== "") {
                tasks[index].text = newTask.trim();
                localStorage.setItem("tasks", JSON.stringify(tasks));
                loadTasks();
            }
        };

        // Done Button
        let doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.onclick = function() {
            tasks[index].done = !tasks[index].done;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        };

        // Delete Button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function() {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        };

        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(doneBtn);
        buttonDiv.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(buttonDiv);

        taskList.appendChild(li);
    });
}
