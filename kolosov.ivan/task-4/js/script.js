const usersJson = JSON.parse(localStorage.getItem('users')) || [];
let users = usersJson.map(u => {
    const user = new User(u.id, u.name);
    user.friends = u.friends || [];
    return user;
});

renderUsers();

function renderUsers() {
    const container = document.querySelector('.users')
    container.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.id = user.id;
        userDiv.innerHTML = `
            <p>User name: ${user.name}</p>
            <p>User id: ${user.id}</p>
            <p>User friends: ${user.friends}</p>
            <div>
            <input type="text" name="friendID" placeholder="ID of new friend">
                <button class="add-friend-btn">Add Friend</button>
            </div>
            <button class="delete-user-btn">Delete User</button>
            
        `;
        container.appendChild(userDiv);
    });
}

function addUser(userID, userName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof users.find(user => user.id === userID) !== 'undefined') {
                reject(new Error("User with this ID already exists"));
                return;
            }
            const newUser = new User(userID, userName);
            users = [...users, newUser];
            localStorage.setItem('users', JSON.stringify(users));
            resolve(newUser);
        }, 1000);
    });
}

function deleteUser(index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            resolve();
        }, 1000);
    });
}

function addFriend(index, friendID) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Number.isNaN(friendID)) {
                reject (new Error("Nan"));
                return;
            }   
            try {
                users[index].addFriend(friendID);
            }
            catch (error) {
                reject(error);
                return;
            }
            localStorage.setItem('users', JSON.stringify(users));
            resolve();
        }, 1000);
    });
}

document.getElementById('addUser').addEventListener('click', (event) => {
    event.target.disabled = true;
    const userID = document.getElementById('userID');
    const userName = document.getElementById('userName');
    addUser(Number.parseInt(userID.value), userName.value).then(newUser => {   
        renderUsers();
        event.target.disabled = false;
    }).catch(error => {
        console.error("Error adding user: ", error);
        event.target.disabled = false;
    });
    userID.value = '';
    userName.value = '';
});

document.querySelector('.users').addEventListener('click', (event) => {
    const user = event.target.closest('.user');
    if (!user) return;

    if (event.target.matches('.delete-user-btn')) {
        event.target.disabled = true;
        const userID = Number.parseInt(user.id);
        const userIndex = users.findIndex(user => user.id === userID);
        console.log(userIndex);
        deleteUser(userIndex).then(() => {
            renderUsers();
        });
    } else if(event.target.matches('.add-friend-btn')) {
        event.target.disabled = true;
        const userID = Number.parseInt(user.id);
        const userIndex = users.findIndex(user => user.id === userID);
        const input = event.target.parentElement.querySelector('input');
        input.disabled = true;
        const friendID = Number.parseInt(input.value);
        console.log(friendID, ' ', userIndex);
        addFriend(userIndex, friendID).then(() => {
            renderUsers();
        }).catch(error => {
            console.error("Error adding friend: ", error);
            event.target.disabled = false;
            input.disabled = false;
        });
        input.value = '';
    }
});