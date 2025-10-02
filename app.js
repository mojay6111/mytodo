const form = document.querySelector('form');

const input = document.querySelector('#taskInput');

const ul = document.querySelector('#tasks');


form.addEventListener('submit', e => {
    e.preventDefault();

    const li = document.createElement('li');
    li.textContent = input.value;
    ul.appendChild(li);
    input.value = '';
});



