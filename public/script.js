// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const userForm = document.getElementById('userForm');

    // Fetch users from the server
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                userList.appendChild(li);
            });
        });

    // Handle form submission
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        })
            .then(response => response.json())
            .then(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                userList.appendChild(li);
                userForm.reset();
            });
    });
});
