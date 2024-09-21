const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearAllBtn = document.getElementById('clearAllBtn');

let editTodo = null;

// Function to add todo
const addTodo = (event) => {
    event.preventDefault(); // Prevent any default action
    const inputText = inputBox.value.trim();
    
    if (inputText.length <= 0) {
        alert("You must write something in your to do");
        return false;
    }

    if (addBtn.value === "Edit") {
        editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
        editTodo.target.previousElementSibling.innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    } else {
        // Creating li element
        const li = document.createElement("li");
        li.addEventListener('click', toggleChecked); // Add event listener for checking/unchecking
        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);

        // Creating Edit Btn
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Creating Delete Btn
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);  // Append the new item to the list
        inputBox.value = "";       // Clear the input box after adding

        saveLocalTodos(inputText); // Save to local storage
    }
};

// Function to toggle checked/unchecked
const toggleChecked = (e) => {
    if (e.target.tagName === 'LI' || e.target.tagName === 'P') {
        e.currentTarget.classList.toggle('checked');
    }
};

// Function to update: (Edit/Delete) todo
const updateTodo = (e) => {
    if (e.target.innerHTML === "Remove") {
        todoList.removeChild(e.target.parentElement);
        deleteLocalTodos(e.target.parentElement);
    }

    if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }
};

// Function to clear all tasks and reset the Add button
const clearAllTodos = () => {
    todoList.innerHTML = '';
    localStorage.removeItem('todos');
    addBtn.value = "Add"; // Reset the button back to Add mode
    inputBox.value = "";  // Clear the input box
};

// Function to save local todo
const saveLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Function to get local todos on page load
const getLocalTodos = () => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach(todo => {
            // Creating li element
            const li = document.createElement("li");
            li.addEventListener('click', toggleChecked); // Add event listener for checking/unchecking
            const p = document.createElement("p");
            p.innerHTML = todo;
            li.appendChild(p);

            // Creating Edit Btn
            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "editBtn");
            li.appendChild(editBtn);

            // Creating Delete Btn
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("btn", "deleteBtn");
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }
};

// Function to delete local todo
const deleteLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    let todoText = todo.children[0].innerHTML;
    let todoIndex = todos.indexOf(todoText);
    todos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Function to edit local todo
const editLocalTodos = (todo) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoIndex = todos.indexOf(todo);
    todos[todoIndex] = inputBox.value;
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Event listeners
document.addEventListener('DOMContentLoaded', getLocalTodos); // Load local todos when DOM is loaded
addBtn.addEventListener('click', addTodo);                    // Add todo event listener
todoList.addEventListener('click', updateTodo);               // Update todo (edit/delete) event listener
clearAllBtn.addEventListener('click', clearAllTodos);         // Clear all tasks event listener
