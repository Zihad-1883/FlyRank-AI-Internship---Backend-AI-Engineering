const seedTasks = [
  {
    id: 1,
    title: "Finish the project",
    done: false,
  },
  {
    id: 2,
    title: "Write documentation",
    done: false,
  },
  {
    id: 3,
    title: "Deploy to production",
    done: false,
  },
];

const allId = [];
seedTasks.forEach((task) => allId.push(task.id));
const maxId = Math.max(...allId);

const getAllTasks = async () => {
  if (seedTasks.length === 0) {
    return {
      statusCode: 404,
      error: "No tasks found",
    };
  }
  return {
    statusCode: 200,
    data: seedTasks,
  };
};

const getSingleTask = async (id) => {
  const task = seedTasks.find((task) => task.id === parseInt(id));
  if (!task) {
    return {
      statusCode: 404,
      error: "Task not found",
    };
  } else {
    return {
      statusCode: 200,
      data: task,
    };
  }
};

const createTask = async (payload) => {
  if (
    !payload.title ||
    typeof payload.title !== "string" ||
    payload.title.trim() === ""
  ) {
    return {
      statusCode: 400,
      error: "Invalid title",
    };
  }

  const duplicateTask = seedTasks.some(
    (task) => task.title.toLowerCase() === payload.title.toLowerCase(),
  );

  if (duplicateTask) {
    return {
      statusCode: 400,
      error: "Task already exists",
    };
  }

  if (Object.keys(payload).length > 1) {
    return {
      statusCode: 400,
      error: "Only tile is allowed in the payload",
    };
  }

  const newTask = {
    id: maxId + 1,
    title: payload.title,
    done: false,
  };

  seedTasks.push(newTask);
  return {
    statusCode: 201,
    data: newTask,
  };
};

const updateTask = async (id, payload) => {
  if (
    !payload.title ||
    typeof payload.title !== "string" ||
    payload.title.trim() === ""
  ) {
    return {
      statusCode: 400,
      error: "Invalid title",
    };
  }

  if (payload.done === undefined || typeof payload.done !== "boolean") {
    return {
      statusCode: 400,
      error: "Invalid done value",
    };
  }

  const isFound = seedTasks.find((task) => task.id === parseInt(id));

  if (!isFound) {
    return {
      statusCode: 404,
      error: "Task not found",
    };
  }

  const findIndex = seedTasks.findIndex((task) => task.id === parseInt(id));
  seedTasks[findIndex] = {
    id: parseInt(id),
    title: payload.title,
    done: payload.done,
  };

  return {
    statusCode: 200,
    data: seedTasks[findIndex],
  };
};

const deleteTask = async (id) => {
  const isFound = seedTasks.find((task) => task.id === parseInt(id));
  if (!isFound) {
    return {
      statusCode: 404,
      error: "Task not found",
    };
  }

  const findIndex = seedTasks.findIndex((task) => task.id === parseInt(id));
  const task = seedTasks[findIndex];
  seedTasks.splice(findIndex, 1);
  return {
    statusCode: 204,
    message: "Task deleted successfully",
  };
};

module.exports = {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
};
