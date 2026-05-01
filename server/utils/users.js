const users = [];

export const userJoin = (id, username, room) => {
  const existingIndex = users.findIndex(user => user.username === username && user.room === room);
  if (existingIndex !== -1) {
    users.splice(existingIndex, 1);
  }
  const user = { id, username, room };
  users.push(user);
  return user;
};

export const getCurrentUser = (id) => users.find(user => user.id === id);

export const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const roomUsers = (room) => users.filter(user => user.room === room);

export default { userJoin, getCurrentUser, userLeave, roomUsers };

