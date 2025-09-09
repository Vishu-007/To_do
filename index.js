import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firestore reference (db is injected in window from index.html)
const db = window.db;
const tasksRef = collection(db, "tasks");

// Load tasks in real-time
onSnapshot(tasksRef, (snapshot) => {
  console.log("🔄 Tasks updated:", snapshot.docs.length);
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const taskId = docSnap.id;

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
    editBtn.onclick = async function () {
      let newTask = prompt("Edit your task:", span.textContent);
      if (newTask !== null && newTask.trim() !== "") {
        try {
          await updateDoc(doc(db, "tasks", taskId), { text: newTask.trim() });
        } catch (err) {
          console.error("❌ Error updating task:", err);
        }
      }
    };

    // Done Button
    let doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.onclick = async function () {
      try {
        await updateDoc(doc(db, "tasks", taskId), { done: !task.done });
      } catch (err) {
        console.error("❌ Error marking task done:", err);
      }
    };

    // Delete Button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async function () {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
      } catch (err) {
        console.error("❌ Error deleting task:", err);
      }
    };

    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(doneBtn);
    buttonDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonDiv);

    taskList.appendChild(li);
  });
});

// Add a task
async function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  try {
    await addDoc(tasksRef, { text: taskText, done: false });
    console.log("✅ Task added:", taskText);
  } catch (err) {
    console.error("❌ Error adding task:", err);
    alert("Could not add task. Check console for details.");
  }

  input.value = "";
}

// Expose addTask to window so HTML button works
window.addTask = addTask;
