var form = document.getElementById("taskForm");
var url ="http://192.168.1.205:8000"
// var url ="https://prefunctional-sana-directorial.ngrok-free-dev"

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
  } catch (error) {
    console.error(error);
  }
}
