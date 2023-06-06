//定義

const newTodo = document.querySelector('.new-todo');
//console.log(newTodo);
const todoList = document.querySelector('.todo-list');
//console.log(todoList);
const main = document.querySelector('.main');
//console.log(main);
const todoCount = document.querySelector('.todo-count');
//console.log(todoCount);

const toggleCount = document.querySelector('.toggle-all');
//console.log(toggleCount);

//ランダムなIDを作成
createRandomId = () => {
  return Math.random().toString(32).substring(2);
};

const updateView = () => {
  checkListItemsLength();
  updateItemCount();
};

//タスク追加
newTodo.addEventListener('keydown',(e) => {

  if(e.key === "Enter") {

    //デフォルトの挙動を無効化
    e.preventDefault();
    //console.log(newTodo);

    const value = e.target.value;
    //console.log(value);

    //空の場合は処理を終了
    if (!value) return; 

    //IDを作成  
    const id = createRandomId();
    //console.log(id);

    //入力欄を空にする
    e.target.value = "";

    newTasks(value, id);
    renderTasks();
  };
});

//タスク削除
todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('destroy')) {
    e.target.closest('li').remove();
    
    removeTasks(e.target.closest('li').dataset.id);

    renderTasks();
  };
});

//タスク完了
todoList.addEventListener('change', (e) => {
  //console.log(e.target);
  if (e.target.classList.contains('toggle')) {
    //console.log(e.target);
    e.target.closest('li').classList.toggle('completed');
  };

  updateTasks();
  updateView();
  renderTasks();
  //console.log(tasks);
});

//アイテムを削除した際に、アイテムがなくなったらmainを非表示にする
const checkListItemsLength = () => {
  const checkListItems = document.querySelectorAll('.todo-list li');
  //console.log(checkListItems);
  if (checkListItems.length === 0) {
    //console.log(checkListItems.length === 0)
    main.style.display = "none";
    //console.log('ok');
    //console.log(checkListItems.length)
  } else {
    main.style.display = "block";
    //console.log('ok');
    //console.log(checkListItems.length);
  };
};

//アイテムの数を表示
updateItemCount = () => {
  const listItems = document.querySelectorAll('.todo-list li');
  //console.log(listItems);
  const itemCount = listItems.length;
  if (itemCount === 1) {
    todoCount.textContent = `${itemCount} item left`;
  } else {
    todoCount.textContent = `${itemCount} items left`;
  }
};

//データの保存
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//もしlocalStorageにタスクが保存されていない場合（つまり localStorage.getItem("tasks") が null を返す場合）は、tasks は空の配列で初期化される
//console.log(tasks);

const newTasks = (value,id) => {
  const task = {
    id: id,
    title: value,
    completed: false,
  }
  //console.log(task);
  tasks.push(task);

   //ローカルストレージに保存
   localStorage.setItem("tasks", JSON.stringify(tasks));
};

//ローカルストレージからデータを削除
const removeTasks = (id) => {
  //配列から、引数で指定された id を持つタスクオブジェクトのインデックスを検索する
  const removeIndex = tasks.findIndex((task) => task.id === id);
  //console.log(removeIndex);

  //tasks配列から指定されたインデックス（removeIndex）の要素を削除(1要素だけ)
  tasks.splice(removeIndex, 1);

  //ローカルストレージに保存
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//ローカルストレージからデータを更新
const updateTasks = () => {
  //特定のセレクターを持つ要素を取得
  const listItems = document.querySelectorAll('.todo-list li');
  //console.log(listItems);

  //配列をループ処理
  listItems.forEach((item) => {
    //console.log(item);

    //各 li 要素の data-id 属性を取得し、変数 id に格納
    const id = item.dataset.id;
    //console.log(item.dataset.id);

    //配列から、引数で指定された id を持つタスクオブジェクトのインデックスを検索する
    //find()メソッドは、配列の各要素に対して提供されたテスト関数を実行して、その関数が初めてtrueを返した要素を返す。そういった要素が見つからない場合はundefinedを返す。
    const task = tasks.find((tasks) => tasks.id === id);
    //console.log(task);

    //チェックボックスの状態を取得
    const checkbox = item.querySelector('.toggle');
    //console.log(checkbox.checked);

    //チェックボックスの状態を更新
    task.completed = checkbox.checked;
    //console.log(task.completed);

    //li要素のクラスを更新
    if (task.completed === true) {
      item.classList.add('completed');
      //console.log(item.classList);
    } else {
      item.classList.remove('completed');
      //console.log(item.classList);
    };

    //ローカルストレージに保存
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
};

//ローカルストレージからデータを取得
const renderTasks = () => {
  
  //初期化
  todoList.innerHTML = "";
  
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  //console.log(tasks);

  //フィルターを表示させる
  const filter = document.querySelector('.filters li a.selected').textContent;
  //console.log(filter);

  const filterTasks =tasks.filter((task) => {
    if (filter === 'Active') {
      return task.completed === false;
      //console.log(task.completed);
    } else if (filter === 'Completed') {
      return task.completed === true;
    } else {
      return true;
    };
    //console.log(tasks);
  });
  //console.log(tasks);
  
  //HTMLを生成
  filterTasks.forEach((task) => { 
    const listHtml = `
    <li data-id="${task.id}">
      <div class="view">
      <input class="toggle" type="checkbox" ${task.completed ? 'checked' : ''}>
        <label class="label">${task.title}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${task.title}">
    </li>
    `;
    //console.log(listHtml);

     // HTMLを追加
     todoList.insertAdjacentHTML('beforeend', listHtml);

    // アイテム数を更新
      updateView();
  }); 
};

//ロードを待ってから実行
renderTasks();

//フィルター機能
const filterTasks = (tasks, filter) => {
  switch (filter) {
    //switch 文を使って filter の値をチェックし、それに応じて tasks をフィルタリングする
    case 'all':
      return tasks;
    case 'active':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  };
};

const getFilterFromHash = (hash) => {
  //console.log(hash);
  const filter = hash.substring(2);
  //console.log(filter);
  return filter;
};

//フィルター機能を実行2
window.addEventListener('hashchange', () => {
  const filter = getFilterFromHash(window.location.hash);
  //console.log(filter);
  const filteredTasks = filterTasks(tasks, filter);
  //console.log(filteredTasks);
  renderTasks(filteredTasks);
});

const changeSelect = document.querySelectorAll('.filters li a');
//console.log(changeSelect);

changeSelect.forEach((elem) => {
  elem.addEventListener('click',() => {
    //console.log(elem);
    changeSelect.forEach((elem) => {
      elem.classList.remove('selected');
      //console.log(elem.classList);
    });
    elem.classList.add('selected');
    //console.log(elem.classList);
  });
});
