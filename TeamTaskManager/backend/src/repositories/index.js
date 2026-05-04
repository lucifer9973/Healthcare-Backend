const { createUserRepository } = require('./userRepo');
const { createProjectRepository } = require('./projectRepo');
const { createTaskRepository } = require('./taskRepo');

function createRepositories(db) {
  return {
    users: createUserRepository(db),
    projects: createProjectRepository(db),
    tasks: createTaskRepository(db)
  };
}

module.exports = { createRepositories };
