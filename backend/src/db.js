// Simple in-memory database for todos

let todos = [];

module.exports = {
    getAll: () => todos,
    add: (todo) => todos.push(todo),
};
