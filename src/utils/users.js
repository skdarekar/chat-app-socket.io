const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Data Validation
    if (!room || !username) {
        return {
            error: "Username and room are required!"
        };
    }

    // check for existing user
    const existingUser = users.find(user => {
        return user.room === room && user.username === username;
    })
    if (existingUser) {
        return {
            error: "Username already taken!"
        };
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index != -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const user = users.find(user => user.id === id);
    return user;
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom
}