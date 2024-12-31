document.addEventListener("DOMContentLoaded", loadTasks);  

function addTask() {  
    const taskInput = document.getElementById('taskInput');  
    const reminderInput = document.getElementById('reminderInput');  
    const taskPriority = document.getElementById('taskPriority');  
    
    const taskValue = taskInput.value.trim();  
    const reminderValue = reminderInput.value;  
    const priorityValue = taskPriority.value;  

    if (taskValue === '') {  
        alert('Please enter a task!');  
        return;  
    }  

    const taskItem = document.createElement('li');  
    taskItem.classList.add(priorityValue);  
    taskItem.innerHTML = `  
        <span contenteditable="true" onblur="updateTask(this)">${taskValue} ${reminderValue ? `- Reminder: ${new Date(reminderValue).toLocaleString()}` : ''}</span>  
        <div>  
            <input type="checkbox" onclick="markAsDone(this)">  
            <button onclick="deleteTask(this)">❌</button>  
        </div>  
    `;  

    document.getElementById('todoList').appendChild(taskItem);  
    saveTasks();  
    updateTaskCount();  
    clearInputs();  
}  

function markAsDone(checkbox) {  
    const taskItem = checkbox.parentElement.parentElement;  

    if (checkbox.checked) {  
        taskItem.classList.add('done');  
        document.getElementById('doneList').appendChild(taskItem);  
    } else {  
        taskItem.classList.remove('done');  
        document.getElementById('todoList').appendChild(taskItem);  
    }  
    saveTasks();  
    updateTaskCount();  
}  

function deleteTask(button) {  
    const taskItem = button.parentElement.parentElement;  
    taskItem.remove();  
    saveTasks();  
    updateTaskCount();  
}  

function updateTask(element) {  
    const taskItem = element.parentElement;  
    saveTasks();  
}  

function filterTasks(filter) {  
    const allTasks = document.querySelectorAll('ul li');  
    allTasks.forEach(task => {  
        task.style.display = 'flex'; // Default to show all  

        if (filter === 'completed' && !task.classList.contains('done')) {  
            task.style.display = 'none';  
        } else if (filter === 'pending' && task.classList.contains('done')) {  
            task.style.display = 'none';  
        } else if (filter === 'urgent' && !task.classList.contains('high')) {  
            task.style.display = 'none';  
        }  
    });  
}  

function updateTaskCount() {  
    const totalTasks = document.querySelectorAll('#todoList li').length;  
    const doneTasks = document.querySelectorAll('#doneList li').length;  

    document.getElementById('taskCount').innerText = `(${totalTasks} tasks - ${doneTasks} completed)`;  
}  

function saveTasks() {  
    const tasks = [];  
    document.querySelectorAll('ul li').forEach(task => {  
        tasks.push({  
            text: task.firstChild.textContent,  
            done: task.classList.contains('done'),  
            priority: task.classList.item(0)  
        });  
    });  
    localStorage.setItem('tasks', JSON.stringify(tasks));  
}  

function loadTasks() {  
    const tasks = JSON.parse(localStorage.getItem('tasks'));  
    if (tasks) {  
        tasks.forEach(task => {  
            const taskItem = document.createElement('li');  
            taskItem.classList.add(task.priority);  
            if (task.done) {  
                taskItem.classList.add('done');  
            }  
            taskItem.innerHTML = `  
                <span contenteditable="true" onblur="updateTask(this)">${task.text}</span>  
                <div>  
                    <input type="checkbox" ${task.done ? 'checked' : ''} onclick="markAsDone(this)">  
                    <button onclick="deleteTask(this)">❌</button>  
                </div>  
            `;  
            const targetList = task.done ? document.getElementById('doneList') : document.getElementById('todoList');  
            targetList.appendChild(taskItem);  
        });  
    }  
    updateTaskCount();  
}  

function clearInputs() {  
    document.getElementById('taskInput').value = '';  
    document.getElementById('reminderInput').value = '';  
    document.getElementById('taskPriority').selectedIndex = 0;  
}