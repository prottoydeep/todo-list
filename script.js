const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearAllBtn = document.getElementById('clearAllBtn');

let editTodo = null;

const addTodo = (event) => {
    event.preventDefault(); 
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
        const li = document.createElement("li");
        li.addEventListener('click', toggleChecked); 

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation(); 
            li.classList.toggle('checked', checkbox.checked);
            updateLocalTodoCheckedState(inputText, checkbox.checked);
        });
        li.appendChild(checkbox);

        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);  
        inputBox.value = "";       

        
        saveLocalTodos(inputText, false); 
    }
};

const toggleChecked = (e) => {
    if (e.target.tagName === 'LI' || e.target.tagName === 'P') {
        const checkbox = e.currentTarget.querySelector("input[type='checkbox']");
        checkbox.checked = !checkbox.checked; 
        checkbox.dispatchEvent(new Event('change')); 
    }
};

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

const clearAllTodos = () => {
    todoList.innerHTML = '';
    localStorage.removeItem('todos');
    addBtn.value = "Add"; 
    inputBox.value = "";  
};

const saveLocalTodos = (todo, isChecked) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({ text: todo, checked: isChecked });
    localStorage.setItem("todos", JSON.stringify(todos));
};

const getLocalTodos = () => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
        todos.forEach(({ text, checked }) => {
            const li = document.createElement("li");
            li.classList.toggle('checked', checked); 

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox");
            checkbox.checked = checked; 
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation(); // Prevent li click event
                li.classList.toggle('checked', checkbox.checked);
                updateLocalTodoCheckedState(text, checkbox.checked);
            });
            li.appendChild(checkbox);

            const p = document.createElement("p");
            p.innerHTML = text;
            li.appendChild(p);

            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "editBtn");
            li.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("btn", "deleteBtn");
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }
};

const deleteLocalTodos = (todo) => {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    let todoText = todo.children[1].innerHTML;
    let todoIndex = todos.findIndex(t => t.text === todoText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
};

const editLocalTodos = (todo) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoIndex = todos.findIndex(t => t.text === todo);
    todos[todoIndex].text = inputBox.value;
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateLocalTodoCheckedState = (todoText, isChecked) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex !== -1) {
        todos[todoIndex].checked = isChecked; 
        localStorage.setItem("todos", JSON.stringify(todos));
    }
};

document.addEventListener('DOMContentLoaded', getLocalTodos); 
addBtn.addEventListener('click', addTodo);                    
todoList.addEventListener('click', updateTodo);               
clearAllBtn.addEventListener('click', clearAllTodos);
