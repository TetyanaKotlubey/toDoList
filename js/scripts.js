$(document).ready(() => {

    let existTodos = getData();

    $(existTodos).each((index, todo) => {
        createItem(todo, '#listTodo', false);
    })

    $('form').on('submit', (e) => {
        e.preventDefault();

        let todo = {
            id   : Date.now(),
            text : $('#todoInput').val()
        };

        createItem(todo, '#listTodo', true);

        $('#todoInput').val('');
        $('#createBtn').prop('disabled', true);

    });

    $('#todoInput').on('input', function() {
        if ($('#todoInput').val().length >= 5) {
            $('#createBtn').prop('disabled', false);
        } else {
            $('#createBtn').prop('disabled', true);
        }
    })

    function createItem(item, target, saveToStrorage) {
        if (typeof target == 'undefined') {
            target = '#listTodo';
        }

        let html = '', id = null;

        if (target == '#listTodo') {
            id   = `todo-${item.id}`;

            html = `<li class="list-group-item">
                <div class="row">
                    <div class="col col-md-8">
                        <input type="text" 
                               class="form-control" 
                               value="${item.text}" 
                               style="display:none;">
                        <div class="form-check">
                            <input class="form-check-input" 
                                   type="checkbox" 
                                   id="${id}">
                            <label class="form-check-label" 
                                   for="${id}">${item.text}</label>
                        </div>
                    </div>
                    <div class="col col-md-4 text-right">
                        <button type="button" 
                                class="btn btn-primary btn-sm editBtn">Edit</button>
                        <button type="button" 
                                class="btn btn-danger btn-sm deleteBtn">Delete</button>
                        <button type="button" 
                                class="btn btn-primary btn-sm saveBtn" 
                                style="display:none;">Save</button>
                        <button type="button" 
                                class="btn btn-danger btn-sm cancelBtn" 
                                style="display:none;">Cancel</button>
                    </div>
                </div>
            </li>`;

            if (saveToStrorage) {
                let todos = getData();
                todos.push(item);
                setData(todos);
            }

        } else {
            html = `<li class="list-group-item">${item.text}</li>`; 
        }

        $(target).prepend(html);

    }

    $('body').on('change', '[type="checkbox"]', function() {
        let text = $(this).next().text().trim();

        let id = $(this).attr('id').replace('todo-', '');

        let todos = getData(), index = -1;
        $(todos).each((i, todo) => {
            if (todo.id == id) {
                index = i;
            }
        })
        todos.splice(index, 1);
        setData(todos);

        createItem({text: text}, '#listCompleted', false);
        deleteItem($(this).parents('li'));
    })

    $('body').on('click', '.editBtn', function() {
        let parent = $(this).parents('li');

        hideItems(parent, ['.form-check', '.editBtn', '.deleteBtn']);
        showItems(parent, ['[type="text"]', '.saveBtn', '.cancelBtn']);
    })

    $('body').on('click', '.saveBtn', function() {
        let parent = $(this).parents('li'),
            text   = parent.find('[type="text"]').val().trim();

        parent.find('label').text(text);

        let id = parent.find('[type="checkbox"]').attr('id').replace('todo-', '');
        let todos = getData();
        $(todos).each((i, todo) => {
            if (todo.id == id) {
                todos[i].text = text;
            }
        })
        setData(todos);

        hideItems(parent, ['[type="text"]', '.saveBtn', '.cancelBtn']);
        showItems(parent, ['.form-check', '.editBtn', '.deleteBtn']);
    })

    $('body').on('click', '.cancelBtn', function() {
        let parent = $(this).parents('li');

        hideItems(parent, ['[type="text"]', '.saveBtn', '.cancelBtn']);
        showItems(parent, ['.form-check', '.editBtn', '.deleteBtn']);
    })

    $('body').on('click', '.deleteBtn', function() {
        let parent = $(this).parents('li');
        deleteItem(parent);

        let id = parent.find('[type="checkbox"]').attr('id');

        let todos = getData(), index = -1;
        $(todos).each((i, todo) => {
            if (todo.id == id) {
                index = i;
            }
        })
        todos.splice(index, 1);
        setData(todos);
    })

    function deleteItem(item) {
        item.remove();
    }

    function hideItems(parent, items) {
        $(items).each((i, item) => {
            $(parent).find(item).hide();
        })
    }

    function showItems(parent, items) {
        $(items).each((i, item) => {
            $(parent).find(item).fadeIn();
        })
    }

    function getData() {
        let data = localStorage.getItem('todos');
        data = data ? JSON.parse(data) : []
        return data;
    }

    function setData(data) {
        data = JSON.stringify(data);
        localStorage.setItem('todos', data);
    }

});