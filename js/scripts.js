$(document).ready(()=>{
    let existTodos = getData();
    $(existTodos).each(index, todo => {
        createItem(todo, '#listTodo')
    });
    $('form').on('submit', (e) => 
    {
        e.preventDefault();
        let todo = {
            id: Date.now(),
            text: $('#todoInput').val()
        };
        console.log(todo);
        createItem(todo);
        $('#todoInput').val('');
        $('#createBtn').prop('disabled', true);
        
    });
    $('#todoInput').on('input', function()
        {
            if($('#todoInput').val().length >= 5)
            {
                $('#createBtn').prop('disabled', false);
            }else
            {
                $('#createBtn').prop('disabled', true);
            }
        })
   
    
    function createItem(item, target)
    {
        let html = '';
        let id = null;
        target = target ??  '#listTodo';
        if (target == '#listTodo') {
         id = `todo${item.id}`;

             html = `
            <li class="list-group-item">
                  <div class="row">
                    <div class="col col-md-8">
                    <input type = "text" class = "form-control" value="${item.text}" style="display:none;">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="${id}">
                        <label class="form-check-label" for="${id}">
                          ${item.text}
                        </label> 
                      </div>
                    </div>
                    <div class="col col-md-4 text-right">
                      <button type="button" class="btn btn-primary btn-sm editBtn" >Edit</button>
                      <button type="button" class="btn btn-danger btn-sm deleteBtn" >Delete</button>
                      <button type="button" class="btn btn-primary btn-sm saveBtn" style="display:none;">Save</button>
                      <button type="button" class="btn btn-danger btn-sm cancelBtn" style="display:none;">Cancel</button>
                    
                      </div>
                  </div> 
                </li>`;
                if(saveToStorage)
                {
                    let todos = gerData();
                }
            
        }else
        {
             html = ` <li class="list-group-item">${item.text}</li>`;
        }
       
        $(target).prepend(html);
        if (target == '#listTodo') {
            let parent = $(html);
            $('body').on('change','[type = "checkbox"]', function(){
                let text  = $(this).next().text().trim();
                createItem({text: text}, '#listCompleted');
                deleteItem($(this).parents('li'));
            })
            
        }
        
    }
    
    $('body').on('click', '.editBtn', function(){
    
        let parent = $(this).parents('li');
        
        hideItems(parent,['.form-check','.editBtn', '.deleteBtn']);
        showItems(parent,['[type = "text"]','.saveBtn', '.cancelBtn']);

        
        });
        $('body').on('click', '.saveBtn', function(){
    
            let parent = $(this).parents('li'),
            text = parent.find('[type = "text"]').val().trim();
            parent.find('label').text(text);
            hideItems(parent, ['[type = "text"]','.saveBtn', '.cancelBtn']);
            showItems(parent, ['.form-check','.editBtn', '.deleteBtn']);
   
            
            });
         $('body').on('click', '.cancelBtn', function(){
    
             let parent = $(this).parents('li');
             
             hideItems(parent, ['[type = "text"]','.saveBtn', '.cancelBtn']);
             showItems(parent, ['.form-check','.editBtn', '.deleteBtn']);
    
             
             });
    $('body').on('click', '.deleteBtn', function(){
        
        deleteItem($(this).parents('li'));  
    });
    function deleteItem(item)
    {
        item.remove();
    }
    function hideItems(parent, items)
    {
        $(items).each((index, item) => {
            $(parent).find(item).hide();
        })
    }
    function showItems(parent, items)
    {
        $(items).each((index, item) => {
            $(parent).find(item).fadeIn();
        })
    }
    // function getData()
    // {
    //     let data = localStorage.getItem('todos');
    //     data = data ? JSON.parse(data) : []
    //     return data;
    // }
});