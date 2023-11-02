// the js file does not need to have "use strict", because code with the class
// body's syntactic boundary is always executed in strict mode.

class Model {
    constructor() {

        // state of the model - array for todo objects
        this.todos = JSON.parse(localStorage.getItem('todos')) || []
    }

    // a template for the tasks with id, text and state arguments
    addTodo(todoText) {
        const todo = {
            // if id > 0, then the id will be incremented by 1
            // it works by accessing the position of the last element in array
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            text: todoText,
            complete: false,
        }
        // add one or more elements to the end of an array and return the new length of the array
        this.todos.push(todo)
        this._commit(this.todos)
    }

    // Map through all todos, and replace the text of the todo with the specified id
    editTodo(id, updatedText) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? {id: todo.id, text: updatedText, complete: todo.complete} : todo
        )
        this._commit(this.todos)
    }

    // Filter a todo out of the array by id
    // creates a new array with all elements that pass the test
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this._commit(this.todos)
    }

    // Flip the complete boolean on the specified todo
    toggleTodo(id) {
        this.todos = this.todos.map((todo) =>
            todo.id === id ? {id: todo.id, text: todo.text, complete: !todo.complete} : todo,
        )
        this._commit(this.todos)
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
    }

    _commit(todos) {
        this.onTodoListChanged(todos)
        localStorage.setItem('todos', JSON.stringify(todos))
    }

}


class View {
    constructor() {    // The root element
        this.app = this.getElement('#root')

        // The title of the app
        this.title = this.createElement('h1')
        this.title.textContent = 'Not ToDo List'

        // The form, with a [type="text"] input, and a submit button
        this.form = this.createElement('form')

        this.input = this.createElement('input')
        this.input.type = 'text'
        this.input.placeholder = 'meow not meow meow'
        this.input.name = 'todo'

        this.submitButton = this.createElement('button')
        this.submitButton.textContent = 'Meow'

        // The visual representation of the todo list
        this.todoList = this.createElement('ul', 'todo-list')

        // Append the input and submit button to the form
        this.form.append(this.input, this.submitButton)

        // Append the title, form, and todo list to the app
        this.app.append(this.title, this.form, this.todoList)

        this._temporaryTodoText = ''
        this._initLocalListeners()
    }

        // Create an element with an optional CSS class
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)

        return element
    }

    // Retrieve an element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector)

        return element
    }

    // private methods
    get _todoText() {
        return this.input.value
    }

    _resetInput() {
        this.input.value = ''
    }

    // keep the view in sync with the model state
    displayTodos(todos) {
        // Delete all nodes
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild)
        }
        // Show default message
        if (todos.length === 0) {
            const p = this.createElement('p')
            p.textContent = 'Meow?'
            this.todoList.append(p)
        } else {

                // Create todo item nodes for each todo in state
                todos.forEach(todo => {
                    const li = this.createElement('li')
                    li.id = todo.id

                    // Each todo item will have a checkbox you can toggle
                    const checkbox = this.createElement('input')
                    checkbox.type = 'checkbox'
                    checkbox.checked = todo.complete

                    // The todo item text will be in a content editable span
                    const span = this.createElement('span')
                    span.contentEditable = true
                    span.classList.add('editable')

                    // If the todo is complete, it will have a strikethrough
                    if (todo.complete) {
                        const strike = this.createElement('s')
                        strike.textContent = todo.text
                        span.append(strike)
                    } else {
                        // otherwise, just display the text
                        span.textContent = todo.text
                    }

                    // The todos will also have a delete button
                    const deleteButton = this.createElement('button', 'delete')
                    deleteButton.textContent = 'Delete'
                    li.append(checkbox, span, deleteButton)

                    // Append nodes to the todo list
                    this.todoList.append(li)
                })
        }
        // Debugging
        console.log(todos)
    }

    // event listeners
    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this._todoText) {
                handler(this._todoText)
                this._resetInput()
            }
        })
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    // Send the completed value to the model
    bindEditTodo(handler) {
        this.todoList.addEventListener('focusout', event => {
            if (this._temporaryTodoText) {
                const id = parseInt(event.target.parentElement.id)

                handler(id, this._temporaryTodoText)
                this._temporaryTodoText = ''
            }
        })
    }

    // Update temporary state
    _initLocalListeners() {
        this.todoList.addEventListener('input', event => {
            if (event.target.className === 'editable') {
                this._temporaryTodoText = event.target.innerText
            }
        })
    }


}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view

        // Display initial todos
        // this.onTodoListChanged(this.model.todos)
        this.view.bindAddTodo(this.handleAddTodo)
        this.view.bindDeleteTodo(this.handleDeleteTodo)
        this.view.bindToggleTodo(this.handleToggleTodo)
        this.view.bindEditTodo(this.handleEditTodo)
        this.model.bindTodoListChanged(this.onTodoListChanged)

        // Display initial todos
        this.onTodoListChanged(this.model.todos)
    }

    onTodoListChanged = (todos) => {
        this.view.displayTodos(todos)
    }

    handleAddTodo = (todoText) => {
        this.model.addTodo(todoText)
    }

    handleEditTodo = (id, todoText) => {
        this.model.editTodo(id, todoText)
    }

    handleDeleteTodo = (id) => {
        this.model.deleteTodo(id)
    }

    handleToggleTodo = (id) => {
        this.model.toggleTodo(id)
    }

}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service_worker.js"). then(registration => {
        console.log("SW Registered!");
        console.log(registration);
    }).catch(error => {
        console.log("SW Registration Failed!");
        console.log(error);
    });
}
const app = new Controller(new Model(), new View())

