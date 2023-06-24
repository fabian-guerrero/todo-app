import iconCross from "../../static/icon-cross.svg";
import iconCheck from "../../static/icon-check.svg";

const addTodoButton = document.getElementById("add-todo");
const showAllButton = document.getElementById("show-all");
const showActiveButton = document.getElementById("show-active");
const showCompletedButton = document.getElementById("show-completed");
const clearCompleted = document.getElementById("clear-completed");
const themeTogglerButton = document.getElementById("theme-toggler");
let todoInput = document.getElementById("todo-input");
let todosListWrapper = document.getElementById("todos-list");
let informationWrapper = document.getElementById("information-wrapper");
let itemsLeft = document.getElementById("items-left");
let savedTodos = JSON.parse(localStorage.getItem("savedTodos")) || [];

if (localStorage.getItem("savedTodos")) {
    savedTodos.map((task) => {
        loadFromLocalStorage(task);
    });
}

function loadFromLocalStorage(todoTask){
    let loadTodo =`<div id=${todoTask.id} class="todo-item ${todoTask.isCompleted ? "completed" : ""}" data-status=${todoTask.isCompleted ? "completed" : "incomplete"}>
            <div class="add-todo-wrapper">
                <div class="add-todo ${todoTask.isCompleted ? "checked" : "" }">
                    <img class="icon-check" src=${iconCheck}>
                    <span class="white-background"></span>
                </div>
            </div>
            <div class="text-clear-wrapper">
                <p class="todo-text">${todoTask.taskName}</p>
                <img class="icon-clear" src=${iconCross}>
            </div>
        </div>`

    todosListWrapper.insertAdjacentHTML("afterbegin",loadTodo);
}

function newTodo(){
    addTodoButton.parentElement.classList.add('completed');
    addTodoButton.classList.add('checked');
    let todoInputValue = todoInput.value.replace(/\s+/g, ' ').trim();

    if (todoInputValue == ''){
        addTodoButton.parentElement.classList.remove('completed');
        addTodoButton.classList.remove('checked');
        todoInput.value="";
        return false
    }else{
        const todoTask = {
            id: new Date().getTime(),
            taskName: todoInputValue,
            isCompleted: false
        };

        createTodo(todoTask);
        showInformationWrapper();

        savedTodos.push(todoTask);
        localStorage.setItem("savedTodos", JSON.stringify(savedTodos));

        setTimeout(() => {
            addTodoButton.parentElement.classList.remove('completed');
            addTodoButton.classList.remove('checked');
            todoInput.value="";
        }, 500);
    }
}

function createTodo(todoTask){
    console.log(todoTask);
    let todoMarkup =`<div id=${todoTask.id} class="todo-item" data-status="incomplete">
        <div class="add-todo-wrapper">
            <div class="add-todo">
                <img class="icon-check" src=${iconCheck}>
                <span class="white-background"></span>
            </div>
        </div>
        <div class="text-clear-wrapper">
            <p class="todo-text">${todoTask.taskName}</p>
            <img class="icon-clear" src=${iconCross}>
        </div>
    </div>`

    todosListWrapper.insertAdjacentHTML("afterbegin",todoMarkup);
}

function clickedOnItem(e){
    const clickedTodoID = e.target.closest(".todo-item").id;

    const taskUpdate = savedTodos.find((todoTask) => todoTask.id === parseInt(clickedTodoID));
    taskUpdate.isCompleted = !taskUpdate.isCompleted;
    localStorage.setItem("savedTodos", JSON.stringify(savedTodos));

    let targetClicked = e.target;

    if (targetClicked.classList.contains('icon-clear')) {
        targetClicked.closest('.todo-item').remove();
        savedTodos = savedTodos.filter((todoTask) => todoTask.id !== parseInt(clickedTodoID));
        localStorage.setItem("savedTodos", JSON.stringify(savedTodos));
    }

    if (targetClicked.classList.contains('add-todo')) {
        targetClicked.classList.toggle('checked');
        targetClicked.closest('.todo-item').classList.toggle('completed');
        if (targetClicked.closest('.todo-item').getAttribute('data-status') === "incomplete"){
            targetClicked.closest('.todo-item').setAttribute("data-status", "complete");

        }else{
            targetClicked.closest('.todo-item').setAttribute("data-status", "incomplete");
        }
    }

    if (targetClicked.classList.contains('todo-text')) {
        let todoWrapper = targetClicked.closest('.todo-item').querySelector('.add-todo');
        targetClicked.closest('.todo-item').classList.toggle('completed');
        todoWrapper.classList.toggle('checked');
    }

    showInformationWrapper();
}

function showInformationWrapper(){
    if (todosListWrapper.childNodes.length > '1'){
        let itemsCount = todosListWrapper.childNodes.length;
        informationWrapper.classList.remove('hide');
        itemsLeft.innerHTML = itemsCount - 1;
    }else{
        informationWrapper.classList.add('hide')
    }
}

function showAllTodos(){
    let allTodos = document.querySelectorAll('.todo-item');

    allTodos.forEach(element => {
        if (element.classList.contains('hide')){
            element.classList.remove('hide');
            itemsLeft.innerHTML = allTodos.length;
        }
    });

    showActiveButton.classList.remove('selected');
    showAllButton.classList.add('selected');
    showCompletedButton.classList.remove('selected');
}

function showActiveTodos(){
    let activeTodos = document.querySelectorAll('.todo-item');
    let activeCount = document.querySelectorAll('[data-status="incomplete"]');

    activeTodos.forEach(element => {
        if (element.classList.contains('completed')){
            element.classList.add('hide');
        }else{
            element.classList.remove('hide');
        }
    });
    itemsLeft.innerHTML = activeCount.length;

    showActiveButton.classList.add('selected');
    showAllButton.classList.remove('selected');
    showCompletedButton.classList.remove('selected');
}

function showCompletedTodos(){
    let completedTodos = document.querySelectorAll('.todo-item');
    let completedCount = document.querySelectorAll('.todo-item.completed').length;
    itemsLeft.innerHTML = completedCount;
    completedTodos.forEach(element => {
        if (element.classList.contains('completed')){
            element.classList.remove('hide');
        }else{
            element.classList.add('hide');
        }
    });

    showActiveButton.classList.remove('selected');
    showAllButton.classList.remove('selected');
    showCompletedButton.classList.add('selected');
}

function clearCompletedTodos(){
    savedTodos = savedTodos.filter(item => item.isCompleted == false);
    localStorage.setItem("savedTodos", JSON.stringify(savedTodos));

    let completedCount = document.querySelectorAll('.todo-item.completed');
    completedCount.forEach(element => {
        if (element.classList.contains('completed')){
            element.remove();
        }
    });

    let activeCount = document.querySelectorAll('[data-status="incomplete"]');
    itemsLeft.innerHTML = activeCount.length;
}

function themeToggler(){
    const mainbody = document.getElementById("main-body");
    mainbody.classList.toggle('black-theme');
}

todoInput.addEventListener("keypress", function(e){
    if (e.key === "Enter") {
        e.preventDefault();
        newTodo();
      }
});

addTodoButton.addEventListener("click",newTodo);
todosListWrapper.addEventListener("click",clickedOnItem);
showAllButton.addEventListener("click",showAllTodos);
showActiveButton.addEventListener("click",showActiveTodos);
showCompletedButton.addEventListener("click",showCompletedTodos);
clearCompleted.addEventListener("click",clearCompletedTodos);
themeTogglerButton.addEventListener("click",themeToggler);
showInformationWrapper();