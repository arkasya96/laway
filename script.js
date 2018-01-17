const list = document.getElementById('list');
const formName = document.getElementById('formName');
const formUrl = document.getElementById('formUrl');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');

// fetch the dogs list
function getUsers() {
    fetch('http://localhost:3000/users')
        .then(function (response) {
            // Trasform server response to get the dogs
            response.json().then(function (users) {
                appendUsersToDOM(users);
            });
        });
};

// post dogs
function postUser() {
    // creat post object
    const postObject = {
        name: formName.value,
        email: formUrl.value
    }
    // post dog
    fetch('http://localhost:3000/users', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        // Get the new dogs list
        getUsers();
        // Reset Form
        resetForm();
    });
}

// delete dog
function deleteUser(id) {
    // delete dog
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
    }).then(function () {
        // Get the new dogs list
        getUsers();
    });
}

// update dog
function updateUser(id) {
    // creat put object
    const putObject = {
        name: formName.value,
        email: formUrl.value
    }
    // update dog
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        // Get the new dogs list
        getUsers();

        // change button event from update to add
        addButton.disabled = false;

        // remove all event from update button
        clearUpdateButtonEvents();

        // Reset Form
        resetForm();
    });
}

// copy edited dog information to form and add event listener on update button
function editUser(user) {
    // copy dog information to form
    formName.value = user.name;
    formUrl.value = user.email;
    
    // disable add button
    addButton.disabled = true;

    // clear all events update button events
    clearUpdateButtonEvents();

    // enable and add event on update button
    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateUser(user.id)
    });

}

// Create and append img and name DOM tags
function appendUsersToDOM(users) {
    // remove dog list if exist
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    // create and append tags
    for (let i = 0; i < users.length; i++) {
        // create image obj
        let email = document.createElement('span');
        email.innerText = users[i].email;
        // create name obj
        let name = document.createElement('span');
        name.innerText = users[i].name;
        
        // create button and event for edit and delete
        let editButton = document.createElement('button')
        editButton.id = "editButton";
        // add event on btn and pass dog id more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        editButton.addEventListener('click', function () {
            editUser(users[i].id);
        });
        editButton.innerText = 'Edit';
        let deleteButton = document.createElement('button')
        deleteButton.id = "deleteButton";
        // add event on btn and pass dog object more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        deleteButton.addEventListener('click', function () {
            deleteUser(users[i].id)
        });
        deleteButton.innerText = 'Delete';
        // create a container for img and name
        let container = document.createElement('div');
        // append elements to container
        
        container.appendChild(name);
        container.appendChild(email);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        // append container to DOM (list div)
        list.appendChild(container);
    }
}

// reset form
function resetForm() {
    formName.value = '';
    formUrl.value = '';
}
//  remove Update Button to clear events more at https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}
// add event listener on add button
addButton.addEventListener('click', postUser);

// get dogs
getUsers();
