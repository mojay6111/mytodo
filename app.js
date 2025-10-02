// const form = document.querySelector('form');

// const input = document.querySelector('#taskInput');

// const ul = document.querySelector('#tasks');


// form.addEventListener('submit', e => {
//     e.preventDefault();

//     const li = document.createElement('li');
//     li.textContent = input.value;
//     ul.appendChild(li);
//     input.value = '';
// });

// // remove button
// ul.addEventListener('click', e => {
//     if (e.target.tagName === 'LI') {
//         ul.removeChild(e.target);
//     }
// });

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const ul = document.getElementById('todo-list');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const task = input.value.trim();
  if (task) {
    const li = document.createElement('li');
    li.textContent = task;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.onclick = function() {
      ul.removeChild(li);
    };

    li.appendChild(delBtn);
    ul.appendChild(li);
    input.value = '';
  }
});