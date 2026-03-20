document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const todoCount = document.getElementById('todo-count');
    const todoTabs = document.querySelectorAll('.todo-tab');
    
    let currentFilter = 'all';
    let allTodos = [];

    // Fetch and render todos on load
    fetchTodos();

    // Add todo event
    addTodoBtn.addEventListener('click', () => {
        handleAddTodo();
    });

    // Enter key event
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    });

    // Handle Add Todo logic
    function handleAddTodo() {
        const task = todoInput.value.trim();
        if (task) {
            createTodo(task);
            todoInput.value = '';
        }
    }

    // Filter Tab Click events
    todoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            todoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Set filter and re-render
            currentFilter = tab.getAttribute('data-filter');
            renderTodos(allTodos);
        });
    });

    async function fetchTodos() {
        try {
            const response = await fetch('/api/todos');
            allTodos = await response.json();
            renderTodos(allTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            todoList.innerHTML = '<p style="color: #ff4d4d; text-align: center;">Không thể tải danh sách. Vui lòng thử lại.</p>';
        }
    }

    async function createTodo(task) {
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: task, completed: false })
            });
            if (response.ok) {
                fetchTodos(); // Refresh list
            }
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    }

    async function toggleTodo(id, task, completed) {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: task, completed: !completed })
            });
            if (response.ok) {
                fetchTodos();
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    async function deleteTodo(id) {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchTodos();
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    function renderTodos(todos) {
        todoList.innerHTML = '';
        
        // Update stats
        const activeCount = todos.filter(t => !t.completed).length;
        todoCount.textContent = `${activeCount} việc đang chờ`;

        // Filter based on current selection
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `
                <div style="text-align: center; padding: 2rem; opacity: 0.5;">
                    <i class="fas fa-clipboard-list" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Không có việc nào trong danh sách này.</p>
                </div>
            `;
            return;
        }

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''} animate-in`;
            
            todoItem.innerHTML = `
                <span>${todo.task}</span>
                <div class="todo-actions">
                    <button class="complete-btn" title="${todo.completed ? 'Chưa hoàn thành' : 'Hoàn thành'}">
                        <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="delete-btn" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            const completeBtn = todoItem.querySelector('.complete-btn');
            const deleteBtn = todoItem.querySelector('.delete-btn');

            completeBtn.addEventListener('click', () => toggleTodo(todo.id, todo.task, todo.completed));
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

            todoList.appendChild(todoItem);
        });
    }
});
