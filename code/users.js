const users = [];

function userJoin(id, username, room) {
    const existingIndex = users.findIndex(user => user.username === username && user.room === room);
    if (existingIndex !== -1) {
        users.splice(existingIndex, 1); // remove duplicate
    }

    const user = { id, username, room };
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function roomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    roomUsers
};
