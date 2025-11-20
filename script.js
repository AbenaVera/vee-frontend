var form = document.getElementById("taskForm");
var url ="http://localhost:8000"
// var url ="https://prefunctional-sana-directorial.ngrok-free-dev"

// invoke the getAllTasks function when the page loads
getAllTasks();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  e.stopPropagation();

  var formData = new FormData(form);

  var task = {
    title: formData.getAll("taskTitle")[0],
    description: formData.getAll("taskDescription")[0],
    user_id: +formData.getAll("user_id")[0],
    status: formData.getAll("status")[0],
    priority: Number(formData.getAll("taskPriority")[0]),
  };

  
  create_new_task(task)
}); 

async function create_new_task(task) {
    var data = JSON.stringify(task);
    console.log(`request body: ${data}`);
    
  try {
    const response = await fetch(`${url}/api/tasks`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: data,
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    getAllTasks();
    alert("Task created successfully!");
  } catch (error) {
    console.error(error);
    alert("Error creating task: " + error.message);
  }
}

async function getAllTasks() {
    
    try {
        const response = await fetch(`${url}/api/tasks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(result);
        
        // Optionally update the UI with the task list
        updateTaskList(result);
    } catch (error) {
        console.error(error);
    }
}

function updateTaskList(tasks) {
    console.log("Updating task list with:", tasks);
    
    const taskListElement = document.getElementById("taskList");
    
    // Clear existing tasks
    taskListElement.innerHTML = "";
    
    // Check if tasks is an array and has items
    if (!Array.isArray(tasks) || tasks.length === 0) {
        taskListElement.innerHTML = '<p class="no-tasks">No tasks available. Create your first task!</p>';
        return;
    }
    
    // Create task cards for each task
    tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.dataset.status = task.status || "active";
        
        // Determine priority class
        const priorityClass = task.priority >= 3 ? "high" : task.priority === 2 ? "medium" : "low";
        
        taskCard.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${task.title || "Untitled Task"}</h3>
                <span class="task-priority ${priorityClass}">Priority: ${task.priority || "N/A"}</span>
            </div>
            <p class="task-description">${task.description || "No description provided"}</p>
            <div class="task-footer">
                <span class="task-status">${task.status || "active"}</span>
                <span class="task-user">User ID: ${task.user_id || "N/A"}</span>
            </div>
            <div class="task-actions">
                <button class="btn-small btn-edit" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        taskListElement.appendChild(taskCard);
    });
}

function editTask(taskId) {
    console.log("Edit task:", taskId);
    // TODO: Implement edit functionality
    alert(`Edit task ${taskId} - Feature coming soon!`);
}

async function deleteTask(taskId) {
    if (!confirm(`Are you sure you want to delete task ${taskId}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${url}/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }
        
        console.log(`Task ${taskId} deleted successfully`);
        // Refresh the task list
        getAllTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
    }
}




